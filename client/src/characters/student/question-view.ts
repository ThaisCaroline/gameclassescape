import { h } from '../../dom/create-element.js';
import { secondsLeft } from '../../format-time.js';
import { t } from '../../i18n/index.js';
import type { ActiveQuestion } from './student-store.js';

export interface QuestionView {
  element: HTMLElement;
  update(question: ActiveQuestion | null, now: number): void;
}

/** Pergunta da cadeira de destino: texto, barra de tempo e 3 alternativas lado a lado. */
export function createQuestionView(onAnswer: (questionId: string, optionIndex: number) => void): QuestionView {
  const seconds = h('span', { className: 'answer-seconds' });
  const fill = h('div', { className: 'bar-fill' });
  const text = h('h2', { className: 'question-text' });
  let shownId: string | null = null;
  let answered = false;

  const buttons = [0, 1, 2].map((i) => {
    const button = h('button', { type: 'button', className: 'option' });
    button.addEventListener('click', () => {
      if (answered || shownId === null) return;
      answered = true;
      onAnswer(shownId, i);
    });
    return button;
  });

  const element = h('section', { className: 'question-view' },
    h('div', { className: 'question-head' }, text, seconds),
    h('div', { className: 'bar' }, fill),
    h('div', { className: 'options' }, ...buttons),
  );
  element.hidden = true;

  return {
    element,
    update(question, now) {
      element.hidden = question === null;
      if (!question) {
        shownId = null;
        return;
      }
      if (question.data.id !== shownId) {
        shownId = question.data.id;
        answered = false;
        text.textContent = question.data.text;
        buttons.forEach((button, i) => (button.textContent = question.data.options[i] ?? ''));
      }
      buttons.forEach((button, i) => {
        const removed = question.data.removedOptions.includes(i);
        button.classList.toggle('removed', removed);
        button.disabled = answered || removed;
      });

      const left = Math.max(0, question.expiresAt - now);
      fill.style.width = `${Math.min(100, (left / question.totalMs) * 100)}%`;
      seconds.textContent = t('ui.answer_time', { s: secondsLeft(left) });
    },
  };
}
