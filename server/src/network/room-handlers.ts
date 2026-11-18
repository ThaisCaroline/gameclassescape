import { DIFFICULTIES } from '@game/shared';
import { addStudent, createRoom, findRoom } from '../rooms/index.js';
import { broadcastRoom } from './broadcast.js';
import type { GameServer, GameSocket } from './types.js';

export function registerRoomHandlers(io: GameServer, socket: GameSocket): void {
  socket.on('room:create', (req, ack) => {
    if (socket.data.roomCode) return ack({ ok: false, error: 'invalid_state' });
    // Quem abre a sala escolhe a dificuldade, que vale para todos.
    if (!DIFFICULTIES.includes(req?.difficulty)) return ack({ ok: false, error: 'invalid_input' });

    const room = createRoom(socket.id, req.difficulty);
    if (!room) return ack({ ok: false, error: 'server_busy' });
    socket.data.roomCode = room.code;
    void socket.join(room.code);

    ack({ ok: true, data: { code: room.code } });
    broadcastRoom(io, room);
  });

  socket.on('room:join', (req, ack) => {
    if (socket.data.roomCode) return ack({ ok: false, error: 'invalid_state' });
    if (typeof req?.code !== 'string' || typeof req?.nickname !== 'string') {
      return ack({ ok: false, error: 'invalid_input' });
    }

    const room = findRoom(req.code.trim().toUpperCase());
    if (!room) return ack({ ok: false, error: 'room_not_found' });

    const result = addStudent(room, socket.id, req.nickname);
    if (!result.ok) return ack(result);

    socket.data.roomCode = room.code;
    void socket.join(room.code);

    ack(result);
    broadcastRoom(io, room);
  });
}
