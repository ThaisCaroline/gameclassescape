import type { QuestionInput } from '@game/shared';

/** Pergunta em edição pelo professor (ainda não enviada ao servidor). */
export interface QuestionDraft {
  text: string;
  options: [string, string, string];
  correctIndex: 0 | 1 | 2;
}

export function emptyDraft(): QuestionDraft {
  return { text: '', options: ['', '', ''], correctIndex: 0 };
}

/** Completa = texto e 3 alternativas preenchidas e diferentes entre si (mesma regra do servidor). */
export function isComplete(draft: QuestionDraft): boolean {
  const options = draft.options.map((o) => o.trim().toLowerCase());
  return (
    draft.text.trim() !== '' && options.every((o) => o !== '') && new Set(options).size === options.length
  );
}

export function countComplete(drafts: QuestionDraft[]): number {
  return drafts.filter(isComplete).length;
}

/** As perguntas completas, no formato de envio. As incompletas ficam de fora. */
export function toInputs(drafts: QuestionDraft[]): QuestionInput[] {
  return drafts.filter(isComplete).map(({ text, options, correctIndex }) => ({ text, options, correctIndex }));
}
