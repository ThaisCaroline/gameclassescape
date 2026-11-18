import { enableAudio } from '../audio/index.js';
import { enterFullscreen } from '../device/fullscreen.js';
import { h } from '../dom/create-element.js';
import { t } from '../i18n/index.js';

/** Primeira tela: o toque em "Enter" é o gesto que os navegadores exigem para liberar o som e a tela cheia. */
export function showSplash(root: HTMLElement, onEnter: () => void): void {
  const button = h('button', { type: 'button', className: 'primary', textContent: t('ui.enter') });
  button.addEventListener('click', async () => {
    button.disabled = true;
    void enterFullscreen(); // sem await: precisa sair dentro do toque
    await enableAudio();
    onEnter();
  });

  root.replaceChildren(
    h('main', { className: 'screen splash' },
      h('h1', { textContent: t('app.title') }),
      h('p', { className: 'hint', textContent: t('ui.splash_hint') }),
      button,
    ),
  );
}
