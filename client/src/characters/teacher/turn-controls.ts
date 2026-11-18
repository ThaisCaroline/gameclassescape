import type { TeacherFacing } from '@game/shared';
import { h } from '../../dom/create-element.js';
import { t } from '../../i18n/index.js';

export interface TurnControls {
  element: HTMLElement;
  update(facing: TeacherFacing, disabled: boolean): void;
}

/** Dois botões: olhar para os alunos ou virar para o quadro. */
export function createTurnControls(onTurn: (facing: TeacherFacing) => void): TurnControls {
  const students = h('button', { type: 'button', textContent: t('ui.look_students') });
  const board = h('button', { type: 'button', textContent: t('ui.look_board') });
  students.addEventListener('click', () => onTurn('students'));
  board.addEventListener('click', () => onTurn('board'));

  return {
    element: h('div', { className: 'turn-controls' }, students, board),
    update(facing, disabled) {
      students.classList.toggle('active', facing === 'students');
      board.classList.toggle('active', facing === 'board');
      students.disabled = disabled;
      board.disabled = disabled;
    },
  };
}
