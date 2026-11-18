import { canReach, type RoomPublic, type StudentPublic } from '@game/shared';

/** Cadeiras para onde o aluno pode pular agora: ao alcance (1 ou 2 de distância), livres, e ele não está travado. */
export function reachableDesks(room: RoomPublic, me: StudentPublic, now: number): Set<string> {
  const here = room.desks.find((d) => d.id === me.deskId);
  const locked = me.lockedUntil !== null && me.lockedUntil > now;
  if (!here || locked || me.status !== 'playing' || room.round.phase !== 'running') return new Set();

  // Uma pessoa por cadeira: as ocupadas (por quem ainda joga) não entram. O servidor confere de novo, inclusive quem está a caminho.
  const taken = new Set(room.students.filter((s) => s.id !== me.id && s.status === 'playing').map((s) => s.deskId));
  return new Set(
    room.desks
      .filter((d) => canReach(here, d) && !taken.has(d.id))
      .map((d) => d.id),
  );
}
