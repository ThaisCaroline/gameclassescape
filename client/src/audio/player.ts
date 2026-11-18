import { getAudio, isMuted } from './audio-context.js';
import type { SoundKey } from './manifest.js';
import { getBuffer, soundSources } from './sound-bank.js';

const AMBIENCE_VOLUME = 0.5;
const FADE_IN_S = 2;
const FADE_OUT_S = 1;
/** Som "abafado" (como ouvido de costas, sem ver): corta os agudos e baixa o volume. */
const MUFFLED_CUTOFF_HZ = 450;
const MUFFLED_VOLUME = 0.6;

let ambience: { source: AudioBufferSourceNode; gain: GainNode } | null = null;

// Só em DEV: registro do que tocou, para testes automáticos.
const played: string[] = [];
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>)['__audio'] = {
    played,
    state: () => getAudio()?.ctx.state ?? 'unsupported',
    muted: () => isMuted(),
    gain: () => getAudio()?.master.gain.value ?? null,
    sources: () => Object.fromEntries(soundSources),
  };
}

/** Toca um som uma vez (`muffled`: abafado). Não faz nada se o áudio ainda não foi liberado. */
export function play(key: SoundKey, volume = 1, muffled = false): void {
  const audio = getAudio();
  const buffer = getBuffer(key);
  if (!audio || !buffer || audio.ctx.state !== 'running') return;

  const source = audio.ctx.createBufferSource();
  const gain = audio.ctx.createGain();
  source.buffer = buffer;
  gain.gain.value = muffled ? volume * MUFFLED_VOLUME : volume;
  if (muffled) {
    const filter = audio.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = MUFFLED_CUTOFF_HZ;
    source.connect(filter).connect(gain).connect(audio.master);
  } else {
    source.connect(gain).connect(audio.master);
  }
  source.start();
  played.push(muffled ? `${key}:muffled` : key);
}

/** Som de fundo em loop, com entrada suave. */
export function startAmbience(): void {
  const audio = getAudio();
  const buffer = getBuffer('ambience');
  if (ambience || !audio || !buffer || audio.ctx.state !== 'running') return;

  const source = audio.ctx.createBufferSource();
  const gain = audio.ctx.createGain();
  source.buffer = buffer;
  source.loop = true;
  gain.gain.setValueAtTime(0, audio.ctx.currentTime);
  gain.gain.linearRampToValueAtTime(AMBIENCE_VOLUME, audio.ctx.currentTime + FADE_IN_S);
  source.connect(gain).connect(audio.master);
  source.start();
  ambience = { source, gain };
  played.push('ambience');
}

export function stopAmbience(): void {
  const audio = getAudio();
  if (!ambience || !audio) return;

  const { source, gain } = ambience;
  ambience = null;
  gain.gain.cancelScheduledValues(audio.ctx.currentTime);
  gain.gain.setValueAtTime(gain.gain.value, audio.ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, audio.ctx.currentTime + FADE_OUT_S);
  source.stop(audio.ctx.currentTime + FADE_OUT_S);
  played.push('ambience:stop');
}
