import type { TeacherFacing } from '@game/shared';
import type Phaser from 'phaser';
import type { Point } from '../../scenes/room-layout.js';
import { SCENE } from '../../scenes/scene-config.js';

export interface TeacherSprite {
  setFacing(facing: TeacherFacing): void;
  /** Batida de régua ao pegar alguém. */
  slam(): void;
}

/**
 * Visual do professor: de frente para os alunos (com um "!" vermelho em cima, para o perigo ficar óbvio),
 * de costas (para o quadro) ou batendo a régua.
 */
export function createTeacherSprite(scene: Phaser.Scene, at: Point): TeacherSprite {
  scene.add.ellipse(at.x, at.y, 30, 10, 0x000000, 0.4).setDepth(at.y - 1); // sombra
  const image = scene.add.image(at.x, at.y, 'teacher_front').setOrigin(0.5, 1).setDepth(at.y);
  const alert = scene.add
    .text(at.x, at.y - 52, '!', { fontSize: '22px', fontFamily: 'monospace', fontStyle: 'bold', color: '#ff6b6b', stroke: '#000000', strokeThickness: 4 })
    .setOrigin(0.5, 1)
    .setDepth(10_500);
  scene.tweens.add({ targets: alert, y: alert.y - 4, duration: 300, yoyo: true, repeat: -1 });
  let slamming = false;

  return {
    setFacing(facing) {
      alert.setVisible(facing === 'students');
      if (!slamming) image.setTexture(facing === 'students' ? 'teacher_front' : 'teacher_back');
    },
    slam() {
      slamming = true;
      image.setTexture('teacher_ruler');
      scene.tweens.add({ targets: image, scale: 1.3, duration: SCENE.slamMs / 2, yoyo: true });
      scene.time.delayedCall(SCENE.slamMs, () => (slamming = false));
    },
  };
}
