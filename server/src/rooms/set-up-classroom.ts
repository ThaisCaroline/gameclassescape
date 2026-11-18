import { forbiddenSeatIds } from '@game/shared';
import type { Room } from './room.js';

/**
 * Ao começar a rodada, quem não escolheu carteira na sala de espera recebe uma sorteada entre as livres permitidas
 * (as da zona da porta continuam proibidas na largada).
 */
export function setUpClassroom(room: Room): void {
  const forbidden = forbiddenSeatIds(room.desks);
  const taken = new Set(room.students.map((s) => s.deskId).filter((id) => id !== ''));
  const free = room.desks.filter((d) => !forbidden.has(d.id) && !taken.has(d.id));

  for (let i = free.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [free[i], free[j]] = [free[j]!, free[i]!];
  }

  for (const student of room.students) {
    if (student.deskId !== '') continue;
    const desk = free.pop();
    if (!desk) break; // não deve acontecer: 20 carteiras permitidas para no máximo 15 alunos
    student.deskId = desk.id;
    student.startDeskId = desk.id;
  }
}
