import { DIFFICULTIES, SOLO_ROLES } from '@game/shared';
import { config } from '../config.js';
import { createSoloRoom, startSoloRound } from '../solo/index.js';
import { beginRound } from './begin-round.js';
import { createBotHooks } from './bot-hooks.js';
import { broadcastRoom } from './broadcast.js';
import { currentRoom } from './current-room.js';
import type { GameServer, GameSocket } from './types.js';

export function registerSoloHandlers(io: GameServer, socket: GameSocket): void {
  const hooks = createBotHooks(io);

  // Cria a sala solo. Ela espera no lobby até o jogador ler a explicação e tocar em "Start".
  socket.on('room:create_solo', (req, ack) => {
    if (socket.data.roomCode) return ack({ ok: false, error: 'invalid_state' });

    const nickname = typeof req?.nickname === 'string' ? req.nickname.trim() : '';
    const validRole = SOLO_ROLES.includes(req?.role);
    const validDifficulty = DIFFICULTIES.includes(req?.difficulty);
    if (nickname === '' || nickname.length > config.nicknameMaxLength || !validRole || !validDifficulty) {
      return ack({ ok: false, error: 'invalid_input' });
    }

    const room = createSoloRoom({ humanId: socket.id, nickname, role: req.role, difficulty: req.difficulty });
    if (!room) return ack({ ok: false, error: 'server_busy' });

    socket.data.roomCode = room.code;
    void socket.join(room.code);
    ack({ ok: true, data: { code: room.code } });
    broadcastRoom(io, room);
  });

  socket.on('solo:start', (ack) => {
    const room = currentRoom(socket);
    if (!room?.solo || room.solo.humanId !== socket.id) return ack({ ok: false, error: 'not_allowed' });

    const result = startSoloRound(room, hooks);
    if (!result.ok) return ack(result);

    ack(result);
    beginRound(io, room);
  });
}
