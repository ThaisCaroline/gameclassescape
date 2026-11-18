import { jumpsToDoor } from '@game/shared';
import type { Room } from './room.js';

/**
 * A carteira está ocupada? Conta quem está sentado nela (os fantasmas não: já escaparam) e quem está
 * a caminho dela (pulo aberto), para dois alunos nunca disputarem a mesma. `exceptId` ignora o próprio aluno.
 */
export function isOccupied(room: Room, deskId: string, exceptId?: string): boolean {
  const seated = room.students.some((s) => s.id !== exceptId && s.status === 'playing' && s.deskId === deskId);
  const heading = [...room.pendingJumps.values()].some((p) => p.studentId !== exceptId && p.toDeskId === deskId);
  return seated || heading;
}

/**
 * Carteira livre mais distante da porta, em pulos (empate: sorteia entre as mais distantes). Nunca a da porta.
 * É para onde vai quem foi pego pelo professor.
 */
export function farthestFreeDesk(room: Room, exceptId: string): string | null {
  const distance = jumpsToDoor(room.desks);
  const free = room.desks.filter((d) => d.kind !== 'door' && !isOccupied(room, d.id, exceptId));
  if (free.length === 0) return null;

  const farthest = Math.max(...free.map((d) => distance.get(d.id) ?? 0));
  const pool = free.filter((d) => (distance.get(d.id) ?? 0) === farthest);
  return pool[Math.floor(Math.random() * pool.length)]!.id;
}
