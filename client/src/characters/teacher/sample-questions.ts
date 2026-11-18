import { SAMPLE_QUESTIONS } from '@game/shared';
import type { QuestionDraft } from './question-drafts.js';

/** Pergunta de exemplo para a carteira de índice `i` (cicla se houver mais carteiras que exemplos). */
export function sampleFor(i: number): QuestionDraft {
  const sample = SAMPLE_QUESTIONS[i % SAMPLE_QUESTIONS.length]!;
  return { text: sample.text, options: [...sample.options], correctIndex: sample.correctIndex };
}
