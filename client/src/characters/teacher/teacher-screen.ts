import type { RoomPublic } from '@game/shared';
import { config } from '../../config.js';
import { h } from '../../dom/create-element.js';
import { formatClock } from '../../format-time.js';
import { t } from '../../i18n/index.js';
import { catchStudent, getRoom, serverNow, subscribeRoom, turn } from '../../network/index.js';
import { mountTeacherView } from '../../scenes/first-person/teacher-view.js';
import { createBackButton } from '../../screens/back-button.js';
import { createGameFrame } from '../../screens/game-frame.js';
import { createTurnControls } from './turn-controls.js';

/** Tela do professor durante a rodada. Chama `onClosed` se a sala acabar. */
export function showTeacherGame(root: HTMLElement, room: RoomPublic, onClosed: () => void): void {
  const title = h('span', { className: 'hud-code' });
  const clock = h('span', { className: 'hud-clock' });
  const stats = h('p', { className: 'panel-stats' });
  const message = h('p', { className: 'panel-message', role: 'status' });
  const controls = createTurnControls(turn);
  const back = createBackButton();

  const frame = createGameFrame(h('div', { className: 'hud' }, title, clock), 'teacher-game');
  frame.panel.append(controls.element, message, stats, back);
  root.replaceChildren(frame.element);

  const view = mountTeacherView(frame.stage, room.desks, { onStudentClick: catchStudent });

  function updateClock(): void {
    const current = getRoom();
    clock.textContent = current?.round.endsAt ? t('ui.time_left', { time: formatClock(current.round.endsAt - serverNow()) }) : '';
  }

  function update(current: RoomPublic): void {
    const ended = current.round.phase === 'ended';
    const facing = current.round.teacherFacing;
    const total = current.students.length;
    const retained = current.students.filter((s) => s.status === 'playing').length;

    title.textContent = t('ui.room_code_title', { code: current.code });
    stats.textContent = t('ui.teacher_stats', { retained, total, escaped: total - retained, needed: Math.ceil(total / 2) });
    message.textContent = ended
      ? t(current.round.winner === 'teacher' ? 'ui.teacher_won' : 'ui.teacher_lost')
      : t(facing === 'board' ? 'ui.facing_board' : 'ui.teacher_hint_catch');
    controls.update(facing, ended);
    back.hidden = !ended;
    view.render({
      room: current,
      now: serverNow,
      meId: null,
      ghostView: false,
      enabledDesks: new Set(),
      canCatch: facing === 'students' && !ended,
    });
    updateClock();
  }

  // Espaço vira o professor para o outro lado.
  const onKey = (event: KeyboardEvent) => {
    const current = getRoom();
    if (event.code !== 'Space' || !current || current.round.phase !== 'running') return;
    event.preventDefault();
    turn(current.round.teacherFacing === 'students' ? 'board' : 'students');
  };
  document.addEventListener('keydown', onKey);

  update(room);
  const ticker = setInterval(updateClock, config.tickMs);
  const stop = subscribeRoom((state) => {
    if (state !== null) return update(state);
    clearInterval(ticker);
    document.removeEventListener('keydown', onKey);
    stop();
    frame.release();
    view.destroy();
    onClosed();
  });
}
