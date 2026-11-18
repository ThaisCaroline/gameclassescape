import type { TeacherFacing } from '@game/shared';
import Phaser from 'phaser';
import type { Point } from './room-layout.js';
import { SCENE } from './scene-config.js';

export interface LightInput {
  time: number;
  teacher: Point;
  facing: TeacherFacing;
  /** Alcance da luz do professor quando olha para a turma (até a ponta mais distante da fileira). */
  reach: number;
  /** Posição do jogador local (luz pessoal); null para o professor. */
  me: Point | null;
  ambient: number;
  /** De quanto em quanto tempo a luz pisca (mín e máx, em ms); depende da dificuldade. */
  flickerGapMs: readonly [number, number];
}

interface Cone {
  apex: Point;
  dir: number;
  spread: number;
  radius: number;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const wrap = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle));

/**
 * Luz da sala: uma camada escura com "buracos" onde há luz (cone do professor, brilho pessoal).
 * A sala fica sempre legível; a luz pisca e, raramente, dá um apagão curto só de clima.
 */
export class Lighting {
  private readonly dark: Phaser.GameObjects.RenderTexture;
  private readonly mask: Phaser.GameObjects.Graphics;
  private cone: Cone = { apex: { x: 0, y: 0 }, dir: 0, spread: 0, radius: 0 };
  private me: Point | null = null;
  private flickerUntil = 0;
  private nextFlicker = 0;
  private blackoutUntil = 0;
  private nextBlackout = 0;

  constructor(scene: Phaser.Scene, width: number, height: number) {
    this.dark = scene.add.renderTexture(0, 0, width, height).setOrigin(0, 0).setDepth(10_000);
    this.mask = scene.make.graphics({}, false);
  }

  update({ time, teacher, facing, reach, me, ambient, flickerGapMs }: LightInput): void {
    const { flicker, blackout } = SCENE;
    if (this.nextBlackout === 0) this.nextBlackout = time + rand(blackout.minGapMs, blackout.maxGapMs);
    if (time >= this.nextBlackout) {
      this.blackoutUntil = time + blackout.lenMs;
      this.nextBlackout = time + rand(blackout.minGapMs, blackout.maxGapMs);
    }
    if (time >= this.nextFlicker) {
      this.flickerUntil = time + rand(flicker.minLenMs, flicker.maxLenMs);
      this.nextFlicker = time + rand(flickerGapMs[0], flickerGapMs[1]);
    }
    const flickering = time < this.flickerUntil;
    const blackedOut = time < this.blackoutUntil;
    const scale = flickering ? flicker.dim : 1;

    const looking = facing === 'students';
    this.cone = {
      apex: teacher,
      dir: looking ? Math.PI / 2 : -Math.PI / 2,
      spread: looking ? SCENE.studentsConeSpread : SCENE.boardCone.spread,
      radius: (looking ? reach : SCENE.boardCone.radius) * scale,
    };
    this.me = me;

    this.mask.clear().fillStyle(0xffffff, 0.3);
    for (const k of [1, 0.88, 0.76, 0.64]) {
      const { apex, dir, spread, radius } = this.cone;
      this.mask.beginPath().slice(apex.x, apex.y, radius * k, dir - spread / 2, dir + spread / 2).fillPath();
    }
    this.mask.fillCircle(teacher.x, teacher.y, SCENE.teacherGlow);
    if (me) this.mask.fillCircle(me.x, me.y, SCENE.personalGlow);

    const alpha = blackedOut ? blackout.alpha : flickering ? Math.min(0.95, ambient + flicker.extraDark) : ambient;
    this.dark.clear().fill(0x000000, alpha);
    this.dark.erase(this.mask);
  }

  /** Esse ponto está iluminado pelo professor ou pelo brilho pessoal agora? */
  isLit(p: Point): boolean {
    const { apex, dir, spread, radius } = this.cone;
    const distance = Math.hypot(p.x - apex.x, p.y - apex.y);
    const inCone = distance <= radius && Math.abs(wrap(Math.atan2(p.y - apex.y, p.x - apex.x) - dir)) <= spread / 2;
    const nearTeacher = distance <= SCENE.teacherGlow;
    const nearMe = this.me !== null && Math.hypot(p.x - this.me.x, p.y - this.me.y) <= SCENE.personalGlow;
    return inCone || nearTeacher || nearMe;
  }
}
