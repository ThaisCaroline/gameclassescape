import type { Server, Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from '@game/shared';

export interface SocketData {
  /** Sala em que este socket está; ausente antes de criar/entrar. */
  roomCode?: string;
}

export type GameServer = Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;
export type GameSocket = Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;
