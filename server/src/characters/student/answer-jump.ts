import type { AnswerOutcome } from '@game/shared';
import { config } from '../../config.js';
import { cancelPendingJump, type Room } from '../../rooms/index.js';

/**
 * Aluno responde a pergunta do pulo em andamento.
 * Certa: muda de carteira e fica parado por uns segundos (se for a porta, escapa e vira fantasma). Errada: fica preso na própria carteira por alguns segundos.
 * Devolve null se a resposta não vale (sem pulo aberto, tempo estourado, alternativa inválida etc.).
 */
export function answerJump(
  room: Room,
  studentId: string,
  questionId: unknown,
  optionIndex: unknown,
): AnswerOutcome | null {
  if (room.round.phase !== 'running') return null;

  const student = room.students.find((s) => s.id === studentId);
  const pending = room.pendingJumps.get(studentId);
  if (!student || student.status !== 'playing' || !pending) return null;
  if (questionId !== pending.questionId) return null;

  if (typeof optionIndex !== 'number' || !Number.isInteger(optionIndex)) return null;
  if (optionIndex < 0 || optionIndex > 2 || pending.removedOptions.includes(optionIndex)) return null;

  const now = Date.now();
  if (now > pending.expiresAt) return null; // o timer de estouro cuida deste caso

  const question = room.questions.find((q) => q.id === pending.questionId);
  const to = room.desks.find((d) => d.id === pending.toDeskId);
  if (!question || !to) return null;

  cancelPendingJump(room, studentId);
  student.moving = false;

  // Errou: fica preso na PRÓPRIA carteira por alguns segundos (sem susto). A carteira de destino continua livre.
  if (optionIndex !== question.correctIndex) {
    student.lockedUntil = now + config.wrongLockMs;
    return 'wrong';
  }

  student.deskId = to.id;
  if (to.kind === 'door') student.status = 'ghost';
  else student.lockedUntil = now + config.restAfterJumpMs; // pausa na carteira nova antes do próximo pulo
  return 'correct';
}
