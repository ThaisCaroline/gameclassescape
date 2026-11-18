import type Phaser from 'phaser';
import type { FpCamera } from './camera.js';
import { drawBox, type BoxDrawn } from './draw-box.js';
import { FP } from './fp-config.js';
import type { TextPool } from './text-pool.js';

export interface StudentView {
  id: string;
  nickname: string;
  /** Posição no mundo (já suavizada). */
  x: number;
  y: number;
  moving: boolean;
  ghost: boolean;
  tint: number;
}

const shade = (color: number, factor: number): number => {
  const r = Math.round(((color >> 16) & 255) * factor);
  const g = Math.round(((color >> 8) & 255) * factor);
  const b = Math.round((color & 255) * factor);
  return (r << 16) | (g << 8) | b;
};

/** Um aluno sentado: tronco, cabeça, nome e, se estiver se movendo, um anel vermelho no chão. Devolve onde o tronco ficou na tela (para o toque). */
export function drawStudent(g: Phaser.GameObjects.Graphics, cam: FpCamera, texts: TextPool, s: StudentView, time: number): BoxDrawn | null {
  const alpha = s.ghost ? 0.45 : 1;
  const body = drawBox(
    g,
    cam,
    { cx: s.x, cy: s.y, width: 0.38, depth: 0.24, base: 0.22, height: 0.88 },
    { top: s.tint, sideNS: shade(s.tint, 0.8), sideEW: shade(s.tint, 0.62) },
    alpha,
  );

  const head = cam.project(s.x, s.y, 1.06);
  if (!head) return body;
  g.fillStyle(FP.colors.skin, alpha).fillCircle(head.x, head.y, 0.15 * head.size);

  const feet = cam.project(s.x, s.y, 0);
  if (s.moving && feet) {
    const pulse = 0.65 + 0.35 * Math.sin(time / 140);
    g.lineStyle(3, FP.colors.moving, pulse).strokeEllipse(feet.x, feet.y, 0.8 * feet.size, 0.22 * feet.size);
  }
  if (head.size > 36) {
    texts.show(`n:${s.id}`, s.nickname, head.x, head.y - 0.2 * head.size, Math.max(10, Math.min(18, head.size / 7)), s.ghost ? '#9aa0b4' : '#ffffff');
  }
  return body;
}

/** O professor, no corredor da frente: de frente para a turma (com olhos e um "!") ou de costas, virado para o quadro. */
export function drawTeacher(
  g: Phaser.GameObjects.Graphics,
  cam: FpCamera,
  texts: TextPool,
  at: { x: number; y: number },
  facingStudents: boolean,
): void {
  const c = FP.colors;
  drawBox(g, cam, { cx: at.x, cy: at.y, width: 0.3, depth: 0.2, base: 0, height: 0.6 }, { top: c.suitDark, sideNS: c.suitDark, sideEW: c.suitDark });
  drawBox(g, cam, { cx: at.x, cy: at.y, width: 0.46, depth: 0.28, base: 0.6, height: 1.48 }, { top: c.suit, sideNS: c.suit, sideEW: shade(c.suit, 0.8) });

  const head = cam.project(at.x, at.y, 1.7);
  if (!head) return;
  g.fillStyle(c.skin, 1).fillCircle(head.x, head.y, 0.19 * head.size);

  const seenFromFront = facingStudents && cam.y > at.y;
  if (seenFromFront) {
    g.fillStyle(0x111111, 1);
    g.fillCircle(head.x - 0.07 * head.size, head.y - 0.01 * head.size, 0.025 * head.size);
    g.fillCircle(head.x + 0.07 * head.size, head.y - 0.01 * head.size, 0.025 * head.size);
  } else {
    g.fillStyle(c.hair, 1).fillCircle(head.x, head.y - 0.03 * head.size, 0.17 * head.size);
  }
  if (facingStudents) texts.show('teacher-alert', '!', head.x, head.y - 0.25 * head.size, Math.max(14, Math.min(34, head.size / 5)), '#ff6b6b');
}
