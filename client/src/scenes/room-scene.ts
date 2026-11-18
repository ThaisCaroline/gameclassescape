import type { DeskPublic } from '@game/shared';
import Phaser from 'phaser';
import { loadArtList, loadAvailableArt } from '../art/load-art.js';
import { ensurePlaceholders } from '../art/placeholders.js';
import { StudentLayer } from '../characters/student/student-layer.js';
import { createTeacherSprite, type TeacherSprite } from '../characters/teacher/teacher-sprite.js';
import { socket } from '../network/index.js';
import { DeskLayer } from './desk-layer.js';
import { Lighting } from './lighting.js';
import type { Layout } from './room-layout.js';
import { SCENE } from './scene-config.js';
import type { SceneCallbacks, ViewState } from './view-state.js';

interface Built {
  desks: DeskLayer;
  students: StudentLayer;
  teacher: TeacherSprite;
  lighting: Lighting;
}

/** A sala vista de cima (3/4): piso, carteiras, professor, alunos e a escuridão com a luz do professor. */
export class RoomScene extends Phaser.Scene {
  private state: ViewState | null = null;
  private built: Built | null = null;
  /** O professor pegou alguém: ele bate a régua, um feixe vermelho liga ele ao aluno e o aluno pisca "CAUGHT!". */
  private readonly onRuler = ({ studentId }: { studentId: string }) => {
    const built = this.built;
    if (!built) return;
    built.teacher.slam();
    built.students.flashCaught(studentId);

    const target = built.students.centerOf(studentId);
    if (!target) return;
    const from = { x: this.layout.teacher.x, y: this.layout.teacher.y - 28 };
    const beam = this.add.graphics().setDepth(10_500);
    beam.lineStyle(3, SCENE.colors.beam, 1).lineBetween(from.x, from.y, target.x, target.y);
    this.tweens.add({ targets: beam, alpha: 0, duration: SCENE.beamMs, onComplete: () => beam.destroy() });
  };

  constructor(
    private readonly layout: Layout,
    private readonly desks: DeskPublic[],
    private readonly callbacks: SceneCallbacks,
  ) {
    super('RoomScene');
  }

  setState(state: ViewState): void {
    this.state = state;
  }

  preload(): void {
    loadArtList(this);
  }

  create(): void {
    loadAvailableArt(this, () => this.build());
    socket.on('fx:ruler', this.onRuler);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => socket.off('fx:ruler', this.onRuler));
  }

  update(time: number): void {
    const { built, state } = this;
    if (!built || !state) return;

    built.desks.update(state, time);
    built.students.update(state);
    built.teacher.setFacing(state.room.round.teacherFacing);

    const me = state.meId ? built.students.centerOf(state.meId) : null;
    const dark = SCENE.darkness[state.room.difficulty]; // a sala escurece conforme a dificuldade escolhida
    built.lighting.update({
      time,
      teacher: this.layout.teacher,
      facing: state.room.round.teacherFacing,
      reach: this.layout.reach,
      me,
      ambient: state.ghostView ? dark.ghostAmbient : dark.ambient,
      flickerGapMs: dark.flickerGapMs,
    });
  }

  clickDesk(deskId: string): boolean {
    return this.built?.desks.click(deskId) ?? false;
  }

  clickStudent(studentId: string): boolean {
    return this.built?.students.click(studentId) ?? false;
  }

  /** Só para testes automáticos: o que está na cena e se está iluminado. */
  debug() {
    const { built } = this;
    return {
      ready: built !== null,
      world: { width: this.layout.width, height: this.layout.height, teacher: this.layout.teacher },
      chairs: this.desks.map((d) => ({ id: d.id, ...this.layout.deskCenter(d) })),
      doorId: this.desks.find((d) => d.kind === 'door')?.id ?? null,
      facing: this.state?.room.round.teacherFacing ?? null,
      desks: built?.desks.debug() ?? [],
      students: (built?.students.all() ?? []).map((s) => ({
        id: s.id,
        nickname: s.nickname,
        deskId: this.state?.room.students.find((r) => r.id === s.id)?.deskId ?? null,
        clickable: s.clickable,
        lit: built?.lighting.isLit(s.center()) ?? false,
        moving: s.moving,
      })),
    };
  }

  private build(): void {
    ensurePlaceholders(this);
    const { width, height, teacher } = this.layout;

    this.add.tileSprite(0, 0, width, height, 'floor').setOrigin(0, 0).setDepth(0);
    this.add.rectangle(0, 0, width, SCENE.wallHeight, 0x1c1a2b).setOrigin(0, 0).setDepth(0.5);

    this.built = {
      desks: new DeskLayer(this, this.desks, this.layout, this.callbacks),
      students: new StudentLayer(this, this.layout, this.callbacks),
      teacher: createTeacherSprite(this, teacher),
      lighting: new Lighting(this, width, height),
    };
  }
}
