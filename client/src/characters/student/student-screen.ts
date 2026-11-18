import type { RoomPublic, StudentPublic } from '@game/shared';
import { config } from '../../config.js';
import { keepScreenOn, releaseScreen } from '../../device/wake-lock.js';
import { h } from '../../dom/create-element.js';
import { formatClock, secondsLeft } from '../../format-time.js';
import { t, type TextKey } from '../../i18n/index.js';
import { answer, getRoom, requestJump, serverNow, socket, subscribeRoom, whisper } from '../../network/index.js';
import { mountFirstPersonView } from '../../scenes/first-person/first-person-view.js';
import { createBackButton } from '../../screens/back-button.js';
import { createGameFrame } from '../../screens/game-frame.js';
import { createTurnArrow } from '../../screens/turn-arrow.js';
import { createGhostView } from '../ghost/index.js';
import { createQuestionView } from './question-view.js';
import { reachableDesks } from './reachable-desks.js';
import { studentState, subscribeStudent } from './student-store.js';

const FEEDBACK_TEXT = {
  correct: 'ui.feedback_correct',
  wrong: 'ui.feedback_wrong',
  timeout: 'ui.feedback_timeout',
  caught: 'ui.feedback_caught',
} as const satisfies Record<string, TextKey>;

/** Tela do aluno durante a rodada (e do fantasma, depois que escapa). Chama `onClosed` se a sala acabar. */
export function showStudentGame(root: HTMLElement, room: RoomPublic, onClosed: () => void): void {
  let notice: { text: string; until: number } | null = null;

  const title = h('span', { className: 'hud-code' });
  const clock = h('span', { className: 'hud-clock' });
  const cue = h('p', { className: 'cue', role: 'status' });
  const message = h('p', { className: 'panel-message', role: 'status' });
  const legendNear = h('p', { className: 'legend legend-near' });
  const legendFar = h('p', { className: 'legend legend-far' });
  const legend = h('div', { className: 'legend-box' }, legendNear, legendFar);
  const question = createQuestionView(answer);
  const ghost = createGhostView(whisper);
  const back = createBackButton();

  const compass = h('p', { className: 'compass' });
  // A pergunta fica no CENTRO da tela, cobrindo a visão: enquanto responde, o jogador não vê o professor nem vira a cabeça.
  const cover = h('div', { className: 'question-cover' }, question.element);
  cover.hidden = true;

  const frame = createGameFrame(h('div', { className: 'hud' }, title, clock));
  frame.panel.append(cue, message, legend, ghost.element, back);
  root.replaceChildren(frame.element);

  const view = mountFirstPersonView(frame.stage, room.desks, {
    onDeskClick: (deskId) => {
      void requestJump(deskId).then((result) => {
        if (result.ok) return;
        notice = { text: t(`error.${result.error}`), until: Date.now() + config.feedbackMs };
        update();
      });
    },
  });

  // Virar a cabeça: setas nas bordas (ícones na tela) e as setas do teclado.
  const arrowLeft = createTurnArrow('left', () => view.turn(-1));
  const arrowRight = createTurnArrow('right', () => view.turn(1));
  frame.overlays.append(arrowLeft, arrowRight, compass, cover);
  const onKey = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    if (event.code === 'ArrowLeft') view.turn(-1);
    if (event.code === 'ArrowRight') view.turn(1);
  };
  document.addEventListener('keydown', onKey);

  function messageFor(room: RoomPublic, me: StudentPublic, now: number): string {
    if (room.round.phase === 'ended') {
      if (me.status === 'ghost') return t('ui.ended_escaped');
      return t(room.round.winner === 'teacher' ? 'ui.ended_teacher_won' : 'ui.ended_students_won');
    }
    if (me.status === 'ghost') return t('ui.ghost_hint');
    if (notice && notice.until > Date.now()) return notice.text;
    if (studentState.feedback) return t(FEEDBACK_TEXT[studentState.feedback]);
    if (me.lockedUntil !== null && me.lockedUntil > now) return t('ui.frozen', { s: secondsLeft(me.lockedUntil - now) });
    if (studentState.question) return '';
    // Todos largam em cadeiras seguidas e uma cadeira ocupada não pode ser alvo: quem está no meio da fila espera.
    return reachableDesks(room, me, now).size === 0 ? t('ui.no_free_chair') : t('ui.pick_desk');
  }

  function update(): void {
    const current = getRoom();
    const me = current?.students.find((s) => s.id === socket.id);
    if (!current || !me) return;

    const now = serverNow();
    const ended = current.round.phase === 'ended';
    const playing = me.status === 'playing' && !ended;

    title.textContent = t('ui.room_code_title', { code: current.code });
    clock.textContent = current.round.endsAt ? t('ui.time_left', { time: formatClock(current.round.endsAt - now) }) : '';
    frame.stage.classList.toggle('ghost-mode', me.status === 'ghost');
    back.hidden = !ended;

    // Aviso grande de para onde o professor olha: é a informação mais importante do jogo.
    const looking = current.round.teacherFacing === 'students';
    const policy = config.cueByDifficulty[current.difficulty];
    const teacherInView = view.facingName() === 'front'; // o professor fica na frente da sala
    cue.hidden = ended || policy === 'never' || (policy === 'when_teacher_in_view' && !teacherInView);
    cue.textContent = t(looking ? 'ui.cue_looking' : 'ui.cue_back');
    cue.classList.toggle('looking', looking);

    const text = messageFor(current, me, now);
    message.textContent = text;
    message.hidden = text === '';
    message.classList.toggle('bad', studentState.feedback === 'caught' || studentState.feedback === 'timeout');

    legend.hidden = !playing || studentState.question !== null;
    legendNear.textContent = t('ui.legend_near', { s: Math.round(current.jumpTimes.near / 1000) });
    legendFar.textContent = t('ui.legend_far', { s: Math.round(current.jumpTimes.far / 1000) });

    const answering = playing && studentState.question !== null;
    question.update(answering ? studentState.question : null, now);
    cover.hidden = !answering;
    view.setTurnEnabled(!answering);
    arrowLeft.disabled = answering;
    arrowRight.disabled = answering;
    compass.textContent = t(`ui.facing_${view.facingName()}` as TextKey);
    ghost.element.hidden = ended || me.status !== 'ghost';
    if (!ghost.element.hidden) ghost.update(current, me, studentState.whisperReadyAt, now);

    view.render({
      room: current,
      now: serverNow,
      meId: me.id,
      ghostView: me.status === 'ghost',
      enabledDesks: playing && studentState.question === null ? reachableDesks(current, me, now) : new Set(),
      canCatch: false,
    });
  }

  keepScreenOn();
  update();
  const ticker = setInterval(update, config.tickMs);
  const stopStudent = subscribeStudent(update);
  const stopRoom = subscribeRoom((state) => {
    if (state === null) {
      clearInterval(ticker);
      stopStudent();
      stopRoom();
      document.removeEventListener('keydown', onKey);
      releaseScreen();
      frame.release();
      view.destroy();
      onClosed();
      return;
    }
    update();
  });
}
