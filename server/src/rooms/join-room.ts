import type { Ack } from '@game/shared';
import { config } from '../config.js';
import type { Room } from './room.js';

/** Adiciona um aluno à sala. A cadeira só é definida quando a rodada começa (ver `setUpClassroom`). */
export function addStudent(room: Room, studentId: string, rawNickname: string): Ack {
  const nickname = rawNickname.trim();
  if (nickname.length === 0 || nickname.length > config.nicknameMaxLength) {
    return { ok: false, error: 'invalid_input' };
  }
  if (room.round.phase !== 'lobby') return { ok: false, error: 'invalid_state' };
  if (room.students.length >= config.maxStudents) return { ok: false, error: 'room_full' };

  room.students.push({
    id: studentId,
    nickname,
    deskId: '',
    startDeskId: '',
    status: 'playing',
    lockedUntil: null,
    moving: false,
  });
  return { ok: true, data: undefined };
}
