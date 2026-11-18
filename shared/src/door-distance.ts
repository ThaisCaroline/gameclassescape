import type { DeskPublic } from './desk.js';
import { canReach } from './reach.js';

/** Quantos pulos faltam, em cada carteira, até a porta (busca em largura a partir da porta, só pulos em linha reta). */
export function jumpsToDoor(desks: readonly DeskPublic[]): Map<string, number> {
  const door = desks.find((d) => d.kind === 'door');
  const distance = new Map<string, number>();
  if (!door) return distance;

  distance.set(door.id, 0);
  const queue = [door];
  for (let i = 0; i < queue.length; i++) {
    const current = queue[i]!;
    for (const next of desks) {
      if (!distance.has(next.id) && canReach(current, next)) {
        distance.set(next.id, distance.get(current.id)! + 1);
        queue.push(next);
      }
    }
  }
  return distance;
}
