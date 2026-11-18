import { config } from '../../config.js';
import type { Room } from '../../rooms/index.js';

/**
 * Estourou o tempo de resposta: cancela o pulo e trava o aluno na carteira atual.
 * Devolve false se não havia o que fazer (rodada acabou ou pulo já resolvido).
 */
export function timeoutJump(room: Room, studentId: string): boolean {
  if (room.round.phase !== 'running') return false;

  const student = room.students.find((s) => s.id === studentId);
  if (!student || !room.pendingJumps.delete(studentId)) return false;

  student.moving = false;
  student.lockedUntil = Date.now() + config.timeoutLockMs;
  return true;
}
