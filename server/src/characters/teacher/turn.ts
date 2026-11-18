import type { Room } from '../../rooms/index.js';

/** Professor vira para os alunos ou para o quadro. Devolve true se o estado mudou. */
export function turn(room: Room, requesterId: string, facing: unknown): boolean {
  if (room.round.teacherId !== requesterId || room.round.phase !== 'running') return false;
  if (facing !== 'students' && facing !== 'board') return false;
  if (room.round.teacherFacing === facing) return false;

  room.round.teacherFacing = facing;
  return true;
}
