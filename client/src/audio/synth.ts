import type { SoundKey } from './manifest.js';

const TAU = Math.PI * 2;
const noise = () => Math.random() * 2 - 1;

/** Preenche um buffer com `fn(t)`, limitando suavemente (tanh) para nunca estourar. */
function render(seconds: number, sampleRate: number, fn: (t: number) => number): Float32Array {
  const samples = new Float32Array(Math.floor(seconds * sampleRate));
  for (let i = 0; i < samples.length; i++) samples[i] = Math.tanh(fn(i / sampleRate));
  return samples;
}

const footstep = (sr: number) => {
  let low = 0;
  return render(0.18, sr, (t) => {
    low += (noise() - low) * 0.15;
    return (low * 2.5 * Math.exp(-28 * t) + Math.sin(TAU * 70 * t) * Math.exp(-35 * t) * 0.8) * 0.6;
  });
};

const chalk = (sr: number) => {
  let prev = 0;
  return render(1.4, sr, (t) => {
    const n = noise();
    const scratch = n - prev; // passa-alta: som áspero
    prev = n;
    const envelope = Math.sin((Math.PI * t) / 1.4) ** 0.7 * (0.5 + 0.5 * Math.sin(TAU * 9 * t)) ** 1.5;
    return scratch * envelope * 0.45;
  });
};

const ruler = (sr: number) =>
  render(0.5, sr, (t) =>
    1.4 * (noise() * Math.exp(-60 * t) * 1.2 + Math.sin(TAU * 210 * t) * Math.exp(-14 * t) * 0.9 + Math.sin(TAU * 55 * t) * Math.exp(-9 * t) * 0.8),
  );

const jumpscare = (sr: number) => {
  let phase = 0;
  return render(1.4, sr, (t) => {
    phase += (TAU * (500 + 1500 * Math.min(t / 0.25, 1))) / sr; // grito que sobe
    const saw = ((phase / TAU) % 1) * 2 - 1;
    const body = saw * 0.5 + Math.sin(phase * 1.5) * 0.3 + noise() * 0.35;
    const envelope = Math.min(t / 0.005, 1) * (t < 0.9 ? 1 : Math.exp(-(t - 0.9) * 8));
    return body * envelope * 2;
  });
};

const correct = (sr: number) =>
  render(0.5, sr, (t) => {
    const first = Math.sin(TAU * 660 * t) * Math.exp(-12 * t);
    const second = t >= 0.12 ? Math.sin(TAU * 880 * (t - 0.12)) * Math.exp(-10 * (t - 0.12)) : 0;
    return (first + second) * 0.35;
  });

const wrong = (sr: number) =>
  render(0.35, sr, (t) => {
    const buzz = Math.sign(Math.sin(TAU * 110 * t)) * 0.5 + Math.sin(TAU * 82 * t) * 0.5;
    return buzz * Math.exp(-7 * t) * 0.4;
  });

const whisper = (sr: number) => {
  let prev = 0;
  return render(0.9, sr, (t) => {
    const n = noise();
    const air = n - prev;
    prev = n;
    return air * Math.sin((Math.PI * t) / 0.9) ** 2 * (0.6 + 0.4 * Math.sin(TAU * 6 * t)) * 0.3;
  });
};

/** Zumbido grave que se repete sem estalo (frequências com ciclos inteiros em 6 s; o ruído some nas pontas). */
const ambience = (sr: number) => {
  const length = 6;
  let low = 0;
  return render(length, sr, (t) => {
    low += (noise() - low) * 0.02;
    const edge = Math.min(1, t / 0.3, (length - t) / 0.3);
    const drone = Math.sin(TAU * 55 * t) * 0.5 + Math.sin(TAU * 82.5 * t) * 0.3;
    return (drone * (0.8 + 0.2 * Math.sin((TAU * t) / length)) + low * 3 * edge) * 0.35;
  });
};

const GENERATORS: Record<SoundKey, (sampleRate: number) => Float32Array> = {
  footstep,
  chalk,
  ruler,
  jumpscare,
  correct,
  wrong,
  whisper,
  ambience,
};

/** Som provisório gerado por código, enquanto não houver arquivo de verdade. */
export function synthesize(key: SoundKey, sampleRate: number): Float32Array {
  return GENERATORS[key](sampleRate);
}
