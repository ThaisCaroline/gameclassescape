import type { Ack } from '@game/shared';
import { validateQuestionInputs } from '../../questions/index.js';
import type { Room } from '../../rooms/index.js';

/** Professor cadastra as perguntas da partida. Substitui a lista inteira; só no lobby. */
export function setQuestions(room: Room, requesterId: string, raw: unknown): Ack {
  if (room.round.teacherId !== requesterId) return { ok: false, error: 'not_allowed' };
  if (room.round.phase !== 'lobby') return { ok: false, error: 'invalid_state' };

  const result = validateQuestionInputs(raw);
  if (!result.ok) return result;

  room.questions = result.data;
  return { ok: true, data: undefined };
}
