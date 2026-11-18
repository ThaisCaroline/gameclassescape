import type { Question } from '../questions/index.js';
import type { Room } from './room.js';

/**
 * A pergunta de uma carteira. Há menos perguntas que carteiras, então elas se repetem em rodízio pela posição
 * da carteira (carteiras vizinhas nunca têm a mesma pergunta, enquanto houver 2 ou mais).
 */
export function questionForDesk(room: Room, deskId: string): Question | undefined {
  const position = room.desks.findIndex((d) => d.id === deskId);
  if (position < 0 || room.questions.length === 0) return undefined;
  return room.questions[position % room.questions.length];
}
