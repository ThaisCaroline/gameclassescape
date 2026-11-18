import { catchStudent, setQuestions, startRound, turn } from '../characters/teacher/index.js';
import { beginRound } from './begin-round.js';
import { broadcastRoom } from './broadcast.js';
import { currentRoom } from './current-room.js';
import type { GameServer, GameSocket } from './types.js';

export function registerTeacherHandlers(io: GameServer, socket: GameSocket): void {
  socket.on('teacher:set_questions', (req, ack) => {
    const room = currentRoom(socket);
    if (!room) return ack({ ok: false, error: 'room_not_found' });

    ack(setQuestions(room, socket.id, req?.questions));
  });

  socket.on('teacher:start_round', (ack) => {
    const room = currentRoom(socket);
    if (!room) return ack({ ok: false, error: 'room_not_found' });

    const result = startRound(room, socket.id);
    if (!result.ok) return ack(result);

    ack(result);
    beginRound(io, room);
  });

  socket.on('teacher:turn', (req) => {
    const room = currentRoom(socket);
    if (room && turn(room, socket.id, req?.facing)) broadcastRoom(io, room);
  });

  socket.on('teacher:catch', (req) => {
    const room = currentRoom(socket);
    if (!room || !catchStudent(room, socket.id, req?.studentId)) return;

    io.to(room.code).emit('fx:ruler', { studentId: req.studentId });
    io.to(req.studentId).emit('answer:result', { outcome: 'caught' });
    broadcastRoom(io, room);
  });
}
