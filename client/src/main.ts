// Ponto de entrada do cliente. Só decide qual tela mostrar; sem lógica de jogo aqui.
import './styles.css';
import { registerAudio } from './audio/index.js';
import { showStudentGame } from './characters/student/index.js';
import { showTeacherGame } from './characters/teacher/index.js';
import { registerEffects } from './effects/screen-effects.js';
import { t, type TextKey } from './i18n/index.js';
import { startSolo } from './network/index.js';
import { registerServiceWorker } from './pwa.js';
import type { Role } from './role.js';
import { mountMuteButton, showBriefing, showEnter, showLobby, showSplash } from './screens/index.js';

document.title = t('app.title');
const root = document.getElementById('app');
if (!root) throw new Error('Missing #app');
const app: HTMLElement = root;

registerEffects();
registerAudio();
registerServiceWorker();
mountMuteButton();

function goToEnter(notice?: TextKey): void {
  showEnter(app, (role, solo) => (solo ? goToBriefing(role) : goToLobby(role)), notice);
}

/** Solo: a sala já existe e espera o jogador ler a explicação; ao tocar em "Start" a rodada começa. */
function goToBriefing(role: Role): void {
  showBriefing(app, role, {
    onStart: async () => {
      const result = await startSolo();
      if (result.ok) goToLobby(role); // a rodada já começou: o lobby passa direto para a tela de jogo
      return result;
    },
    onClosed: () => goToEnter('ui.room_closed'),
  });
}

function goToLobby(role: Role): void {
  showLobby(app, role, {
    onClosed: () => goToEnter('ui.room_closed'),
    onRoundStarted: (room) => {
      const show = role === 'teacher' ? showTeacherGame : showStudentGame;
      show(app, room, () => goToEnter('ui.room_closed'));
    },
  });
}

// O som só pode ser liberado depois de um toque, então começamos pela tela "Enter".
showSplash(app, () => goToEnter());
