import type { RoomPublic, StudentPublic } from '@game/shared';
import { h } from '../../dom/create-element.js';
import { secondsLeft } from '../../format-time.js';
import { t } from '../../i18n/index.js';

export interface GhostView {
  element: HTMLElement;
  /** `whisperReadyAt` é o fim do cooldown no relógio do servidor (null = livre). */
  update(room: RoomPublic, me: StudentPublic, whisperReadyAt: number | null, now: number): void;
}

/** Painel do fantasma: lista os alunos que estão respondendo agora e deixa sussurrar para eles. */
export function createGhostView(onWhisper: (studentId: string) => void): GhostView {
  const empty = h('p', { className: 'hint', textContent: t('ui.ghost_nobody') });
  const cooldown = h('p', { className: 'hint' });
  const list = h('ul', { className: 'students' });
  const element = h('section', { className: 'ghost-view' }, cooldown, empty, list);
  element.hidden = true;

  let shownKey = '';
  let buttons: HTMLButtonElement[] = [];

  return {
    element,
    update(room, me, whisperReadyAt, now) {
      const targets = room.students.filter((s) => s.id !== me.id && s.status === 'playing' && s.moving);
      const key = targets.map((s) => s.id).join(',');

      if (key !== shownKey) {
        shownKey = key;
        buttons = targets.map((s) => {
          const button = h('button', { type: 'button', textContent: t('ui.ghost_whisper', { name: s.nickname }) });
          button.addEventListener('click', () => onWhisper(s.id));
          return button;
        });
        list.replaceChildren(...buttons.map((b) => h('li', {}, b)));
      }

      const left = whisperReadyAt === null ? 0 : whisperReadyAt - now;
      buttons.forEach((b) => (b.disabled = left > 0));
      empty.hidden = targets.length > 0;
      cooldown.textContent = left > 0 ? t('ui.ghost_cooldown', { s: secondsLeft(left) }) : '';
    },
  };
}
