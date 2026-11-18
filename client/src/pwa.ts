/** Registra o service worker (app instalável + casca offline). Só em produção: em desenvolvimento atrapalharia o recarregamento. */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined); // sem SW o jogo funciona igual
  });
}
