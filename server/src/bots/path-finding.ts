import { canReach, jumpsToDoor } from '@game/shared';
import { isOccupied, type Room } from '../rooms/index.js';

/**
 * Próxima carteira rumo à porta: ao alcance, livre e que deixe o aluno mais perto da saída.
 * Entre as melhores, sorteia (e às vezes escolhe uma que só "empata" com a atual, para não andar sempre igual).
 * Devolve null se não há como avançar agora.
 */
export function nextDeskTowardDoor(room: Room, studentId: string, fromDeskId: string): string | null {
  const from = room.desks.find((d) => d.id === fromDeskId);
  const distance = jumpsToDoor(room.desks);
  const here = distance.get(fromDeskId);
  if (!from || here === undefined) return null;

  const options = room.desks.filter(
    (d) =>
      canReach(from, d) &&
      !isOccupied(room, d.id, studentId) &&
      (distance.get(d.id) ?? Infinity) < here,
  );
  if (options.length === 0) return null;

  const best = Math.min(...options.map((d) => distance.get(d.id)!));
  const pool = Math.random() < 0.3 ? options : options.filter((d) => distance.get(d.id) === best);
  return pool[Math.floor(Math.random() * pool.length)]!.id;
}
