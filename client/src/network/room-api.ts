import type { Ack, Difficulty, SoloRole } from '@game/shared';
import { socket } from './socket.js';

export function createRoom(nickname: string, difficulty: Difficulty): Promise<Ack<{ code: string }>> {
  return new Promise((resolve) => socket.emit('room:create', { nickname, difficulty }, resolve));
}

/** Sala solo: a rodada já começa, com robôs nos outros papéis. */
export function createSoloRoom(nickname: string, role: SoloRole, difficulty: Difficulty): Promise<Ack<{ code: string }>> {
  return new Promise((resolve) => socket.emit('room:create_solo', { nickname, role, difficulty }, resolve));
}

export function joinRoom(code: string, nickname: string): Promise<Ack> {
  return new Promise((resolve) => socket.emit('room:join', { code, nickname }, resolve));
}
