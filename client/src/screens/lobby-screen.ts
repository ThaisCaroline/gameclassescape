import type { RoomPublic } from '@game/shared';
import { mountTeacherSetup } from '../characters/teacher/index.js';
import { h } from '../dom/create-element.js';
import { createHowToPlay } from './how-to-play.js';
import { createSeatMap } from './seat-map.js';
import { t } from '../i18n/index.js';
import { getRoom, pickSeat, socket, subscribeRoom } from '../network/index.js';
import type { Role } from '../role.js';

export interface LobbyHandlers {
  /** A sala acabou (professor saiu ou conexão caiu). */
  onClosed: () => void;
  /** A rodada começou. */
  onRoundStarted: (room: RoomPublic) => void;
}

/** Lobby: código, lista de alunos ao vivo e (professor) o painel de perguntas. */
export function showLobby(root: HTMLElement, role: Role, { onClosed, onRoundStarted }: LobbyHandlers): void {
  const title = h('h1', { className: 'room-code' });
  const heading = h('h2');
  const list = h('ul', { className: 'students' });
  const setupSlot = h('div');
  const howToSlot = h('div', { className: 'lobby-howto briefing-columns' });
  const difficultyLine = h('p', { className: 'hint' });
  const seatMap = createSeatMap(pickSeat);
  let setupMounted = false;
  let unsubscribe: () => void = () => {};

  const render = (room: RoomPublic) => {
    if (room.round.phase !== 'lobby') {
      unsubscribe();
      onRoundStarted(room);
      return;
    }

    title.textContent = t('ui.room_code_title', { code: room.code });
    heading.textContent = t('ui.students_count', { count: room.students.length });
    list.replaceChildren(
      ...(room.students.length === 0
        ? [h('li', { className: 'empty', textContent: t('ui.no_students') })]
        : room.students.map((s) =>
            h('li', { textContent: s.id === socket.id ? `${s.nickname} (${t('ui.you')})` : s.nickname }),
          )),
    );

    if (role === 'teacher' && !setupMounted) {
      setupSlot.replaceChildren(mountTeacherSetup());
      setupMounted = true;
    }
    difficultyLine.textContent = t('ui.lobby_difficulty', { level: t(`ui.difficulty_${room.difficulty}`) });

    // Enquanto espera o professor começar, o aluno lê como se joga e escolhe a carteira (quem chega primeiro escolhe primeiro).
    if (role === 'student') {
      if (howToSlot.childElementCount === 0) {
        // O mapa vem primeiro: quem chega primeiro escolhe primeiro.
        howToSlot.replaceChildren(seatMap.element, createHowToPlay('student', room.jumpTimes));
      }
      seatMap.update(room, socket.id);
    }
  };

  const hint = t(role === 'teacher' ? 'ui.lobby_hint_teacher' : 'ui.lobby_hint_student');
  root.replaceChildren(
    h('main', { className: role === 'teacher' ? 'screen wide' : 'screen' },
      title,
      h('p', { className: 'hint', textContent: hint }),
      difficultyLine,
      howToSlot,
      h('div', { className: 'columns' }, h('div', {}, heading, list), setupSlot),
    ),
  );

  const current = getRoom();
  if (current) render(current);

  unsubscribe = subscribeRoom((room) => {
    if (room === null) {
      unsubscribe();
      onClosed();
      return;
    }
    render(room);
  });
}
