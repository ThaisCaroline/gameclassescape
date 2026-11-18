import { h } from '../dom/create-element.js';
import { t } from '../i18n/index.js';

const CHEVRON = {
  left: '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M15 4 7 12l8 8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  right: '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="m9 4 8 8-8 8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
} as const;

/** Botão-ícone (seta) na borda da tela para virar a cabeça. */
export function createTurnArrow(side: 'left' | 'right', onTurn: () => void): HTMLButtonElement {
  const button = h('button', {
    type: 'button',
    className: `turn-arrow turn-${side}`,
    title: t(side === 'left' ? 'ui.turn_left' : 'ui.turn_right'),
  });
  button.setAttribute('aria-label', t(side === 'left' ? 'ui.turn_left' : 'ui.turn_right'));
  button.innerHTML = CHEVRON[side]; // SVG fixo do próprio código, sem dado de usuário
  button.addEventListener('click', onTurn);
  return button;
}
