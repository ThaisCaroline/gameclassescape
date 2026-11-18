import { getAudio } from './audio-context.js';
import { SOUND_KEYS, soundAvailabilityKey, soundFile, type SoundKey } from './manifest.js';
import { synthesize } from './synth.js';

const buffers = new Map<SoundKey, AudioBuffer>();
/** De onde veio cada som (útil para conferir se o arquivo real foi carregado). */
export const soundSources = new Map<SoundKey, 'file' | 'synth'>();
let loading: Promise<void> | null = null;

export function getBuffer(key: SoundKey): AudioBuffer | undefined {
  return buffers.get(key);
}

async function availableKeys(): Promise<string[]> {
  try {
    const response = await fetch('assets/available.json');
    return response.ok ? ((await response.json()) as string[]) : [];
  } catch {
    return [];
  }
}

async function fromFile(ctx: BaseAudioContext, key: SoundKey): Promise<AudioBuffer | null> {
  try {
    const response = await fetch(`assets/audio/${soundFile(key)}`);
    return response.ok ? await ctx.decodeAudioData(await response.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

/** Prepara todos os sons: arquivo real se estiver listado e carregar, senão o provisório. Roda uma vez. */
export function loadSounds(): Promise<void> {
  loading ??= (async () => {
    const audio = getAudio();
    if (!audio) return;
    const available = await availableKeys();

    for (const key of SOUND_KEYS) {
      const real = available.includes(soundAvailabilityKey(key)) ? await fromFile(audio.ctx, key) : null;
      if (real) {
        buffers.set(key, real);
        soundSources.set(key, 'file');
        continue;
      }
      const samples = synthesize(key, audio.ctx.sampleRate);
      const buffer = audio.ctx.createBuffer(1, samples.length, audio.ctx.sampleRate);
      buffer.copyToChannel(samples as Float32Array<ArrayBuffer>, 0);
      buffers.set(key, buffer);
      soundSources.set(key, 'synth');
    }
  })();
  return loading;
}
