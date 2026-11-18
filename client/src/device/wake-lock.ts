let sentinel: WakeLockSentinel | null = null;
let wanted = false;

async function acquire(): Promise<void> {
  try {
    sentinel = (await navigator.wakeLock?.request('screen')) ?? null;
  } catch {
    sentinel = null; // sem suporte ou negado: o jogo funciona igual, só a tela pode apagar
  }
}

// O navegador solta o bloqueio ao esconder a aba; pede de novo ao voltar.
document.addEventListener('visibilitychange', () => {
  if (wanted && document.visibilityState === 'visible') void acquire();
});

/** Mantém a tela do celular acesa. */
export function keepScreenOn(): void {
  wanted = true;
  void acquire();
}

export function releaseScreen(): void {
  wanted = false;
  void sentinel?.release();
  sentinel = null;
}
