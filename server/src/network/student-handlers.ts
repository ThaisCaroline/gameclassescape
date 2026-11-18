import { answerJump, requestJump, timeoutJump } from '../characters/student/index.js';
import { endRoundIfDecided, pickSeat } from '../rooms/index.js';
import { startJumpTimer } from '../timers/index.js';
import { broadcastRoom } from './broadcast.js';
import { currentRoom } from './current-room.js';
import type { GameServer, GameSocket } from './types.js';

export function registerStudentHandlers(io: GameServer, socket: GameSocket): void {
  // Escolha da carteira na sala de espera (escolheu, ficou).
  socket.on('student:pick_seat', (req, ack) => {
    const room = currentRoom(socket);
    if (!room) return ack({ ok: false, error: 'room_not_found' });

    const result = pickSeat(room, socket.id, req?.deskId);
    ack(result);
    if (result.ok) broadcastRoom(io, room);
  });

  socket.on('student:request_jump', (req, ack) => {
    const room = currentRoom(socket);
    if (!room) return ack({ ok: false, error: 'room_not_found' });

    const result = requestJump(room, socket.id, req?.toDeskId);
    if (!result.ok) return ack(result);

    const { question, expiresAt } = result.data;
    startJumpTimer(room.code, socket.id, expiresAt, () => {
      if (!timeoutJump(room, socket.id)) return;
      io.to(socket.id).emit('fx:jumpscare');
      io.to(socket.id).emit('answer:result', { outcome: 'timeout' });
      broadcastRoom(io, room);
    });

    ack({ ok: true, data: undefined });
    socket.emit('question:show', { question, expiresAt });
    broadcastRoom(io, room);
  });

  socket.on('student:answer', (req) => {
    const room = currentRoom(socket);
    if (!room) return;

    const outcome = answerJump(room, socket.id, req?.questionId, req?.optionIndex);
    if (!outcome) return;

    socket.emit('answer:result', { outcome });
    endRoundIfDecided(room);
    broadcastRoom(io, room);
  });
}
