import { inJumpRange } from './reach.js';
import type { DeskPublic } from './desk.js';

/**
 * Carteiras que NÃO podem ser escolhidas na largada: a da porta e as que estão a até 2 carteiras dela em linha reta
 * (a porta só aceita pulo de 1, mas a zona proibida continua a mesma, por decisão do usuário). Assim ninguém larga
 * colado na saída (senão chegar cedo e sentar perto da porta tiraria a graça).
 * Depois que a rodada começa, essas carteiras podem ser usadas normalmente.
 */
export function forbiddenSeatIds(desks: DeskPublic[]): Set<string> {
  const door = desks.find((d) => d.kind === 'door');
  if (!door) return new Set();
  return new Set([door.id, ...desks.filter((d) => inJumpRange(d, door)).map((d) => d.id)]);
}
