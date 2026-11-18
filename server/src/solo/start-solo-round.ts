import type { Ack } from '@game/shared';
import {
  BOT_TEACHER_ID,
  PROFILES,
  createBotDirector,
  createBotStudent,
  createBotTeacher,
  isBot,
  type BotHooks,
} from '../bots/index.js';
import { startRound } from '../characters/teacher/index.js';
import { config } from '../config.js';
import type { Room } from '../rooms/index.js';

/** Tempo antes de os robôs começarem a agir, para o jogador se situar. */
const HEAD_START_MS = 3000;

/** Começa a rodada de uma sala solo: monta o U, senta todos e liga os robôs. O cronômetro da aula é da camada de rede. */
export function startSoloRound(room: Room, hooks: BotHooks): Ack {
  const solo = room.solo;
  if (!solo) return { ok: false, error: 'not_allowed' };

  const profile = PROFILES[solo.difficulty];
  const teacherId = solo.role === 'teacher' ? solo.humanId : BOT_TEACHER_ID;
  const started = startRound(room, teacherId, config.soloClassDurationMs);
  if (!started.ok) return started;

  const startAt = Date.now() + HEAD_START_MS;
  const humanStudentId = solo.role === 'student' ? solo.humanId : null;
  const teacher = solo.role === 'student' ? createBotTeacher(room, BOT_TEACHER_ID, profile.teacher, hooks, startAt) : null;
  const students = room.students
    .filter((s) => isBot(s.id))
    .map((s) => createBotStudent(room, s.id, profile.student, hooks, startAt, humanStudentId));

  const director = createBotDirector(room, teacher, students, hooks);
  room.cleanups.push(director.stop);
  director.start();
  return { ok: true, data: undefined };
}
