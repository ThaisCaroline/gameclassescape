const VOLUME = 0.8;
const MUTE_STORAGE_KEY = 'muted';

interface AudioGraph {
  ctx: AudioContext;
  master: GainNode;
}

let graph: AudioGraph | null = null;
let muted = readMuted();

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_STORAGE_KEY) === '1';
  } catch {
    return false; // armazenamento bloqueado: segue sem lembrar a escolha
  }
}

/** O contexto de áudio (criado na primeira vez). null se o navegador não suporta. */
export function getAudio(): AudioGraph | null {
  if (graph) return graph;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;

  const ctx = new Ctor();
  const master = ctx.createGain();
  master.gain.value = muted ? 0 : VOLUME;
  master.connect(ctx.destination);
  graph = { ctx, master };
  return graph;
}

/** Libera o som. Precisa ser chamado dentro de um toque/clique do jogador (regra dos navegadores). */
export async function unlockAudio(): Promise<void> {
  const audio = getAudio();
  if (audio && audio.ctx.state !== 'running') await audio.ctx.resume().catch(() => undefined);
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
  if (graph) graph.master.gain.value = value ? 0 : VOLUME;
  try {
    localStorage.setItem(MUTE_STORAGE_KEY, value ? '1' : '0');
  } catch {
    // sem armazenamento: vale só nesta sessão
  }
}
