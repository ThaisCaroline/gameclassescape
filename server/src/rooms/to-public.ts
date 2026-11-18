import type { RoomPublic } from '@game/shared';
import { config } from '../config.js';
import type { Room } from './room.js';

/** Remove o que não pode ir ao cliente (perguntas com resposta certa). */
export function toRoomPublic(room: Room): RoomPublic {
  return {
    code: room.code,
    difficulty: room.difficulty,
    serverTime: Date.now(),
    desks: room.desks,
    jumpTimes: { near: config.answerTimeMs, far: config.answerTimeFarMs },
    students: room.students,
    round: room.round,
  };
}
