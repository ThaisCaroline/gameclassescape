import { DIFFICULTIES, type Ack, type Difficulty, type SoloRole } from '@game/shared';
import { config } from '../config.js';
import { h } from '../dom/create-element.js';
import { t, type TextKey } from '../i18n/index.js';
import { createRoom, createSoloRoom, joinRoom } from '../network/index.js';
import type { Role } from '../role.js';

/** Tela inicial: apelido + criar sala (professor), entrar com código (aluno) ou jogar solo contra robôs. */
export function showEnter(root: HTMLElement, onEntered: (role: Role, solo: boolean) => void, notice?: TextKey): void {
  const nickname = h('input', {
    id: 'nickname',
    type: 'text',
    maxLength: config.nicknameMaxLength,
    autocomplete: 'off',
  });
  const code = h('input', {
    id: 'code',
    type: 'text',
    maxLength: config.roomCodeLength,
    autocomplete: 'off',
    autocapitalize: 'characters',
  });
  const difficulty = h('select', { id: 'difficulty' },
    ...DIFFICULTIES.map((level) => h('option', { value: level, textContent: t(`ui.difficulty_${level}`), selected: level === 'medium' })),
  );
  const errorBox = h('p', { className: 'error', role: 'alert' });
  const joinButton = h('button', { type: 'button', className: 'primary', textContent: t('ui.join_room') });
  const createButton = h('button', { type: 'button', textContent: t('ui.create_room') });
  const soloStudent = h('button', { type: 'button', id: 'solo-student', textContent: t('ui.solo_student') });
  const soloTeacher = h('button', { type: 'button', id: 'solo-teacher', textContent: t('ui.solo_teacher') });
  const buttons = [joinButton, createButton, soloStudent, soloTeacher];

  const run = async (role: Role, request: () => Promise<Ack<unknown>>, solo = false) => {
    errorBox.textContent = '';
    if (nickname.value.trim() === '') {
      errorBox.textContent = t('error.invalid_input');
      return;
    }
    buttons.forEach((b) => (b.disabled = true));
    const result = await request();
    if (result.ok) return onEntered(role, solo);
    buttons.forEach((b) => (b.disabled = false));
    errorBox.textContent = t(`error.${result.error}`);
  };

  const playSolo = (role: SoloRole) =>
    run(role, () => createSoloRoom(nickname.value, role, difficulty.value as Difficulty), true);

  joinButton.addEventListener('click', () => run('student', () => joinRoom(code.value, nickname.value)));
  createButton.addEventListener('click', () =>
    run('teacher', () => createRoom(nickname.value, difficulty.value as Difficulty)),
  );
  soloStudent.addEventListener('click', () => playSolo('student'));
  soloTeacher.addEventListener('click', () => playSolo('teacher'));

  root.replaceChildren(
    h('main', { className: 'screen' },
      h('h1', { textContent: t('app.title') }),
      ...(notice ? [h('p', { className: 'notice', textContent: t(notice) })] : []),
      h('label', { htmlFor: 'nickname', textContent: t('ui.nickname') }),
      nickname,
      errorBox,
      h('label', { htmlFor: 'code', textContent: t('ui.room_code') }),
      code,
      joinButton,
      h('h2', { textContent: t('ui.teacher_title') }),
      h('label', { htmlFor: 'difficulty', textContent: t('ui.difficulty') }),
      difficulty,
      h('p', { className: 'hint', textContent: t('ui.difficulty_hint') }),
      createButton,
      h('h2', { textContent: t('ui.solo_title') }),
      h('p', { className: 'hint', textContent: t('ui.solo_hint') }),
      soloStudent,
      soloTeacher,
    ),
  );
}
