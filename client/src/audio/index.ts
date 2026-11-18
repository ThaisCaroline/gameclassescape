import { unlockAudio } from './audio-context.js';
import { loadSounds } from './sound-bank.js';

export { registerAudio } from './audio-events.js';
export { isMuted, setMuted } from './audio-context.js';

/** Libera e prepara o som. Chamar dentro do clique em "Enter". */
export async function enableAudio(): Promise<void> {
  await unlockAudio();
  await loadSounds();
}
