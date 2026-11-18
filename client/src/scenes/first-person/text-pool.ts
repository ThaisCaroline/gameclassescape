import Phaser from 'phaser';

/** Textos reaproveitados a cada quadro (nomes, segundos): criar e destruir texto 60 vezes por segundo seria caro. */
export class TextPool {
  private readonly texts = new Map<string, Phaser.GameObjects.Text>();
  private used = new Set<string>();

  constructor(private readonly scene: Phaser.Scene) {}

  /** Começa um quadro: tudo some, e só aparece o que for pedido com `show`. */
  begin(): void {
    this.used = new Set();
  }

  show(key: string, text: string, x: number, y: number, size: number, color: string): void {
    let item = this.texts.get(key);
    if (!item) {
      item = this.scene.add
        .text(0, 0, '', { fontFamily: 'monospace', stroke: '#000000', strokeThickness: 3 })
        .setOrigin(0.5, 1)
        .setDepth(1_000);
      this.texts.set(key, item);
    }
    item.setText(text).setPosition(x, y).setFontSize(size).setColor(color).setVisible(true);
    this.used.add(key);
  }

  /** Termina o quadro: esconde o que não foi pedido. */
  end(): void {
    for (const [key, item] of this.texts) if (!this.used.has(key)) item.setVisible(false);
  }
}
