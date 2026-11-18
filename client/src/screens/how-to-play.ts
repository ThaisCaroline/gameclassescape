import { h } from '../dom/create-element.js';
import { t, type TextKey } from '../i18n/index.js';
import type { Role } from '../role.js';

const STUDENT_STEPS: TextKey[] = [
  'ui.howto_student_1',
  'ui.howto_student_2',
  'ui.howto_student_3',
  'ui.howto_student_4',
  'ui.howto_student_5',
];
const TEACHER_STEPS: TextKey[] = ['ui.howto_teacher_1', 'ui.howto_teacher_2', 'ui.howto_teacher_3'];

/** Explicação curta do papel (aluno ou professor), para quem está para começar. Os tempos vêm do servidor. */
export function createHowToPlay(role: Role, jumpTimes: { near: number; far: number }): HTMLElement {
  const params = { near: Math.round(jumpTimes.near / 1000), far: Math.round(jumpTimes.far / 1000) };
  const steps = role === 'student' ? STUDENT_STEPS : TEACHER_STEPS;

  return h('section', { className: 'how-to' },
    h('h2', { textContent: t(role === 'student' ? 'ui.howto_student_title' : 'ui.howto_teacher_title') }),
    h('ol', {}, ...steps.map((key) => h('li', { textContent: t(key, params) }))),
  );
}
