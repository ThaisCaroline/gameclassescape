import { clearTimer, startTimer } from './keyed-timer.js';

const key = (roomCode: string, studentId: string) => `jump:${roomCode}:${studentId}`;

/** Tempo de resposta de um pulo: um por aluno. */
export function startJumpTimer(roomCode: string, studentId: string, endsAt: number, onExpire: () => void): void {
  startTimer(key(roomCode, studentId), endsAt, onExpire);
}

export function clearJumpTimer(roomCode: string, studentId: string): void {
  clearTimer(key(roomCode, studentId));
}
