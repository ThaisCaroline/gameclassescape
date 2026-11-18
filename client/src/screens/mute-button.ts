import { isMuted, setMuted } from '../audio/index.js';
import { h } from '../dom/create-element.js';
import { t } from '../i18n/index.js';

/** Botão fixo no canto para ligar/desligar o som (útil em sala de aula). */
export function mountMuteButton(): void {
  const button = h('button', { type: 'button', className: 'mute-button' });
  const render = () => {
    button.textContent = t(isMuted() ? 'ui.sound_off' : 'ui.sound_on');
    button.setAttribute('aria-pressed', String(isMuted()));
  };
  button.addEventListener('click', () => {
    setMuted(!isMuted());
    render();
  });
  render();
  document.body.append(button);
}
