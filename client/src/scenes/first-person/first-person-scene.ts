import { jumpDistance, type DeskPublic } from '@game/shared';
import Phaser from 'phaser';
import type { SceneCallbacks, ViewState } from '../view-state.js';
import { FpCamera } from './camera.js';
import { DarkOverlay } from './dark-overlay.js';
import { drawDesk, type DeskMode } from './draw-desk.js';
import { drawStudent, drawTeacher } from './draw-people.js';
import { drawRoom, roomBounds } from './draw-room.js';
import { FP } from './fp-config.js';
import { hitAt, tapPointFor, type HitRect } from './hit-test.js';
import { studentTint } from './student-tint.js';
import { TextPool } from './text-pool.js';

interface Drawable {
  depth: number;
  draw: () => void;
}

const FACING_NAMES = ['front', 'right', 'back', 'left'] as const;

/**
 * A sala em primeira pessoa (figuras provisórias): o jogador está sentado na própria carteira e vê a sala em
 * perspectiva, podendo virar para os 4 lados. Tocar numa carteira ao alcance pula para ela. A cena só desenha.
 */
export class FirstPersonScene extends Phaser.Scene {
  private state: ViewState | null = null;
  private readonly cam = new FpCamera();
  private readonly dark = new DarkOverlay();
  private readonly displayed = new Map<string, { x: number; y: number }>();
  private hits: HitRect[] = [];
  private targetYaw = 0;
  private placed = false;
  private world!: Phaser.GameObjects.Graphics;
  private shade!: Phaser.GameObjects.Graphics;
  private texts!: TextPool;
  private turnEnabled = true;

  constructor(
    private readonly desks: DeskPublic[],
    private readonly callbacks: SceneCallbacks,
  ) {
    super('FirstPersonScene');
  }

  setState(state: ViewState): void {
    this.state = state;
  }

  /** Liga/desliga o giro (desligado enquanto a pergunta cobre a tela). */
  setTurnEnabled(enabled: boolean): void {
    this.turnEnabled = enabled;
  }

  /** Vira a câmera um passo: -1 = esquerda, 1 = direita. */
  turn(direction: -1 | 1): void {
    if (this.turnEnabled) this.targetYaw += direction * FP.turnStep;
  }

  /** Para onde está olhando, em relação ao quadro: front, right, back ou left. */
  facingName(): (typeof FACING_NAMES)[number] {
    const steps = Math.round(this.targetYaw / FP.turnStep);
    return FACING_NAMES[((steps % 4) + 4) % 4]!;
  }

