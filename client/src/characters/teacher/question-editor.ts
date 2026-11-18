import { config } from '../../config.js';
import { h } from '../../dom/create-element.js';
import { t } from '../../i18n/index.js';
import type { QuestionDraft } from './question-drafts.js';

const OPTION_COUNT = 3;

export interface QuestionEditor {
  element: HTMLElement;
  /** Mostra o rascunho da pergunta número `number`, ou o aviso de seleção se for null. */
  show(number: number, draft: QuestionDraft | null): void;
}

/** Formulário de uma pergunta: texto, 3 alternativas e qual é a certa. Edita o rascunho direto. */
export function createQuestionEditor(onChange: () => void): QuestionEditor {
  let current: QuestionDraft | null = null;

  const placeholder = h('p', { className: 'hint', textContent: t('ui.select_question') });
  const title = h('h3');
  const text = h('textarea', { rows: 2, maxLength: config.questionTextMaxLength });
  const optionInputs: HTMLInputElement[] = [];
  const radios: HTMLInputElement[] = [];

  text.addEventListener('input', () => {
    if (current) current.text = text.value;
    onChange();
  });

  const rows = Array.from({ length: OPTION_COUNT }, (_, i) => {
    const radio = h('input', { type: 'radio', name: 'correct-answer', title: t('ui.correct_answer') });
    const input = h('input', {
      type: 'text',
      maxLength: config.optionMaxLength,
      placeholder: t('ui.option_n', { n: i + 1 }),
    });
    radio.addEventListener('change', () => {
      if (current) current.correctIndex = i as QuestionDraft['correctIndex'];
    });
    input.addEventListener('input', () => {
      if (current) current.options[i] = input.value;
      onChange();
    });
    radios.push(radio);
    optionInputs.push(input);
    return h('div', { className: 'option-row' }, radio, input);
  });

  const form = h('div', { className: 'question-form' }, title, h('label', { textContent: t('ui.question_text') }), text, ...rows);
  form.hidden = true;

  return {
    element: h('div', {}, placeholder, form),
    show(number, draft) {
      current = draft;
      placeholder.hidden = draft !== null;
      form.hidden = draft === null;
      if (!draft) return;
      title.textContent = t('ui.question_label', { n: number });
      text.value = draft.text;
      draft.options.forEach((option, i) => {
        optionInputs[i]!.value = option;
        radios[i]!.checked = i === draft.correctIndex;
      });
    },
  };
}
