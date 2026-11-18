import { findRoom, type Room } from '../rooms/index.js';
import type { GameSocket } from './types.js';

/** Sala em que o socket está, se houver. */
export function currentRoom(socket: GameSocket): Room | undefined {
  return socket.data.roomCode ? findRoom(socket.data.roomCode) : undefined;
}
