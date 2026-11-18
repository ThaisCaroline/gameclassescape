import type { BotHooks } from '../bots/index.js';
import type { Room } from '../rooms/index.js';
import { broadcastRoom } from './broadcast.js';
import type { GameServer } from './types.js';

/** Quando um robô é pego, a batida de régua não pode tremer a tela do jogador a cada segundo. */
const BOT_RULER_COOLDOWN_MS = 2500;

/** Liga os robôs à rede: o que eles fazem chega aos jogadores humanos como qualquer outra ação. */
export function createBotHooks(io: GameServer): BotHooks {
  const lastRuler = new WeakMap<Room, number>();

  return {
    changed: (room) => broadcastRoom(io, room),
    caught(room, studentId) {
      const now = Date.now();
      const isHuman = studentId === room.solo?.humanId;
      if (isHuman || now - (lastRuler.get(room) ?? 0) >= BOT_RULER_COOLDOWN_MS) {
        lastRuler.set(room, now);
        io.to(room.code).emit('fx:ruler', { studentId });
      }
      io.to(studentId).emit('answer:result', { outcome: 'caught' });
      broadcastRoom(io, room);
    },
    whispered(humanId, questionId, removedOptions) {
      io.to(humanId).emit('question:update', { questionId, removedOptions });
    },
  };
}
