import { randomInt } from 'node:crypto';
import { config } from '../../config.js';
import type { Room } from '../../rooms/index.js';

export interface WhisperResult {
  targetId: string;
  questionId: string;
  removedOptions: number[];
  /** Quando este fantasma poderá sussurrar de novo. */
  readyAt: number;
}

/**
 * Fantasma elimina uma alternativa errada da pergunta aberta de um aluno.
 * Devolve null se não valer (não é fantasma, em cooldown, alvo sem pergunta aberta, limite de eliminações).
 */
export function whisper(room: Room, ghostId: string, targetId: unknown): WhisperResult | null {
  if (room.round.phase !== 'running') return null;

  const ghost = room.students.find((s) => s.id === ghostId);
  if (!ghost || ghost.status !== 'ghost') return null;

  const now = Date.now();
  if ((room.whisperReadyAt.get(ghostId) ?? 0) > now) return null;

  const pending = typeof targetId === 'string' ? room.pendingJumps.get(targetId) : undefined;
  if (!pending || pending.removedOptions.length >= config.maxRemovedOptions) return null;

  const question = room.questions.find((q) => q.id === pending.questionId);
  if (!question) return null;

  const wrongOptions = [0, 1, 2].filter(
    (i) => i !== question.correctIndex && !pending.removedOptions.includes(i),
  );
  const removed = wrongOptions[randomInt(wrongOptions.length)];
  if (removed === undefined) return null;

  pending.removedOptions.push(removed);
  const readyAt = now + config.whisperCooldownMs;
  room.whisperReadyAt.set(ghostId, readyAt);

  return {
    targetId: pending.studentId,
    questionId: pending.questionId,
    removedOptions: [...pending.removedOptions],
    readyAt,
  };
}
