import type { DeskKind, DeskPublic } from '@game/shared';
import { config } from '../config.js';

/**
 * A sala: grade de carteiras de frente para o quadro, da esquerda para a direita e da frente para o fundo.
 * A fileira 0 é a da frente. A carteira da porta (D) é a do canto da frente, à direita, junto ao quadro.
 *
 *    quadro            porta
 *    o  o  o  o  D     <- frente
 *    o  o  o  o  o
 *    o  o  o  o  o
 *    o  o  o  o  o
 *    o  o  o  o  o     <- fundo
 *
 * O id é `d<linha>-<coluna>`.
 */
export function createDesks(): DeskPublic[] {
  const { cols, rows } = config.grid;
  const desks: DeskPublic[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const kind: DeskKind = row === 0 && col === cols - 1 ? 'door' : 'normal';
      desks.push({ id: `d${row}-${col}`, index: row * cols + col, row, col, kind });
    }
  }
  return desks;
}
