import { forbiddenSeatIds, type Ack } from '@game/shared';
import type { Room } from './room.js';

/** Aluno escolhe a carteira na sala de espera. Quem chega primeiro escolhe primeiro; escolheu, ficou (não troca). */
export function pickSeat(room: Room, studentId: string, deskId: unknown): Ack {
  const student = room.students.find((s) => s.id === studentId);
  if (!student || room.round.phase !== 'lobby') return { ok: false, error: 'invalid_state' };
  if (student.deskId !== '') return { ok: false, error: 'seat_chosen' };

  const desk = typeof deskId === 'string' ? room.desks.find((d) => d.id === deskId) : undefined;
  if (!desk) return { ok: false, error: 'invalid_input' };
  if (forbiddenSeatIds(room.desks).has(desk.id)) return { ok: false, error: 'seat_forbidden' };
  if (room.students.some((s) => s.deskId === desk.id)) return { ok: false, error: 'seat_taken' };

  student.deskId = desk.id;
  student.startDeskId = desk.id;
  return { ok: true, data: undefined };
}
