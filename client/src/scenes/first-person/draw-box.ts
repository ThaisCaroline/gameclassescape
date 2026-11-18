import type Phaser from 'phaser';
import type { FpCamera, ScreenPoint } from './camera.js';

export interface BoxColors {
  top: number;
  /** Faces voltadas para o norte/sul e para o leste/oeste (cores diferentes dão volume). */
  sideNS: number;
  sideEW: number;
}

export interface BoxDrawn {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  /** Os polígonos de cada face desenhada (para saber exatamente onde o jogador está tocando). */
  polys: ScreenPoint[][];
}

export interface BoxShape {
  /** Centro no chão (x = coluna, y = fileira) e tamanho em x e y. */
  cx: number;
  cy: number;
  width: number;
  depth: number;
  /** Altura da base e do topo. */
  base: number;
  height: number;
}

/**
 * Desenha uma caixa (carteira, tronco, pernas) vista da câmera: só as faces voltadas para o olho.
 * Devolve a caixa que envolve o que foi desenhado na tela (para o toque e para os contornos).
 */
export function drawBox(
  g: Phaser.GameObjects.Graphics,
  cam: FpCamera,
  box: BoxShape,
  colors: BoxColors,
  alpha = 1,
): BoxDrawn | null {
  const hx = box.width / 2;
  const hy = box.depth / 2;
  const { base, height } = box;
  const x0 = box.cx - hx;
  const x1 = box.cx + hx;
  const y0 = box.cy - hy;
  const y1 = box.cy + hy;

  // Cada face: 4 pontos, a normal (para saber se olha para a câmera) e a cor.
  const faces = [
    { pts: [[x0, y0, base], [x1, y0, base], [x1, y0, height], [x0, y0, height]], nx: 0, ny: -1, color: colors.sideNS },
    { pts: [[x1, y1, base], [x0, y1, base], [x0, y1, height], [x1, y1, height]], nx: 0, ny: 1, color: colors.sideNS },
    { pts: [[x0, y1, base], [x0, y0, base], [x0, y0, height], [x0, y1, height]], nx: -1, ny: 0, color: colors.sideEW },
    { pts: [[x1, y0, base], [x1, y1, base], [x1, y1, height], [x1, y0, height]], nx: 1, ny: 0, color: colors.sideEW },
    { pts: [[x0, y0, height], [x1, y0, height], [x1, y1, height], [x0, y1, height]], nx: 0, ny: 0, color: colors.top },
  ] as const;

  let bounds: BoxDrawn | null = null;
  const grow = (p: ScreenPoint) => {
    bounds = bounds
      ? { ...bounds, x0: Math.min(bounds.x0, p.x), y0: Math.min(bounds.y0, p.y), x1: Math.max(bounds.x1, p.x), y1: Math.max(bounds.y1, p.y) }
      : { x0: p.x, y0: p.y, x1: p.x, y1: p.y, polys: [] };
  };

  for (const face of faces) {
    const isTop = face.nx === 0 && face.ny === 0;
    const facing = isTop
      ? cam.eye > height // o olho está acima do tampo: dá para ver o topo
      : face.nx * (cam.x - box.cx) + face.ny * (cam.y - box.cy) > 0;
    if (!facing) continue;

    const poly = cam.polygon(face.pts);
    if (!poly) continue;
    g.fillStyle(face.color, alpha).fillPoints(poly, true);
    g.lineStyle(1, 0x000000, 0.35 * alpha).strokePoints(poly, true);
    poly.forEach(grow);
    (bounds as BoxDrawn | null)?.polys.push(poly);
  }
  return bounds;
}
