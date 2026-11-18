import { whisper } from '../characters/ghost/index.js';
import { currentRoom } from './current-room.js';
import type { GameServer, GameSocket } from './types.js';

export function registerGhostHandlers(io: GameServer, socket: GameSocket): void {
  socket.on('ghost:whisper', (req) => {
    const room = currentRoom(socket);
    if (!room) return;

    const result = whisper(room, socket.id, req?.studentId);
    if (!result) return;

    // Só o aluno alvo e o próprio fantasma ficam sabendo; o professor não vê nada.
    io.to(result.targetId).emit('question:update', {
      questionId: result.questionId,
      removedOptions: result.removedOptions,
    });
    socket.emit('ghost:whisper_cooldown', { readyAt: result.readyAt });
  });
}
