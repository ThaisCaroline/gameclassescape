import { clearRoundTimer } from '../timers/index.js';
import { cancelPendingJump } from './cancel-jump.js';
import type { Room } from './room.js';

/** Encerra a rodada. Professor vence se reteve pelo menos metade da turma (quem não virou fantasma). */
export function endRound(room: Room): void {
  clearRoundTimer(room.code);
  for (const student of room.students) {
    cancelPendingJump(room, student.id);
    student.moving = false;
  }

  const retained = room.students.filter((s) => s.status === 'playing').length;
  room.round.phase = 'ended';
  room.round.endsAt = null;
  room.round.winner = retained * 2 >= room.students.length ? 'teacher' : 'students';
}

/** Se o professor já não consegue reter metade da turma, encerra antes do tempo. */
export function endRoundIfDecided(room: Room): void {
  if (room.round.phase !== 'running') return;
  const retained = room.students.filter((s) => s.status === 'playing').length;
  if (retained * 2 < room.students.length) endRound(room);
}
