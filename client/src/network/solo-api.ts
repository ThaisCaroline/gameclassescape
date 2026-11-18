import type { Ack } from '@game/shared';
import { socket } from './socket.js';

/** O jogador leu a explicação: começa a rodada solo. */
export function startSolo(): Promise<Ack> {
  return new Promise((resolve) => socket.emit('solo:start', resolve));
}
