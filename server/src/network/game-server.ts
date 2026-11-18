import type { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
import { config } from '../config.js';
import { guardAcks } from './ack-guard.js';
import { registerDisconnectHandlers } from './disconnect-handlers.js';
import { registerGhostHandlers } from './ghost-handlers.js';
import { registerRoomHandlers } from './room-handlers.js';
import { registerSoloHandlers } from './solo-handlers.js';
import { registerStudentHandlers } from './student-handlers.js';
import { registerTeacherHandlers } from './teacher-handlers.js';
import type { GameServer } from './types.js';

export function createGameServer(httpServer: HttpServer): GameServer {
  const io: GameServer = new Server(httpServer, {
    maxHttpBufferSize: config.maxMessageBytes,
    ...(config.corsOrigin ? { cors: { origin: config.corsOrigin } } : {}),
  });

  io.on('connection', (socket) => {
    guardAcks(socket); // primeiro: nenhum handler pode receber um pacote sem callback
    registerRoomHandlers(io, socket);
    registerTeacherHandlers(io, socket);
    registerStudentHandlers(io, socket);
    registerGhostHandlers(io, socket);
    registerSoloHandlers(io, socket);
    registerDisconnectHandlers(io, socket);
  });

  return io;
}
