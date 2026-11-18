import type Phaser from 'phaser';
import type { FpCamera } from './camera.js';
import { drawBox, type BoxDrawn } from './draw-box.js';
import { FP } from './fp-config.js';
import type { TextPool } from './text-pool.js';

export type DeskMode = 'none' | 'here' | 'enabled';

export interface DeskView {
  id: string;
  /** Posição no mundo: x = coluna, y = fileira. */
  x: number;
  y: number;
  mode: DeskMode;
  /** Em 'enabled': está a 2 de distância (menos tempo). */
  far: boolean;
  /** Segundos para responder se pular para esta carteira. */
  seconds: number;
}

/** Onde uma carteira ficou na tela: a caixa que a envolve e o desenho exato (polígonos das faces). */
export type Rect = BoxDrawn;

/** Desenha uma carteira e, se ao alcance (verde = 1, laranja = 2), o contorno e os segundos. Devolve onde ela ficou na tela. */
export function drawDesk(g: Phaser.GameObjects.Graphics, cam: FpCamera, texts: TextPool, desk: DeskView, time: number): Rect | null {
  const c = FP.colors;
  const rect = drawBox(
    g,
    cam,
    { cx: desk.x, cy: desk.y, width: FP.desk.width, depth: FP.desk.depth, base: 0, height: FP.desk.height },
    { top: c.deskTop, sideNS: c.deskSideNS, sideEW: c.deskSideEW },
  );
  if (!rect || desk.mode !== 'enabled') return rect;

  const color = desk.far ? c.far : c.near;
  const pulse = 0.6 + 0.4 * Math.sin(time / 180);
  g.lineStyle(3, color, pulse).strokeRect(rect.x0 - 3, rect.y0 - 3, rect.x1 - rect.x0 + 6, rect.y1 - rect.y0 + 6);

  const size = Math.max(11, Math.min(20, (rect.x1 - rect.x0) / 4));
  texts.show(`s:${desk.id}`, `${desk.seconds}s`, (rect.x0 + rect.x1) / 2, rect.y0 - 6, size, desk.far ? '#ffb26b' : '#8ce99a');
  return rect;
}
