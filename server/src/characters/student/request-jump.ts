import { canReach, jumpDistance, type Ack, type QuestionPublic } from '@game/shared';
import { config } from '../../config.js';
import { toQuestionPublic } from '../../questions/index.js';
import { isOccupied, questionForDesk, type Room } from '../../rooms/index.js';

export interface JumpStarted {
  question: QuestionPublic;
  expiresAt: number;
}

/** Aluno pede para pular para uma carteira: valida e abre o pulo (o aluno passa a "se mover"). */
export function requestJump(room: Room, studentId: string, toDeskId: unknown): Ack<JumpStarted> {
  const student = room.students.find((s) => s.id === studentId);
  if (!student || student.status !== 'playing') return { ok: false, error: 'invalid_state' };
  if (room.round.phase !== 'running') return { ok: false, error: 'invalid_state' };
  if (room.pendingJumps.has(studentId)) return { ok: false, error: 'invalid_state' };

  const now = Date.now();
  if (student.lockedUntil !== null && student.lockedUntil > now) {
    return { ok: false, error: 'student_locked' };
  }

  const from = room.desks.find((d) => d.id === student.deskId);
  const to = typeof toDeskId === 'string' ? room.desks.find((d) => d.id === toDeskId) : undefined;
  if (!from || !to) return { ok: false, error: 'invalid_input' };
  if (!canReach(from, to)) return { ok: false, error: 'out_of_reach' };
  // Uma pessoa por cadeira. É isto que dá sentido ao pulo de 2: se a mais próxima está ocupada, passa por cima dela.
  if (isOccupied(room, to.id, studentId)) return { ok: false, error: 'desk_occupied' };

  const question = questionForDesk(room, to.id);
  if (!question) return { ok: false, error: 'invalid_state' };

  // Pular 2 cadeiras é mais rápido, mas dá menos tempo para responder.
  const timeLimit = jumpDistance(from, to) === 1 ? config.answerTimeMs : config.answerTimeFarMs;
  const expiresAt = now + timeLimit;
  room.pendingJumps.set(studentId, {
    studentId,
    toDeskId: to.id,
    questionId: question.id,
    startedAt: now,
    expiresAt,
    removedOptions: [],
  });
  student.moving = true;

  return { ok: true, data: { question: toQuestionPublic(question, []), expiresAt } };
}
