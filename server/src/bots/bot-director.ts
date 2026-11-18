import type { Room } from '../rooms/index.js';
import { endRoundIfDecided } from '../rooms/index.js';
import type { BotHooks } from './bot-hooks.js';
import type { BotStudent } from './bot-student.js';
import type { BotTeacher } from './bot-teacher.js';

const TICK_MS = 250;

export interface BotDirector {
  start(): void;
  stop(): void;
}

/** Faz os robôs "pensarem" a cada instante, enquanto a rodada está em andamento. */
export function createBotDirector(room: Room, teacher: BotTeacher | null, students: BotStudent[], hooks: BotHooks): BotDirector {
  let timer: ReturnType<typeof setInterval> | null = null;

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  return {
    start() {
      timer = setInterval(() => {
        if (room.round.phase !== 'running') return stop();

        const now = Date.now();
        teacher?.think(now);
        for (const student of students) student.think(now);

        // O professor-robô vira: avisa todos. Também pode ter acabado a rodada (ninguém mais retido).
        endRoundIfDecided(room);
        hooks.changed(room);
        if (room.round.phase !== 'running') stop();
      }, TICK_MS);
    },
    stop,
  };
}
