import { clearRoundTimer } from '../timers/index.js';
import { cancelPendingJump } from './cancel-jump.js';
import type { Room } from './room.js';
import { deleteRoom } from './room-registry.js';

/** Aluno saiu (desconectou): remove da sala e libera seus timers. */
export function removeStudent(room: Room, studentId: string): void {
  cancelPendingJump(room, studentId);
  room.whisperReadyAt.delete(studentId);
  room.students = room.students.filter((s) => s.id !== studentId);
}

/** Professor saiu: encerra a sala, libera todos os timers e a remove da memória. */
export function closeRoom(room: Room): void {
  for (const cleanup of room.cleanups.splice(0)) cleanup();
  clearRoundTimer(room.code);
  for (const student of room.students) cancelPendingJump(room, student.id);
  deleteRoom(room.code);
}
