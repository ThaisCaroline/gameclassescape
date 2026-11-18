import type { DeskPublic } from './desk.js';

/** Alcance do pulo, em carteiras, sempre em linha reta (mesma linha ou mesma coluna). Pular 1 dá o tempo cheio; pular 2, menos. */
export const JUMP_RANGE = 2;

type Position = Pick<DeskPublic, 'id' | 'row' | 'col' | 'kind'>;

/** Quantas carteiras separam as duas na grade (soma das diferenças de linha e coluna). */
export function jumpDistance(from: Position, to: Position): number {
  return Math.abs(from.row - to.row) + Math.abs(from.col - to.col);
}

/** A distância em linha reta está dentro do alcance do pulo (1 ou 2 carteiras)? Não olha a regra da porta. */
export function inJumpRange(from: Position, to: Position): boolean {
  const straight = from.row === to.row || from.col === to.col;
  const distance = jumpDistance(from, to);
  return from.id !== to.id && straight && distance >= 1 && distance <= JUMP_RANGE;
}

/**
 * Dá para pular de `from` para `to`? Só em linha reta, 1 ou 2 carteiras; diagonal não vale.
 * A porta é exceção: só se entra ou sai dela de uma carteira colada (1 de distância), nunca por cima de uma carteira.
 * Regra única para servidor e cliente.
 */
export function canReach(from: Position, to: Position): boolean {
  if (!inJumpRange(from, to)) return false;
  const involvesDoor = from.kind === 'door' || to.kind === 'door';
  return !involvesDoor || jumpDistance(from, to) === 1;
}