  create(): void {
    this.world = this.add.graphics().setDepth(1);
    this.shade = this.add.graphics().setDepth(900);
    this.texts = new TextPool(this);
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => this.onPointer(pointer.x, pointer.y));
  }

  /** Toque/clique: pula para a carteira ao alcance sob o dedo. */
  private onPointer(x: number, y: number): void {
    const id = hitAt(this.hits, x, y);
    if (id) this.callbacks.onDeskClick?.(id);
  }

  clickDesk(deskId: string): boolean {
    if (this.modeOf(deskId) !== 'enabled') return false;
    this.callbacks.onDeskClick?.(deskId);
    return true;
  }

  update(time: number, delta: number): void {
    const state = this.state;
    if (!state) return;
    const me = state.room.students.find((s) => s.id === state.meId);
    const myDesk = this.desks.find((d) => d.id === me?.deskId);
    const k = 1 - Math.exp(-FP.smoothing * (delta / 1000));

    if (myDesk) {
      const tx = myDesk.col;
      const ty = myDesk.row + FP.sitOffset;
      this.cam.x = this.placed ? this.cam.x + (tx - this.cam.x) * k : tx;
      this.cam.y = this.placed ? this.cam.y + (ty - this.cam.y) * k : ty;
      this.placed = true;
    }
    this.cam.yaw += (this.targetYaw - this.cam.yaw) * k;

    this.render(state, time, k, me?.id ?? null, me?.status === 'ghost');
  }

  private modeOf(deskId: string): DeskMode {
    const state = this.state;
    const desk = state?.room.desks.find((d) => d.id === deskId);
    const me = state?.room.students.find((s) => s.id === state.meId);
    if (!state || !desk) return 'none';
    if (desk.id === me?.deskId) return 'here';
    return state.enabledDesks.has(desk.id) ? 'enabled' : 'none';
  }

  private render(state: ViewState, time: number, k: number, meId: string | null, ghost: boolean): void {
    const g = this.world;
    g.clear();
    this.shade.clear();
    this.texts.begin();
    this.hits = [];

    const cols = Math.max(...this.desks.map((d) => d.col)) + 1;
    const rows = Math.max(...this.desks.map((d) => d.row)) + 1;
    const doorDesk = this.desks.find((d) => d.kind === 'door');
    g.fillStyle(0x0b0b10, 1).fillRect(0, 0, FP.width, FP.height);
    drawRoom(g, this.cam, roomBounds(cols, rows), cols, rows, doorDesk?.col ?? cols - 1);

    const me = state.room.students.find((s) => s.id === meId);
    const here = this.desks.find((d) => d.id === me?.deskId);
    const things: Drawable[] = [];

    for (const desk of this.desks) {
      const mode = this.modeOf(desk.id);
      if (mode === 'here') continue; // a minha carteira é desenhada em primeiro plano
      const view = {
        id: desk.id,
        x: desk.col,
        y: desk.row,
        mode,
        far: mode === 'enabled' && here !== undefined && jumpDistance(here, desk) > 1,
        seconds: Math.round((here !== undefined && jumpDistance(here, desk) > 1 ? state.room.jumpTimes.far : state.room.jumpTimes.near) / 1000),
      };
      const depth = this.cam.depthAt(desk.col, desk.row);
      things.push({
        depth,
        draw: () => {
          const rect = drawDesk(g, this.cam, this.texts, view, time);
          if (rect) this.hits.push({ id: desk.id, depth, rect });
        },
      });
    }

    for (const student of state.room.students) {
      const desk = this.desks.find((d) => d.id === student.deskId);
      if (student.id === meId || !desk) continue;
      const target = { x: desk.col, y: desk.row + FP.sitOffset };
      const shown = this.displayed.get(student.id) ?? { ...target };
      shown.x += (target.x - shown.x) * k;
      shown.y += (target.y - shown.y) * k;
      this.displayed.set(student.id, shown);
      things.push({
        depth: this.cam.depthAt(shown.x, shown.y),
        draw: () =>
          drawStudent(g, this.cam, this.texts, {
            id: student.id,
            nickname: student.nickname,
            x: shown.x,
            y: shown.y,
            moving: student.moving && student.status === 'playing',
            ghost: student.status === 'ghost',
            tint: studentTint(student.nickname),
          }, time),
      });
    }

    const teacherAt = { x: (cols - 1) / 2, y: -FP.teacherFront };
    const looking = state.room.round.teacherFacing === 'students';
    things.push({ depth: this.cam.depthAt(teacherAt.x, teacherAt.y), draw: () => drawTeacher(g, this.cam, this.texts, teacherAt, looking) });

    things.sort((a, b) => b.depth - a.depth).forEach((thing) => thing.draw());

    // a minha carteira, na frente de mim, na parte de baixo da tela
    g.fillStyle(FP.colors.myDesk, 1).fillPoints(
      [{ x: FP.width * 0.1, y: FP.height }, { x: FP.width * 0.9, y: FP.height }, { x: FP.width * 0.8, y: FP.height * 0.9 }, { x: FP.width * 0.2, y: FP.height * 0.9 }],
      true,
    );
    g.lineStyle(2, 0x000000, 0.4).strokeRect(FP.width * 0.2, FP.height * 0.9, FP.width * 0.6, 1);

    this.dark.draw(this.shade, time, state.room.difficulty, ghost);
    this.texts.end();
  }

  /** Só para testes automáticos: o que a câmera vê. */
  debug() {
    const state = this.state;
    return {
      ready: this.texts !== undefined,
      mode: 'first-person' as const,
      facing: state?.room.round.teacherFacing ?? null,
      facingName: this.facingName(),
      camera: { x: this.cam.x, y: this.cam.y, yaw: this.cam.yaw },
      logical: { width: FP.width, height: FP.height },
      desks: this.desks.map((d) => ({ id: d.id, mode: this.modeOf(d.id) })),
      deskRects: this.hits.map((h) => ({ id: h.id, x0: h.rect.x0, y0: h.rect.y0, x1: h.rect.x1, y1: h.rect.y1 })),
      deskTaps: this.hits.flatMap((h) => {
        const point = tapPointFor(this.hits, h);
        return point ? [{ id: h.id, ...point }] : [];
      }),
      students: (state?.room.students ?? []).map((s) => ({ id: s.id, nickname: s.nickname, deskId: s.deskId, moving: s.moving, status: s.status })),
    };
  }
}
