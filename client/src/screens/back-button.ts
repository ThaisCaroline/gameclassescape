import { h } from '../dom/create-element.js';
import { t } from '../i18n/index.js';

/**
 * Botão "Back to menu" do fim da rodada. Recarrega a página: a conexão antiga cai e o servidor limpa a
 * sala (ou tira o aluno dela) sozinho, então não há estado antigo para limpar.
 */
export function createBackButton(): HTMLButtonElement {
  const button = h('button', { type: 'button', className: 'primary back-button', textContent: t('ui.back_to_menu') });
  button.hidden = true;
  button.addEventListener('click', () => location.reload());
  return button;
}
