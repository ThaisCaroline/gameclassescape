import type { Ack } from '@game/shared';
import { socket } from './socket.js';

/** Escolhe a carteira na sala de espera (escolheu, ficou). */
export function pickSeat(deskId: string): Promise<Ack> {
  return new Promise((resolve) => socket.emit('student:pick_seat', { deskId }, resolve));
}

export function requestJump(toDeskId: string): Promise<Ack> {
  return new Promise((resolve) => socket.emit('student:request_jump', { toDeskId }, resolve));
}

export function answer(questionId: string, optionIndex: number): void {
  socket.emit('student:answer', { questionId, optionIndex });
}

export function whisper(studentId: string): void {
  socket.emit('ghost:whisper', { studentId });
}
