import { answerJump, requestJump } from '../characters/student/index.js';
import { whisper } from '../characters/ghost/index.js';
import type { Room } from '../rooms/index.js';
import type { BotHooks } from './bot-hooks.js';
import { between, type BotProfile } from './difficulty.js';
import { nextDeskTowardDoor } from './path-finding.js';

export interface BotStudent {
  think(now: number): void;
}

interface Plan {
  at: number;
  questionId: string;
  option: number;
}

/**
 * Colega-robô: tenta chegar à porta pulando de carteira. Só começa um pulo quando o professor está
 * de costas (às vezes, por imprudência, arrisca olhando), e responde com a taxa de acerto do nível.
 * Como fantasma, pode sussurrar para o jogador humano.
 */
export function createBotStudent(
  room: Room,
  id: string,
  profile: BotProfile['student'],
  hooks: BotHooks,
  startAt: number,
  humanStudentId: string | null,
): BotStudent {
  let nextActionAt = startAt + between(profile.idleMs);
  let plan: Plan | null = null;
  let reckless = false;
  let lastFacing = room.round.teacherFacing;

  /** Escolhe a alternativa: a certa com a taxa de acerto, senão uma errada que ainda esteja disponível. */
  function pickOption(questionId: string, removed: number[]): number {
    const question = room.questions.find((q) => q.id === questionId);
    const allowed = [0, 1, 2].filter((i) => !removed.includes(i));
    if (!question) return allowed[0] ?? 0;

    const wrong = allowed.filter((i) => i !== question.correctIndex);
    const right = allowed.includes(question.correctIndex);
    if ((Math.random() < profile.accuracy && right) || wrong.length === 0) return question.correctIndex;
    return wrong[Math.floor(Math.random() * wrong.length)]!;
  }

  function ghostThink(): void {
    if (!humanStudentId || Math.random() >= profile.whisperChance) return;
    const result = whisper(room, id, humanStudentId);
    if (result) hooks.whispered(result.targetId, result.questionId, result.removedOptions);
  }

  return {
    think(now) {
      if (room.round.phase !== 'running') return;
      const me = room.students.find((s) => s.id === id);
      if (!me) return;
      if (me.status === 'ghost') return ghostThink();

      const facing = room.round.teacherFacing;
      if (facing !== lastFacing) {
        lastFacing = facing;
        reckless = Math.random() < profile.recklessChance; // decide uma vez por "olhada" se arrisca
      }

      const pending = room.pendingJumps.get(id);
      if (pending) {
        plan ??= { at: now + between(profile.thinkMs), questionId: pending.questionId, option: pickOption(pending.questionId, pending.removedOptions) };
        if (now >= plan.at) {
          answerJump(room, id, plan.questionId, plan.option);
          plan = null;
          nextActionAt = now + between(profile.idleMs);
        }
        return;
      }
      plan = null; // sem pulo aberto (ex.: o professor pegou)

      if (now < nextActionAt || (me.lockedUntil !== null && me.lockedUntil > now)) return;
      if (facing === 'students' && !reckless) {
        nextActionAt = now + 400 + Math.random() * 600;
        return;
      }

      const target = nextDeskTowardDoor(room, id, me.deskId);
      const result = target ? requestJump(room, id, target) : null;
      if (!result?.ok) {
        nextActionAt = now + 800 + Math.random() * 800;
        return;
      }
      plan = {
        at: now + between(profile.thinkMs),
        questionId: result.data.question.id,
        option: pickOption(result.data.question.id, []),
      };
    },
  };
}
