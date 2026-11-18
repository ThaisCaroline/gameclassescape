import type { DeskPublic } from '@game/shared';
import Phaser from 'phaser';
import type { SceneCallbacks, ViewState } from '../view-state.js';
import { FirstPersonScene } from './first-person-scene.js';
import { FP } from './fp-config.js';

export interface FirstPersonView {
  /** Informa o estado atual; a cena redesenha no próximo quadro. */
  render(state: ViewState): void;
  /** Vira para o lado: -1 = esquerda, 1 = direita. */
  turn(direction: -1 | 1): void;
  /** Liga/desliga o giro (a pergunta cobre a tela e o jogador não vira a cabeça). */
  setTurnEnabled(enabled: boolean): void;
  /** front, right, back ou left, em relação ao quadro. */
  facingName(): string;
  destroy(): void;
}

/** Cria o canvas em primeira pessoa dentro de `parent` (que já precisa estar na página). */
export function mountFirstPersonView(parent: HTMLElement, desks: DeskPublic[], callbacks: SceneCallbacks): FirstPersonView {
  const scene = new FirstPersonScene(desks, callbacks);

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: FP.width,
    height: FP.height,
    backgroundColor: '#0b0b10',
    audio: { noAudio: true }, // o áudio é feito à parte (Web Audio)
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene,
  });

  if (import.meta.env.DEV) {
    // Ganchos para testes automáticos (não existem no build de produção).
    (window as unknown as Record<string, unknown>)['__game'] = {
      debug: () => scene.debug(),
      clickDesk: (id: string) => scene.clickDesk(id),
      clickStudent: () => false,
    };
  }

  return {
    render: (state) => scene.setState(state),
    turn: (direction) => scene.turn(direction),
    setTurnEnabled: (enabled) => scene.setTurnEnabled(enabled),
    facingName: () => scene.facingName(),
    destroy: () => game.destroy(true),
  };
}
