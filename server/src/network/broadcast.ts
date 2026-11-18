import { toRoomPublic, type Room } from '../rooms/index.js';
import type { GameServer } from './types.js';

/** Envia o snapshot da sala a todos que estão nela. */
export function broadcastRoom(io: GameServer, room: Room): void {
  io.to(room.code).emit('room:state', toRoomPublic(room));
}
