import type { RoomPublic } from '@game/shared';
import { socket } from './socket.js';

/** `null` = fora de qualquer sala (saiu, sala fechada ou conexão caiu). */
type Listener = (room: RoomPublic | null) => void;

let current: RoomPublic | null = null;
let clockOffset = 0;
const listeners = new Set<Listener>();

function update(room: RoomPublic | null): void {
  current = room;
  if (room) clockOffset = room.serverTime - Date.now();
  for (const listener of [...listeners]) listener(room);
}

socket.on('room:state', update);
socket.on('room:closed', () => update(null));
socket.on('disconnect', () => update(null));

export function getRoom(): RoomPublic | null {
  return current;
}

/** Hora do servidor (ms). Os timestamps do estado (endsAt, lockedUntil...) são nesse relógio. */
export function serverNow(): number {
  return Date.now() + clockOffset;
}

/** Devolve a função que cancela a inscrição. */
export function subscribeRoom(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
