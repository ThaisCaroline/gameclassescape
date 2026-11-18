import type Phaser from 'phaser';
import type { FpCamera } from './camera.js';
import { FP } from './fp-config.js';

export interface RoomBounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

/** Limites da sala (em carteiras) a partir do tamanho da grade. */
export function roomBounds(cols: number, rows: number): RoomBounds {
  return {
    xMin: -FP.margin.left,
    xMax: cols - 1 + FP.margin.right,
    yMin: -FP.margin.front,
    yMax: rows - 1 + FP.margin.back,
  };
}

type Quad = readonly [number, number, number][];

function fill(g: Phaser.GameObjects.Graphics, cam: FpCamera, quad: Quad, color: number, alpha = 1): void {
  const poly = cam.polygon(quad);
  if (poly) g.fillStyle(color, alpha).fillPoints(poly, true);
}

/** Piso, linhas do piso, paredes, quadro e porta. A porta e o quadro ficam na parede da frente. */
export function drawRoom(g: Phaser.GameObjects.Graphics, cam: FpCamera, b: RoomBounds, cols: number, rows: number, doorX: number): void {
  const H = FP.ceiling;
  const c = FP.colors;

  fill(g, cam, [[b.xMin, b.yMin, 0], [b.xMax, b.yMin, 0], [b.xMax, b.yMax, 0], [b.xMin, b.yMax, 0]], c.floor);

  // linhas entre as carteiras, para dar noção de profundidade
  g.lineStyle(1, c.floorLine, 1);
  const line = (a: [number, number, number], z: [number, number, number]) => {
    const seg = cam.segment(a, z);
    if (seg) g.lineBetween(seg[0].x, seg[0].y, seg[1].x, seg[1].y);
  };
  for (let x = -0.5; x <= cols - 0.5; x++) line([x, b.yMin, 0], [x, b.yMax, 0]);
  for (let y = -0.5; y <= rows - 0.5; y++) line([b.xMin, y, 0], [b.xMax, y, 0]);

  fill(g, cam, [[b.xMin, b.yMin, 0], [b.xMax, b.yMin, 0], [b.xMax, b.yMin, H], [b.xMin, b.yMin, H]], c.wallFront);
  fill(g, cam, [[b.xMax, b.yMax, 0], [b.xMin, b.yMax, 0], [b.xMin, b.yMax, H], [b.xMax, b.yMax, H]], c.wallBack);
  fill(g, cam, [[b.xMin, b.yMax, 0], [b.xMin, b.yMin, 0], [b.xMin, b.yMin, H], [b.xMin, b.yMax, H]], c.wallSide);
  fill(g, cam, [[b.xMax, b.yMin, 0], [b.xMax, b.yMax, 0], [b.xMax, b.yMax, H], [b.xMax, b.yMin, H]], c.wallSide);

  // quadro (centrado) e porta (junto à carteira da porta), na parede da frente
  const mid = (cols - 1) / 2;
  const y = b.yMin + 0.01;
  fill(g, cam, [[mid - 0.95, y, 0.78], [mid + 0.95, y, 0.78], [mid + 0.95, y, 1.95], [mid - 0.95, y, 1.95]], c.boardFrame);
  fill(g, cam, [[mid - 0.85, y, 0.88], [mid + 0.85, y, 0.88], [mid + 0.85, y, 1.85], [mid - 0.85, y, 1.85]], c.board);
  fill(g, cam, [[doorX - 0.4, y, 0], [doorX + 0.4, y, 0], [doorX + 0.4, y, 1.75], [doorX - 0.4, y, 1.75]], c.door);
}
