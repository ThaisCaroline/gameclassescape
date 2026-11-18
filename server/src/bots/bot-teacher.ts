import { catchStudent, turn } from '../characters/teacher/index.js';
import type { Room } from '../rooms/index.js';
import type { BotHooks } from './bot-hooks.js';
import { between, type BotProfile } from './difficulty.js';

export interface BotTeacher {
  think(now: number): void;
}

interface Decision {
  /** Quando reage (já com o tempo de reação e uma variação). */
  at: number;
  /** Se de fato pega (o nível pode errar). */
  will: boolean;
}

/**
 * Professor-robô: alterna entre ficar de costas (quadro) e olhar para a turma, em tempos sorteados.
 * Olhando, pega quem está se movendo, mas só depois do tempo de reação do nível (senão seria impossível).
 */
export function createBotTeacher(
  room: Room,
  id: string,
  profile: BotProfile['teacher'],
  hooks: BotHooks,
  startAt: number,
): BotTeacher {
  let until = startAt + between(profile.boardMs);
  let lookStartedAt = 0;
  const decisions = new Map<string, Decision>();

  return {
    think(now) {
      if (room.round.phase !== 'running') return;

      if (now >= until) {
        const next = room.round.teacherFacing === 'board' ? 'students' : 'board';
        if (turn(room, id, next)) {
          until = now + between(next === 'board' ? profile.boardMs : profile.lookMs);
          if (next === 'students') {
            lookStartedAt = now;
            decisions.clear();
          }
        }
      }
      if (room.round.teacherFacing !== 'students') return;

      for (const student of room.students) {
        const pending = room.pendingJumps.get(student.id);
        if (!pending || student.status !== 'playing' || !student.moving) continue;

        const key = `${student.id}:${pending.startedAt}`;
        let decision = decisions.get(key);
        if (!decision) {
          const since = Math.max(lookStartedAt, pending.startedAt);
          decision = { at: since + profile.reactionMs * (0.8 + Math.random() * 0.4), will: Math.random() < profile.catchChance };
          decisions.set(key, decision);
        }
        if (now < decision.at) continue;

        decision.at = Infinity; // uma tentativa por pulo
        if (decision.will && catchStudent(room, id, student.id)) hooks.caught(room, student.id);
      }
    },
  };
}
