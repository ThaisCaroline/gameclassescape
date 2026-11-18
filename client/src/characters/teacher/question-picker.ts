import { h } from '../../dom/create-element.js';
import { isComplete, type QuestionDraft } from './question-drafts.js';

export interface QuestionPicker {
  element: HTMLElement;
  /** Atualiza as marcas (preenchida / selecionada) sem recriar os botões. */
  refresh(drafts: QuestionDraft[], selected: number | null): void;
}

/** Linha de botões numerados, um por pergunta (1 a `count`). */
export function createQuestionPicker(count: number, onSelect: (index: number) => void): QuestionPicker {
  const buttons = Array.from({ length: count }, (_, index) => {
    const button = h('button', { type: 'button', className: 'q-button', textContent: String(index + 1) });
    button.addEventListener('click', () => onSelect(index));
    return button;
  });

  return {
    element: h('div', { className: 'q-list' }, ...buttons),
    refresh(drafts, selected) {
      buttons.forEach((button, index) => {
        const draft = drafts[index];
        button.classList.toggle('done', draft !== undefined && isComplete(draft));
        button.classList.toggle('selected', index === selected);
      });
    },
  };
}
