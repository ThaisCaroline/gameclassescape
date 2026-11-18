import type { DeskPublic } from '@game/shared';
import Phaser from 'phaser';
import type { SceneCallbacks, ViewState } from '../view-state.js';
import { FpCamera } from './camera.js';
import { DarkOverlay } from './dark-overlay.js';
import { drawDesk } from './draw-desk.js';
import { drawStudent } from './draw-people.js';
import { drawRoom, roomBounds } from './draw-room.js';
import { FP } from './fp-config.js';
import { hitAt, tapPointFor, type HitRect } from './hit-test.js';
import { studentTint } from './student-tint.js';
import { TextPool } from './text-pool.js';

interface Drawable {
  depth: number;
  draw: () => void;
}

/**
 * A sala vista pelo professor (figuras provisórias): em pé, na frente, no meio, com o olho mais alto que o dos alunos.
 * Olhando a turma ele vê as carteiras e os alunos e toca em quem se move; de costas (para o quadro) só vê o quadro, escuro.
 */
export class TeacherFirstPersonScene extends Phaser.Scene {
  private state: ViewState | null = null;
  private readonly cam = new FpCamera();
  private readonly dark = new DarkOverlay();
  private readonly displayed = new Map<string, { x: number; y: number }>();
  private readonly clickable = new Set<string>();
  private hits: HitRect[] = [];
  private placed = false;
  private world!: Phaser.GameObjects.Graphics;
  private shade!: Phaser.GameObjects.Graphics;
  private texts!: TextPool;
  private readonly cols: number;
  private readonly rows: number;

  constructor(
    private readonly desks: DeskPublic[],
    private readonly callbacks: SceneCallbacks,
  ) {
    super('TeacherFirstPersonScene');
    this.cols = Math.max(...desks.map((d) => d.col)) + 1;
    this.rows = Math.max(...desks.map((d) => d.row)) + 1;
    this.cam.eye = FP.teacherView.eye;
    this.cam.horizon = FP.teacherView.horizon;
    this.cam.focal = FP.teacherView.focal;
    this.cam.x = (this.cols - 1) / 2;
    this.cam.y = -FP.teacherView.back;
  }

  setState(state: ViewState): void {
    this.state = state;
  }

  create(): void {
    this.world = this.add.graphics().setDepth(1);
    this.shade = this.add.graphics().setDepth(900);
    this.texts = new TextPool(this);
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // O dedo é grande e os alunos do fundo são pequenos: a área de toque tem um tamanho mínimo na tela do aparelho.
      const scale = this.scale.displaySize.width / FP.width;
      // Só quem pode ser pego entra na disputa: um colega parado, perto ou na frente, não rouba o toque.
      const catchable = this.hits.filter((h) => this.clickable.has(h.id));
      const id = hitAt(catchable, pointer.x, pointer.y, scale > 0 ? FP.touchTargetPx / scale : 0);
      if (id) this.clickStudent(id);
    });
  }

  /** Pega o aluno, se ele está se movendo e o professor está olhando para a turma. */
  clickStudent(studentId: string): boolean {
    if (!this.clickable.has(studentId)) return false;
    this.callbacks.onStudentClick?.(studentId);
    return true;
  }

  update(time: number, delta: number): void {
    const state = this.state;
    if (!state) return;
    const looking = state.room.round.teacherFacing === 'students';
    const k = 1 - Math.exp(-FP.smoothing * (delta / 1000));

    const targetYaw = looking ? Math.PI : 0; // 0 = para o quadro, 180° = para a turma
    this.cam.yaw = this.placed ? this.cam.yaw + (targetYaw - this.cam.yaw) * k : targetYaw;
    this.placed = true;

    this.render(state, time, k, looking);
  }

  private render(state: ViewState, time: number, k: number, looking: boolean): void {
    const g = this.world;
    g.clear();
    this.shade.clear();
    this.texts.begin();
    this.hits = [];
    this.clickable.clear();

    const doorDesk = this.desks.find((d) => d.kind === 'door');
    g.fillStyle(0x0b0b10, 1).fillRect(0, 0, FP.width, FP.height);
    drawRoom(g, this.cam, roomBounds(this.cols, this.rows), this.cols, this.rows, doorDesk?.col ?? this.cols - 1);

    // De costas ele não vê ninguém: carteiras e alunos só existem na cena quando olha para a turma.
    if (looking) this.drawClass(state, time, k);

    this.dark.draw(this.shade, time, state.room.difficulty, false);
    if (!looking) this.shade.fillStyle(0x000000, FP.teacherView.boardDarkness).fillRect(0, 0, FP.width, FP.height);
    this.texts.end();
  }

  private drawClass(state: ViewState, time: number, k: number): void {
    const g = this.world;
    const things: Drawable[] = [];

    for (const desk of this.desks) {
      const view = { id: desk.id, x: desk.col, y: desk.row, mode: 'none', far: false, seconds: 0 } as const;
      things.push({ depth: this.cam.depthAt(desk.col, desk.row), draw: () => void drawDesk(g, this.cam, this.texts, view, time) });
    }

    for (const student of state.room.students) {
      const desk = this.desks.find((d) => d.id === student.deskId);
      if (!desk) continue;
      const target = { x: desk.col, y: desk.row + FP.sitOffset };
      const shown = this.displayed.get(student.id) ?? { ...target };
      shown.x += (target.x - shown.x) * k;
      shown.y += (target.y - shown.y) * k;
      this.displayed.set(student.id, shown);

      const depth = this.cam.depthAt(shown.x, shown.y);
      if (state.canCatch && student.status === 'playing' && student.moving) this.clickable.add(student.id);
      things.push({
        depth,
        draw: () => {
          const body = drawStudent(g, this.cam, this.texts, {
            id: student.id,
            nickname: student.nickname,
            x: shown.x,
            y: shown.y,
            moving: student.moving && student.status === 'playing',
            ghost: student.status === 'ghost',
            tint: studentTint(student.nickname),
          }, time);
          if (body) this.hits.push({ id: student.id, depth, rect: body });
        },
      });
    }

    things.sort((a, b) => b.depth - a.depth).forEach((thing) => thing.draw());
  }

  /** Só para testes automáticos: o que o professor vê. */
  debug() {
    const state = this.state;
    return {
      ready: this.texts !== undefined,
      mode: 'teacher-first-person' as const,
      facing: state?.room.round.teacherFacing ?? null,
      camera: { x: this.cam.x, y: this.cam.y, yaw: this.cam.yaw, eye: this.cam.eye },
      logical: { width: FP.width, height: FP.height },
      students: (state?.room.students ?? []).map((s) => ({
        id: s.id,
        nickname: s.nickname,
        deskId: s.deskId,
        moving: s.moving,
        status: s.status,
        clickable: this.clickable.has(s.id),
      })),
      studentTaps: this.hits.flatMap((h) => {
        const point = tapPointFor(this.hits, h);
        return point ? [{ id: h.id, ...point, width: h.rect.x1 - h.rect.x0, height: h.rect.y1 - h.rect.y0 }] : [];
      }),
    };
  }
}
