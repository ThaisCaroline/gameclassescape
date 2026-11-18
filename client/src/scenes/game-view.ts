import type { DeskPublic } from '@game/shared';
import Phaser from 'phaser';
import { createLayout } from './room-layout.js';
import { RoomScene } from './room-scene.js';
import type { SceneCallbacks, ViewState } from './view-state.js';

export interface GameView {
  /** Informa o estado atual; a cena redesenha no próximo quadro. */
  render(state: ViewState): void;
  destroy(): void;
}

/** Cria o canvas Phaser dentro de `parent` (que já precisa estar na página). */
export function mountGameView(parent: HTMLElement, desks: DeskPublic[], callbacks: SceneCallbacks): GameView {
  const layout = createLayout(desks);
  const scene = new RoomScene(layout, desks, callbacks);

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: layout.width,
    height: layout.height,
    pixelArt: true,
    backgroundColor: '#0b0b10',
    audio: { noAudio: true }, // o áudio entra com o módulo de som
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene,
  });

  if (import.meta.env.DEV) {
    // Ganchos para testes automáticos (não existem no build de produção).
    (window as unknown as Record<string, unknown>)['__game'] = {
      debug: () => scene.debug(),
      clickDesk: (id: string) => scene.clickDesk(id),
      clickStudent: (id: string) => scene.clickStudent(id),
    };
  }

  return {
    render: (state) => scene.setState(state),
    destroy: () => game.destroy(true),
  };
}
