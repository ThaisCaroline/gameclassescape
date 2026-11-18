import { config } from '../../config.js';
import { h } from '../../dom/create-element.js';
import { t } from '../../i18n/index.js';
import { setQuestions, startRound } from '../../network/index.js';
import { countComplete, emptyDraft, toInputs, type QuestionDraft } from './question-drafts.js';
import { createQuestionEditor } from './question-editor.js';
import { createQuestionPicker } from './question-picker.js';
import { sampleFor } from './sample-questions.js';

/** Painel do professor no lobby: escrever as perguntas (até 10) e iniciar a rodada. */
export function mountTeacherSetup(): HTMLElement {
  const total = config.maxQuestions;
  const drafts: QuestionDraft[] = Array.from({ length: total }, emptyDraft);
  let selected: number | null = null;

  const picker = createQuestionPicker(total, (index) => select(index));
  const editor = createQuestionEditor(() => refresh());
  const status = h('p', { className: 'hint' });
  const errorBox = h('p', { className: 'error', role: 'alert' });
  const fillButton = h('button', { type: 'button', textContent: t('ui.fill_samples') });
  const startButton = h('button', { type: 'button', className: 'primary', textContent: t('ui.start_round') });

  function refresh(): void {
    errorBox.textContent = ''; // o aviso antigo não vale mais depois de qualquer edição
    picker.refresh(drafts, selected);
    status.textContent = t('ui.questions_ready', { ready: countComplete(drafts), total });
  }

  function select(index: number): void {
    selected = index;
    editor.show(index + 1, drafts[index] ?? null);
    refresh();
  }

  fillButton.addEventListener('click', () => {
    drafts.forEach((_, i) => (drafts[i] = sampleFor(i)));
    if (selected !== null) select(selected);
    refresh();
  });

  startButton.addEventListener('click', async () => {
    errorBox.textContent = '';
    const inputs = toInputs(drafts);
    if (inputs.length === 0) {
      errorBox.textContent = t('error.questions_incomplete');
      return;
    }
    startButton.disabled = true;
    const saved = await setQuestions(inputs);
    const result = saved.ok ? await startRound() : saved;
    if (!result.ok) {
      errorBox.textContent = t(`error.${result.error}`);
      startButton.disabled = false;
    }
  });

  refresh();
  return h('section', { className: 'teacher-setup' },
    h('h2', { textContent: t('ui.setup_title') }),
    h('p', { className: 'hint', textContent: t('ui.setup_hint', { max: total }) }),
    picker.element,
    editor.element,
    status,
    errorBox,
    fillButton,
    startButton,
  );
}
