type LockableOrientation = ScreenOrientation & {
  lock?: (orientation: string) => Promise<void>;
  unlock?: () => void;
};

/** Só em aparelhos de toque (celular/tablet). No notebook o jogador usa F11 se quiser; forçar seria invasivo. */
const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches;

/** Pede tela cheia. Precisa ser chamado dentro de um toque do jogador. Falhar é normal (ex.: iPhone) e não atrapalha. */
export async function enterFullscreen(): Promise<void> {
  if (!isTouchDevice() || document.fullscreenElement) return;
  try {
    await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
  } catch {
    // sem suporte ou negado: o jogo segue, só sem tela cheia
  }
}

/** Trava a tela em paisagem durante a rodada (só funciona em tela cheia no Android; senão o aviso de girar cobre). */
export async function lockLandscape(): Promise<void> {
  try {
    await (screen.orientation as LockableOrientation).lock?.('landscape');
  } catch {
    // sem suporte: vale o aviso "gire o celular"
  }
}

export function unlockOrientation(): void {
  try {
    (screen.orientation as LockableOrientation).unlock?.();
  } catch {
    // nada a fazer
  }
}
