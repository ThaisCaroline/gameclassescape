import { cancelPendingJump, farthestFreeDesk, type Room } from '../../rooms/index.js';

/**
 * Professor pega um aluno. Só vale se estiver olhando para os alunos e o alvo estiver se movendo.
 * O aluno perde o pulo e é mandado para a carteira livre mais distante da porta. Devolve true se pegou.
 */
export function catchStudent(room: Room, requesterId: string, studentId: unknown): boolean {
  if (room.round.teacherId !== requesterId || room.round.phase !== 'running') return false;
  if (room.round.teacherFacing !== 'students') return false;

  const target = room.students.find((s) => s.id === studentId);
  if (!target || target.status !== 'playing' || !target.moving) return false;

  cancelPendingJump(room, target.id); // solta a cadeira que ele ia ocupar
  target.moving = false;
  // Pego: vai para o fundo da sala (a livre mais longe da porta); sem nenhuma livre, fica onde estava.
  target.deskId = farthestFreeDesk(room, target.id) ?? target.deskId;
  return true;
}
