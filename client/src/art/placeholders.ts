import type Phaser from 'phaser';
import { ART } from './manifest.js';

const placeholderKeys = new Set<string>();

/** Esta peça ainda é provisória (gerada por código)? Só nesses casos vale pintar (tint) por aluno. */
export function isPlaceholder(key: string): boolean {
  return placeholderKeys.has(key);
}

type Draw = (g: Phaser.GameObjects.Graphics) => void;

const SKIN = 0xf1c27d;
const SUIT = 0x1d3557;

const person = (hair: number): Draw => (g) => {
  g.fillStyle(SUIT).fillRect(6, 18, 20, 30);
  g.fillStyle(SKIN).fillCircle(16, 10, 8);
  g.fillStyle(hair).fillRect(8, 2, 16, 6);
};

const DRAWINGS: Record<string, Draw> = {
  floor: (g) => {
    g.fillStyle(0x3a2f2a).fillRect(0, 0, 64, 64);
    g.lineStyle(1, 0x2d2420).strokeRect(0.5, 0.5, 63, 63);
  },
  desk: (g) => {
    g.fillStyle(0x8b5a2b).fillRect(0, 0, 48, 28);
    g.fillStyle(0x5c3a1a).fillRect(0, 28, 48, 12);
  },
  student: (g) => {
    g.fillStyle(0xffffff).fillRect(4, 12, 16, 20); // branco para o tint por aluno
    g.fillStyle(SKIN).fillCircle(12, 8, 6);
  },
  teacher_front: (g) => {
    person(0x222222)(g);
    g.fillStyle(0x111111).fillRect(11, 9, 3, 3).fillRect(18, 9, 3, 3);
  },
  teacher_back: person(0x222222),
  teacher_ruler: (g) => {
    person(0x222222)(g);
    g.fillStyle(0xffd166).fillRect(25, 2, 4, 26);
  },
  board: (g) => {
    g.fillStyle(0x6f4e37).fillRect(0, 0, 128, 40);
    g.fillStyle(0x1b4332).fillRect(4, 4, 120, 32);
    g.fillStyle(0xffffff, 0.6).fillRect(12, 12, 50, 2).fillRect(12, 20, 70, 2);
  },
  door: (g) => {
    g.fillStyle(0x4a2c2a).fillRect(0, 0, 40, 56);
    g.fillStyle(0xffd166).fillCircle(32, 30, 3);
  },
};

/** Gera por código as peças que ainda não têm arte de verdade carregada. */
export function ensurePlaceholders(scene: Phaser.Scene): void {
  for (const spec of ART) {
    if (scene.textures.exists(spec.key)) continue;
    const g = scene.make.graphics({}, false);
    DRAWINGS[spec.key]?.(g);
    g.generateTexture(spec.key, spec.width, spec.height);
    g.destroy();
    placeholderKeys.add(spec.key);
  }
}
