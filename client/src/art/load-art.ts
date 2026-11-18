import Phaser from 'phaser';
import { ART } from './manifest.js';

const AVAILABLE_KEY = 'art-available';

/** Fase 1 (preload): baixa a lista de peças que já têm arte pronta. */
export function loadArtList(scene: Phaser.Scene): void {
  scene.load.json(AVAILABLE_KEY, 'assets/available.json');
}

/**
 * Fase 2: carrega só as peças listadas em assets/available.json e chama `done` ao terminar.
 * As que não estiverem na lista usam o provisório (placeholders.ts).
 */
export function loadAvailableArt(scene: Phaser.Scene, done: () => void): void {
  const available = (scene.cache.json.get(AVAILABLE_KEY) as string[] | undefined) ?? [];
  const specs = ART.filter((spec) => available.includes(spec.key));
  if (specs.length === 0) return done();

  for (const spec of specs) scene.load.image(spec.key, `assets/${spec.file}`);
  scene.load.once(Phaser.Loader.Events.COMPLETE, done);
  scene.load.start();
}
