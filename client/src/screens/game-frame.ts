import { lockLandscape, unlockOrientation } from '../device/fullscreen.js';
import { h } from '../dom/create-element.js';
import { t } from '../i18n/index.js';

export interface GameFrame {
  /** A tela inteira da rodada: barra de informações em cima, a cena à esquerda e um painel lateral à direita. */
  element: HTMLElement;
  /** Container do canvas Phaser. */
  stage: HTMLElement;
  /** Camada por cima da cena (setas de giro, pergunta no centro): ocupa a área da cena inteira. */
  overlays: HTMLElement;
  /** Painel lateral: avisos, explicações e botões ficam aqui, fora da cena. */
  panel: HTMLElement;
  /** Libera a trava de orientação ao sair da tela. */
  release(): void;
}

/**
 * Moldura em tela cheia e paisagem das telas de jogo: `hud` no topo, a cena e o painel lateral lado a lado,
 * e um aviso para girar o aparelho se estiver em retrato.
 */
export function createGameFrame(hud: HTMLElement, extraClass = ''): GameFrame {
  const stage = h('div', { className: 'stage' });
  const overlays = h('div', { className: 'overlays' });
  const panel = h('aside', { className: 'side-panel' });
  const body = h('div', { className: 'game-body' }, h('div', { className: 'stage-wrap' }, stage, overlays), panel);
  const rotate = h('div', { className: 'rotate-hint', textContent: t('ui.rotate_phone') });
  const element = h('main', { className: `game-screen ${extraClass}`.trim() }, hud, body, rotate);

  void lockLandscape();
  return { element, stage, overlays, panel, release: unlockOrientation };
}
