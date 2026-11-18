import { config } from '../config.js';
import { socket } from '../network/index.js';
import { h } from '../dom/create-element.js';
import { preloadTeacherFace, teacherFaceSource } from './teacher-face.js';

const vibrate = (pattern: number | number[]) => navigator.vibrate?.(pattern);

/**
 * Susto: a cara do professor "pula" na tela de quem foi atingido (cresce de repente até encher a tela), com um
 * único clarão vermelho e vibração (Android). Sem luz piscando em sequência. O som vem do módulo de áudio.
 */
function jumpscare(): void {
  const face = h('img', { className: 'jumpscare-face', src: teacherFaceSource(), alt: '' });
  const overlay = h('div', { className: 'jumpscare' }, face);
  document.body.append(overlay);
  vibrate([200, 80, 300]);
  setTimeout(() => overlay.remove(), config.jumpscareMs);
}

/**
 * Batida de régua: a tela de todos treme. O tremor vai no próprio elemento da tela de jogo, não no body:
 * um `transform` no body faria os elementos de posição fixa (a tela cheia) sumirem durante o tremor.
 */
function shakeScreen(): void {
  const target = document.querySelector<HTMLElement>('.game-screen') ?? document.body;
  target.classList.add('shake');
  vibrate(120);
  setTimeout(() => target.classList.remove('shake'), config.shakeMs);
}

/**
 * Liga os efeitos às mensagens do servidor. Chamar uma vez na inicialização.
 * O susto vem em dois casos (combinado com o usuário): o tempo de resposta estourou (`fx:jumpscare`, só para
 * quem estourou) e o professor te pegou (`answer:result` com `caught`, que só o aluno pego recebe).
 * Errar a resposta NÃO dá susto.
 */
export function registerEffects(): void {
  void preloadTeacherFace();
  socket.on('fx:jumpscare', jumpscare);
  socket.on('fx:ruler', shakeScreen);
  socket.on('answer:result', ({ outcome }) => {
    if (outcome === 'caught') jumpscare();
  });
}
