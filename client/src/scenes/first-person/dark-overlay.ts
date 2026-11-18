import type { Difficulty } from '@game/shared';
import type Phaser from 'phaser';
import { SCENE } from '../scene-config.js';
import { FP } from './fp-config.js';

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * Escuridão da sala em primeira pessoa: uma camada preta cuja força depende da dificuldade, com luz que pisca
 * e, raramente, um apagão curto. (Provisório: sem cone de luz, só o escurecimento geral.)
 */
export class DarkOverlay {
  private flickerUntil = 0;
  private nextFlicker = 0;
  private blackoutUntil = 0;
  private nextBlackout = 0;

  draw(g: Phaser.GameObjects.Graphics, time: number, difficulty: Difficulty, ghost: boolean): void {
    const dark = SCENE.darkness[difficulty];
    const { flicker, blackout } = SCENE;

    if (this.nextBlackout === 0) this.nextBlackout = time + rand(blackout.minGapMs, blackout.maxGapMs);
    if (time >= this.nextBlackout) {
      this.blackoutUntil = time + blackout.lenMs;
      this.nextBlackout = time + rand(blackout.minGapMs, blackout.maxGapMs);
    }
    if (time >= this.nextFlicker) {
      this.flickerUntil = time + rand(flicker.minLenMs, flicker.maxLenMs);
      this.nextFlicker = time + rand(dark.flickerGapMs[0], dark.flickerGapMs[1]);
    }

    const base = ghost ? dark.ghostAmbient : dark.ambient;
    const alpha =
      time < this.blackoutUntil ? blackout.alpha : time < this.flickerUntil ? Math.min(0.95, base + flicker.extraDark) : base;
    g.fillStyle(0x000000, alpha).fillRect(0, 0, FP.width, FP.height);
  }
}
