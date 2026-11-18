import { closeRoom, endRoundIfDecided, removeStudent } from '../rooms/index.js';
import { broadcastRoom } from './broadcast.js';
import { currentRoom } from './current-room.js';
import type { GameServer, GameSocket } from './types.js';

export function registerDisconnectHandlers(io: GameServer, socket: GameSocket): void {
  socket.on('disconnect', () => {
    const room = currentRoom(socket);
    if (!room) return;

    // O professor sai, ou o único humano de uma sala solo sai: não há mais ninguém para jogar, encerra tudo.
    if (room.round.teacherId === socket.id || room.solo?.humanId === socket.id) {
      io.to(room.code).emit('room:closed');
      for (const id of io.sockets.adapter.rooms.get(room.code) ?? []) {
        const member = io.sockets.sockets.get(id);
        if (member) {
          member.data.roomCode = undefined;
          void member.leave(room.code);
        }
      }
      closeRoom(room);
      return;
    }

    removeStudent(room, socket.id);
    endRoundIfDecided(room);
    broadcastRoom(io, room);
  });
}
