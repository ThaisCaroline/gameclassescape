import { endRound, type Room } from '../rooms/index.js';
import { startRoundTimer } from '../timers/index.js';
import { broadcastRoom } from './broadcast.js';
import type { GameServer } from './types.js';

/** Liga o cronômetro da aula (que encerra a rodada ao zerar) e avisa todos que a rodada começou. */
export function beginRound(io: GameServer, room: Room): void {
  startRoundTimer(room.code, room.round.endsAt ?? Date.now(), () => {
    endRound(room);
    broadcastRoom(io, room);
  });
  broadcastRoom(io, room);
}
