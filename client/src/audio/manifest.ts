/**
 * Todos os sons do jogo. Arquivos (MP3) em client/public/assets/audio/ e a chave `sfx_<nome>`
 * em assets/available.json. Sem arquivo, usa o som provisório gerado por código (synth.ts).
 * Detalhes em docs/ASSETS.md.
 */
export const SOUND_KEYS = [
  'footstep',
  'chalk',
  'ruler',
  'jumpscare',
  'correct',
  'wrong',
  'whisper',
  'ambience',
] as const;

export type SoundKey = (typeof SOUND_KEYS)[number];

export const soundFile = (key: SoundKey) => `${key}.mp3`;
export const soundAvailabilityKey = (key: SoundKey) => `sfx_${key}`;
