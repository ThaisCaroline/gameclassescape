import { jumpDistance, type DeskPublic } from '@game/shared';
import Phaser from 'phaser';
import type { Layout } from './room-layout.js';
import { SCENE } from './scene-config.js';
import type { SceneCallbacks, ViewState } from './view-state.js';

type Mode = 'none' | 'here' | 'enabled';

interface DeskSprite {
  image: Phaser.GameObjects.Image;
  outline: Phaser.GameObjects.Graphics;
  /** Segundos que se tem para responder se pular para esta cadeira. */
  seconds: Phaser.GameObjects.Text;
  mode: Mode;
  /** Só vale em 'enabled': a cadeira está a 2 de distância (menos tempo), não a 1. */
  far: boolean;
}

/**
 * As cadeiras: desenho + contorno que indica o estado (aqui / ao alcance).
 * Ao alcance, verde = 1 cadeira (tempo cheio) e laranja = 2 (metade do tempo), com os segundos escritos em cima.
 */
export class DeskLayer {
  private readonly sprites = new Map<string, DeskSprite>();

  constructor(
    private readonly scene: Phaser.Scene,
    desks: DeskPublic[],
    private readonly layout: Layout,
    private readonly callbacks: SceneCallbacks,
  ) {
    const door = layout.door;
    if (door) scene.add.image(door.x, door.y, 'door').setOrigin(0.5, 0.5).setDepth(1);
    scene.add.image(layout.board.x, layout.board.y, 'board').setOrigin(0.5, 0.5).setDepth(1);

    for (const desk of desks) {
      const { x, y } = layout.deskCenter(desk);
      const image = scene.add.image(x, y, 'desk').setDepth(y - 30);
      const outline = scene.add.graphics().setDepth(y - 29);
      const seconds = scene.add
        .text(x, y - 34, '', { fontSize: '10px', fontFamily: 'monospace', color: '#ffffff', stroke: '#000000', strokeThickness: 3 })
        .setOrigin(0.5, 1)
        .setDepth(10_500); // por cima da escuridão, para ler os segundos
      image.setInteractive({ useHandCursor: true });
      image.on('pointerdown', () => this.click(desk.id));
      this.sprites.set(desk.id, { image, outline, seconds, mode: 'none', far: false });
    }
  }

  /** Toca na cadeira. Só vale se estiver ao alcance (mesma regra do mouse/dedo). */
  click(deskId: string): boolean {
    if (this.sprites.get(deskId)?.mode !== 'enabled') return false;
    this.callbacks.onDeskClick?.(deskId);
    return true;
  }

  update(state: ViewState, time: number): void {
    const me = state.room.students.find((s) => s.id === state.meId);
    const here = state.room.desks.find((d) => d.id === me?.deskId);
    const { near, far } = state.room.jumpTimes;

    for (const desk of state.room.desks) {
      const sprite = this.sprites.get(desk.id);
      if (!sprite) continue;

      sprite.mode = desk.id === here?.id ? 'here' : state.enabledDesks.has(desk.id) ? 'enabled' : 'none';
      sprite.far = sprite.mode === 'enabled' && here !== undefined && jumpDistance(here, desk) > 1;

      sprite.seconds.setText(sprite.mode === 'enabled' ? `${Math.round((sprite.far ? far : near) / 1000)}s` : '');
      sprite.seconds.setColor(sprite.far ? '#ffb26b' : '#8ce99a');
      this.drawOutline(desk, sprite, time);
    }
  }

  debug(): Array<{ id: string; mode: Mode; far: boolean }> {
    return [...this.sprites].map(([id, s]) => ({ id, mode: s.mode, far: s.far }));
  }

  private drawOutline(desk: DeskPublic, sprite: DeskSprite, time: number): void {
    sprite.outline.clear();
    if (sprite.mode === 'none') return;

    const { here, near, far } = SCENE.colors;
    const pulse = sprite.mode === 'enabled' ? 0.6 + 0.4 * Math.sin(time / 180) : 1;
    const color = sprite.mode === 'here' ? here : sprite.mode === 'enabled' ? (sprite.far ? far : near) : near;
    const { x, y } = this.layout.deskCenter(desk);
    const width = SCENE.tile - 8;
    const height = 52;
    sprite.outline.lineStyle(2, color, pulse).strokeRect(x - width / 2, y - height / 2, width, height);
  }
}
