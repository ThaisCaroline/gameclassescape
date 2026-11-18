import { FP } from './fp-config.js';

export interface ScreenPoint {
  x: number;
  y: number;
}

export interface Projected extends ScreenPoint {
  /** Profundidade: quanto maior, mais longe. */
  depth: number;
  /** Quanto 1 carteira mede na tela nesta profundidade (pixels). */
  size: number;
}

type Point3 = readonly [x: number, y: number, h: number];

/**
 * Câmera em primeira pessoa: o olho fica em (x, y) do mundo olhando na direção `yaw`
 * (0 = para o quadro, 90° = para a direita). Projeta pontos do mundo para a tela com perspectiva.
 */
export class FpCamera {
  x = 0;
  y = 0;
  yaw = 0;
  /** Altura do olho e posição do horizonte: o professor, em pé, enxerga de mais alto que o aluno sentado. */
  eye: number = FP.eye;
  horizon: number = FP.horizon;
  /** Distância focal (zoom): menor = campo de visão mais aberto. */
  focal: number = FP.focal;

  get horizonY(): number {
    return FP.height * this.horizon;
  }

  /** Posição de um ponto em relação ao olho: `side` (direita positiva) e `ahead` (à frente). */
  view(wx: number, wy: number): { side: number; ahead: number } {
    const dx = wx - this.x;
    const dy = wy - this.y;
    return {
      ahead: dx * Math.sin(this.yaw) - dy * Math.cos(this.yaw),
      side: dx * Math.cos(this.yaw) + dy * Math.sin(this.yaw),
    };
  }

  /** Profundidade de um ponto do chão (para ordenar o que se desenha: o mais longe primeiro). */
  depthAt(wx: number, wy: number): number {
    return this.view(wx, wy).ahead + FP.near;
  }

  project(wx: number, wy: number, h: number): Projected | null {
    const { side, ahead } = this.view(wx, wy);
    const depth = ahead + FP.near;
    if (depth < FP.minDepth) return null;
    return this.screen(side, depth, h);
  }

  /** Projeta um polígono do mundo, cortando o que fica atrás do plano próximo. Null se nada aparece. */
  polygon(points: readonly Point3[]): ScreenPoint[] | null {
    const view = points.map(([wx, wy, h]) => {
      const { side, ahead } = this.view(wx, wy);
      return { side, depth: ahead + FP.near, h };
    });

    const clipped: typeof view = [];
    view.forEach((a, i) => {
      const b = view[(i + 1) % view.length]!;
      const aIn = a.depth >= FP.minDepth;
      const bIn = b.depth >= FP.minDepth;
      if (aIn) clipped.push(a);
      if (aIn !== bIn) {
        const t = (FP.minDepth - a.depth) / (b.depth - a.depth);
        clipped.push({ side: a.side + (b.side - a.side) * t, depth: FP.minDepth, h: a.h + (b.h - a.h) * t });
      }
    });
    if (clipped.length < 3) return null;
    return clipped.map((p) => this.screen(p.side, p.depth, p.h));
  }

  /** Projeta um segmento de reta do mundo, cortando o que fica atrás do plano próximo. Null se nada aparece. */
  segment(a: Point3, b: Point3): [ScreenPoint, ScreenPoint] | null {
    const va = this.view(a[0], a[1]);
    const vb = this.view(b[0], b[1]);
    let p = { side: va.side, depth: va.ahead + FP.near, h: a[2] };
    let q = { side: vb.side, depth: vb.ahead + FP.near, h: b[2] };
    if (p.depth < FP.minDepth && q.depth < FP.minDepth) return null;

    const cut = (from: typeof p, to: typeof p) => {
      const t = (FP.minDepth - from.depth) / (to.depth - from.depth);
      return { side: from.side + (to.side - from.side) * t, depth: FP.minDepth, h: from.h + (to.h - from.h) * t };
    };
    if (p.depth < FP.minDepth) p = cut(p, q);
    if (q.depth < FP.minDepth) q = cut(q, p);
    return [this.screen(p.side, p.depth, p.h), this.screen(q.side, q.depth, q.h)];
  }

  private screen(side: number, depth: number, h: number): Projected {
    const size = this.focal / depth;
    return {
      x: FP.width / 2 + side * size,
      y: this.horizonY + (this.eye - h) * size,
      depth,
      size,
    };
  }
}
