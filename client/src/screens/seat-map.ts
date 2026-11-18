import { forbiddenSeatIds, type Ack, type RoomPublic } from '@game/shared';
import { h } from '../dom/create-element.js';
import { t } from '../i18n/index.js';

export interface SeatMap {
  element: HTMLElement;
  /** Atualiza o mapa com o estado da sala (quem escolheu qual carteira). */
  update(room: RoomPublic, myId: string | undefined): void;
}

/**
 * Mapa da sala para escolher a carteira antes de começar. Quem chega primeiro escolhe primeiro; escolheu, ficou.
 * A frente da sala (quadro e porta) fica em cima. As carteiras com cadeado, perto da porta, não podem ser escolhidas.
 */
export function createSeatMap(onPick: (deskId: string) => Promise<Ack>): SeatMap {
  const grid = h('div', { className: 'seat-grid' });
  const errorBox = h('p', { className: 'error', role: 'alert' });
  const element = h('section', { className: 'seat-map' },
    h('h2', { textContent: t('ui.seat_title') }),
    h('p', { className: 'hint', textContent: t('ui.seat_hint') }),
    h('p', { className: 'seat-front', textContent: t('ui.seat_front') }),
    grid,
    errorBox,
  );

  let built = false;
  const buttons = new Map<string, HTMLButtonElement>();

  function build(room: RoomPublic): void {
    built = true;
    const cols = Math.max(...room.desks.map((d) => d.col)) + 1;
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    for (const desk of room.desks) {
      const button = h('button', { type: 'button', className: 'seat' });
      button.dataset['desk'] = desk.id;
      button.addEventListener('click', async () => {
        errorBox.textContent = '';
        const result = await onPick(desk.id);
        if (!result.ok) errorBox.textContent = t(`error.${result.error}`);
      });
      buttons.set(desk.id, button);
      grid.append(button);
    }
  }

  return {
    element,
    update(room, myId) {
      if (!built) build(room);
      const forbidden = forbiddenSeatIds(room.desks);
      const mine = room.students.find((s) => s.id === myId);
      const owner = new Map(room.students.filter((s) => s.deskId !== '').map((s) => [s.deskId, s]));

      for (const desk of room.desks) {
        const button = buttons.get(desk.id);
        if (!button) continue;
        const sitting = owner.get(desk.id);
        const isMine = sitting !== undefined && sitting.id === myId;

        button.classList.toggle('mine', isMine);
        button.classList.toggle('taken', sitting !== undefined && !isMine);
        button.classList.toggle('forbidden', forbidden.has(desk.id));
        button.classList.toggle('door', desk.kind === 'door');
        button.textContent = sitting ? sitting.nickname : desk.kind === 'door' ? t('ui.seat_door') : '';
        // Só dá para escolher uma livre e permitida, e só uma vez.
        const alreadyChose = mine !== undefined && mine.deskId !== '';
        button.disabled = sitting !== undefined || forbidden.has(desk.id) || alreadyChose;
      }
    },
  };
}
