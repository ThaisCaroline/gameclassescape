import type { Ack } from '@game/shared';
import { config } from '../../config.js';
import { setUpClassroom, type Room } from '../../rooms/index.js';

/** Professor inicia a rodada: monta o U, senta os alunos e libera o jogo. Exige alunos e perguntas. Não liga o timer (isso é da rede). */
export function startRound(room: Room, requesterId: string, durationMs: number = config.classDurationMs): Ack {
  if (room.round.teacherId !== requesterId) return { ok: false, error: 'not_allowed' };
  if (room.round.phase !== 'lobby') return { ok: false, error: 'invalid_state' };
  if (room.students.length === 0) return { ok: false, error: 'no_students' };
  if (room.questions.length < config.minQuestions) return { ok: false, error: 'questions_incomplete' };

  setUpClassroom(room);
  room.round.phase = 'running';
  room.round.endsAt = Date.now() + durationMs;
  return { ok: true, data: undefined };
}
