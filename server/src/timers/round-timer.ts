import { clearTimer, startTimer } from './keyed-timer.js';

const key = (roomCode: string) => `round:${roomCode}`;

/** Cronômetro da aula: um por sala. */
export function startRoundTimer(roomCode: string, endsAt: number, onExpire: () => void): void {
  startTimer(key(roomCode), endsAt, onExpire);
}

export function clearRoundTimer(roomCode: string): void {
  clearTimer(key(roomCode));
}
