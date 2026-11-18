import type { AnswerOutcome, QuestionPublic } from '@game/shared';
import { config } from '../../config.js';
import { serverNow, socket, subscribeRoom } from '../../network/index.js';

export interface ActiveQuestion {
  data: QuestionPublic;
  /** Fim do tempo de resposta, no relógio do servidor. */
  expiresAt: number;
  /** Tempo total que o aluno tinha ao receber a pergunta (para a barra de tempo). */
  totalMs: number;
}

/** O que o aluno (ou fantasma) sabe além do estado da sala: pergunta aberta, resultado e cooldown. */
export interface StudentState {
  question: ActiveQuestion | null;
  feedback: AnswerOutcome | null;
  whisperReadyAt: number | null;
}

export const studentState: StudentState = { question: null, feedback: null, whisperReadyAt: null };

const listeners = new Set<() => void>();
let feedbackTimer: ReturnType<typeof setTimeout> | undefined;

function notify(): void {
  for (const listener of [...listeners]) listener();
}

function reset(): void {
  clearTimeout(feedbackTimer);
  studentState.question = null;
  studentState.feedback = null;
  studentState.whisperReadyAt = null;
}

socket.on('question:show', ({ question, expiresAt }) => {
  clearTimeout(feedbackTimer);
  studentState.feedback = null;
  studentState.question = { data: question, expiresAt, totalMs: Math.max(1, expiresAt - serverNow()) };
  notify();
});

socket.on('question:update', ({ questionId, removedOptions }) => {
  const active = studentState.question;
  if (active && active.data.id === questionId) {
    active.data = { ...active.data, removedOptions };
    notify();
  }
});

socket.on('answer:result', ({ outcome }) => {
  studentState.question = null;
  studentState.feedback = outcome;
  clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(() => {
    studentState.feedback = null;
    notify();
  }, config.feedbackMs);
  notify();
});

socket.on('ghost:whisper_cooldown', ({ readyAt }) => {
  studentState.whisperReadyAt = readyAt;
  notify();
});

subscribeRoom((room) => {
  if (room === null) reset();
});

/** Devolve a função que cancela a inscrição. */
export function subscribeStudent(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
