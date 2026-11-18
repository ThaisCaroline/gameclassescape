import type { DeskPublic } from '@game/shared';
import Phaser from 'phaser';
import type { SceneCallbacks, ViewState } from '../view-state.js';
import { FP } from './fp-config.js';
import { TeacherFirstPersonScene } from './teacher-scene.js';

export interface TeacherView {
  /** Informa o estado atual; a cena redesenha no próximo quadro. */
  render(state: ViewState): void;
  destroy(): void;
}

/** Cria o canvas da visão em primeira pessoa do professor dentro de `parent` (que já precisa estar na página). */
export function mountTeacherView(parent: HTMLElement, desks: DeskPublic[], callbacks: SceneCallbacks): TeacherView {
  const scene = new TeacherFirstPersonScene(desks, callbacks);

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: FP.width,
    height: FP.height,
    backgroundColor: '#0b0b10',
    audio: { noAudio: true },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene,
  });

  if (import.meta.env.DEV) {
    // Ganchos para testes automáticos (não existem no build de produção).
    (window as unknown as Record<string, unknown>)['__game'] = {
      debug: () => scene.debug(),
      clickDesk: () => false,
      clickStudent: (id: string) => scene.clickStudent(id),
    };
  }

  return { render: (state) => scene.setState(state), destroy: () => game.destroy(true) };
}
