import { clearJumpTimer } from '../timers/index.js';
import type { Room } from './room.js';

/** Cancela o pulo em andamento do aluno (e seu timer). Devolve false se não havia pulo. */
export function cancelPendingJump(room: Room, studentId: string): boolean {
  clearJumpTimer(room.code, studentId);
  return room.pendingJumps.delete(studentId);
}
