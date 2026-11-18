import Phaser from 'phaser';
import { isPlaceholder } from '../../art/placeholders.js';
import { t } from '../../i18n/index.js';
import { SCENE } from '../../scenes/scene-config.js';

export interface StudentLook {
  x: number;
  y: number;
  moving: boolean;
  ghost: boolean;
  isMe: boolean;
  /** O professor pode pegar este aluno agora. */
  clickable: boolean;
  /** Mostrar o nome (some nas cadeiras cheias, para os nomes não se embolarem). */
  showName: boolean;
}

/** Visual de um aluno: boneco, nome, anel quando se move, hop entre carteiras, translúcido se fantasma. */
export class StudentSprite {
  readonly container: Phaser.GameObjects.Container;
  private readonly image: Phaser.GameObjects.Image;
  private readonly label: Phaser.GameObjects.Text;
  private readonly ring: Phaser.GameObjects.Graphics;
  private wobble: Phaser.Tweens.Tween | null = null;
  /** Cor deste aluno enquanto o desenho for provisório (null quando há arte de verdade). */
  private readonly baseTint: number | null;
  private placed = false;
  private target = { x: 0, y: 0 };
  clickable = false;
  moving = false;

  constructor(
    private readonly scene: Phaser.Scene,
    readonly id: string,
    readonly nickname: string,
    /** Este é o jogador local: ganha anel amarelo, seta e "(you)" para ficar óbvio quem é. */
    private readonly isMe: boolean,
    onClick: (id: string) => void,
  ) {
    this.image = scene.add.image(0, 0, 'student').setOrigin(0.5, 1);
    this.baseTint = isPlaceholder('student') ? tintFor(nickname) : null;
    if (this.baseTint !== null) this.image.setTint(this.baseTint);
    this.ring = scene.add.graphics();
    this.ring.lineStyle(2, SCENE.colors.moving).strokeEllipse(0, -2, 26, 9);

    const parts: Phaser.GameObjects.GameObject[] = [this.ring];
    if (isMe) {
      const youRing = scene.add.graphics();
      youRing.lineStyle(3, SCENE.colors.you).strokeEllipse(0, -2, 34, 12);
      parts.push(youRing);
    }
    parts.push(this.image);

    const name = isMe ? `${nickname} (${t('ui.you')})` : nickname;
    this.label = scene.add
      .text(0, -this.image.height - 2, name, { fontSize: '9px', fontFamily: 'monospace', color: isMe ? '#ffd43b' : '#ffffff', stroke: '#000000', strokeThickness: 3 })
      .setOrigin(0.5, 1);
    parts.push(this.label);

    if (isMe) {
      const arrow = scene.add
        .text(0, -this.image.height - 12, '▼', { fontSize: '12px', fontFamily: 'monospace', color: '#ffd43b', stroke: '#000000', strokeThickness: 3 })
        .setOrigin(0.5, 1);
      scene.tweens.add({ targets: arrow, y: arrow.y - 4, duration: 450, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      parts.push(arrow);
    }
    this.container = scene.add.container(0, 0, parts);

    this.image.setInteractive({ useHandCursor: true });
    this.image.on('pointerdown', () => this.clickable && onClick(id));
  }

  update(look: StudentLook): void {
    this.clickable = look.clickable;
    this.moving = look.moving;
    this.moveTo(look.x, look.y);
    this.container.setDepth(this.container.y + (this.isMe ? 0.5 : 0)); // o jogador local fica por cima de quem divide a carteira
    this.container.setAlpha(look.ghost ? 0.45 : 1);
    this.label.setVisible(look.showName);
    this.ring.setVisible(look.moving);
    this.setWobble(look.moving);
  }

  /** Foi pego pelo professor: pisca vermelho e sobe um "CAUGHT!" (para ninguém ficar sem entender o que houve). */
  flashCaught(): void {
    this.image.setTintFill(SCENE.colors.beam);
    this.scene.time.delayedCall(350, () => {
      this.image.clearTint();
      if (this.baseTint !== null) this.image.setTint(this.baseTint);
    });

    const text = this.scene.add
      .text(this.container.x, this.container.y - this.image.height - 18, t('ui.caught_label'), {
        fontSize: '12px',
        fontFamily: 'monospace',
        fontStyle: 'bold',
        color: '#ff6b6b',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5, 1)
      .setDepth(10_500);
    this.scene.tweens.add({ targets: text, y: text.y - 22, alpha: 0, duration: 900, onComplete: () => text.destroy() });
  }

  center(): { x: number; y: number } {
    return { x: this.container.x, y: this.container.y - this.image.height / 2 };
  }

  destroy(): void {
    this.wobble?.stop();
    this.container.destroy();
  }

  private moveTo(x: number, y: number): void {
    if (!this.placed) {
      this.container.setPosition(x, y);
      this.target = { x, y };
      this.placed = true;
      return;
    }
    if (x === this.target.x && y === this.target.y) return;

    this.target = { x, y };
    this.scene.tweens.add({ targets: this.container, x, y, duration: SCENE.hopMs, ease: 'Sine.easeInOut' });
    this.scene.tweens.add({ targets: this.image, y: -SCENE.hopHeight, duration: SCENE.hopMs / 2, yoyo: true, ease: 'Sine.easeOut' });
  }

  private setWobble(on: boolean): void {
    if (on && !this.wobble) {
      this.wobble = this.scene.tweens.add({ targets: this.image, angle: { from: -6, to: 6 }, duration: 160, yoyo: true, repeat: -1 });
    } else if (!on && this.wobble) {
      this.wobble.stop();
      this.wobble = null;
      this.image.setAngle(0);
    }
  }
}

function tintFor(nickname: string): number {
  let hash = 0;
  for (const char of nickname) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return SCENE.studentTints[hash % SCENE.studentTints.length] ?? 0xffffff;
}
