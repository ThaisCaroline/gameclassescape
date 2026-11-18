import type { QuestionPublic } from '@game/shared';
import type { Question } from './question.js';

/** Versão que vai ao cliente: sem resposta certa. As alternativas removidas são por aluno (sussurro). */
export function toQuestionPublic(question: Question, removedOptions: number[]): QuestionPublic {
  return {
    id: question.id,
    text: question.text,
    options: question.options,
    removedOptions,
  };
}
