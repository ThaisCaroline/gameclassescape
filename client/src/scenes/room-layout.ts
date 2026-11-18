import type { DeskPublic } from '@game/shared';
import { SCENE } from './scene-config.js';

export interface Point {
  x: number;
  y: number;
}

export interface Layout {
  width: number;
  height: number;
  /** Centro da carteira. */
  deskCenter(desk: DeskPublic): Point;
  /** Onde o professor fica: na frente, no corredor entre o quadro e a fileira da frente. */
  teacher: Point;
  /** Quadro, na parede de cima. */
  board: Point;
  /** Porta, na parede, ao lado do quadro, acima da carteira da porta. */
  door: Point | null;
  /** Distância do professor até a carteira mais distante (alcance da luz dele). */
  reach: number;
}

/** Posições no mundo a partir da grade de carteiras (`row`/`col`). A fileira 0 é a da frente, junto ao quadro. */
export function createLayout(desks: DeskPublic[]): Layout {
  const { tile, wallHeight, frontAisle, roomBottomGap } = SCENE;
  const cols = Math.max(...desks.map((d) => d.col)) + 1;
  const rows = Math.max(...desks.map((d) => d.row)) + 1;
  const top = wallHeight + frontAisle;

  const width = cols * tile;
  const height = top + rows * tile + roomBottomGap;
  const deskCenter = (desk: DeskPublic): Point => ({ x: desk.col * tile + tile / 2, y: top + desk.row * tile + tile / 2 });

  const teacher = { x: width / 2, y: top - 6 };
  const doorDesk = desks.find((d) => d.kind === 'door');
  const farthest = Math.max(...desks.map((d) => Math.hypot(deskCenter(d).x - teacher.x, deskCenter(d).y - teacher.y)));

  return {
    width,
    height,
    deskCenter,
    teacher,
    board: { x: width / 2, y: wallHeight / 2 },
    door: doorDesk ? { x: deskCenter(doorDesk).x, y: wallHeight / 2 } : null,
    reach: farthest + tile,
  };
}
