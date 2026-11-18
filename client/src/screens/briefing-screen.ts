import type { Ack } from '@game/shared';
import { h } from '../dom/create-element.js';
import { t } from '../i18n/index.js';
import { getRoom, pickSeat, socket, subscribeRoom } from '../network/index.js';
import type { Role } from '../role.js';
import { createHowToPlay } from './how-to-play.js';
import { createSeatMap } from './seat-map.js';

export interface BriefingHandlers {
  /** Toque em "Start": pede ao servidor para começar a rodada. */
  onStart: () => Promise<Ack>;
  /** A sala acabou antes de começar (conexão caiu). */
  onClosed: () => void;
}

const DEFAULT_TIMES = { near: 30_000, far: 20_000 };

/**
 * Explicação antes de começar o solo: o jogador lê o papel dele, (se for aluno) escolhe a carteira no mapa
 * e só então toca em "Start".
 */
export function showBriefing(root: HTMLElement, role: Role, { onStart, onClosed }: BriefingHandlers): void {
  const errorBox = h('p', { className: 'error', role: 'alert' });
  const start = h('button', { type: 'button', id: 'briefing-start', className: 'primary', textContent: t('ui.start') });
  const seatMap = role === 'student' ? createSeatMap(pickSeat) : null;

  start.addEventListener('click', async () => {
    errorBox.textContent = '';
    start.disabled = true;
    const result = await onStart();
    if (!result.ok) {
      start.disabled = false;
      errorBox.textContent = t(`error.${result.error}`);
    }
  });

  root.replaceChildren(
    h('main', { className: 'screen briefing' },
      h('h1', { textContent: t('app.title') }),
      h('div', { className: 'briefing-columns' },
        createHowToPlay(role, getRoom()?.jumpTimes ?? DEFAULT_TIMES),
        ...(seatMap ? [seatMap.element] : []),
      ),
      errorBox,
      start,
    ),
  );

  const current = getRoom();
  if (current && seatMap) seatMap.update(current, socket.id);

  const stop = subscribeRoom((room) => {
    if (room === null) {
      stop();
      onClosed();
      return;
    }
    seatMap?.update(room, socket.id);
  });
}
