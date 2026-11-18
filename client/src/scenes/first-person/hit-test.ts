import type { Rect } from './draw-desk.js';

export interface HitRect {
  id: string;
  /** Profundidade: o que está mais perto (menor) tapa o que está atrás. */
  depth: number;
  rect: Rect;
}

/** O ponto está dentro do polígono? (traçado de um raio e contagem de cruzamentos) */
function pointInPolygon(x: number, y: number, poly: ReadonlyArray<{ x: number; y: number }>): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i]!;
    const b = poly[j]!;
    if (a.y > y !== b.y > y && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

/**
 * Qual alvo está sob o ponto (x, y)? Primeiro pelo desenho exato, do mais perto para o mais longe (o que está na
 * frente tapa o que está atrás). Se o dedo errou por pouco, o mais próximo por perto, com folga de alguns pixels.
 * `minSize`: lado mínimo (em pixels lógicos) da área de toque de cada alvo; alvos menores que isso (os que estão longe)
 * ganham área de toque maior, centrada neles, sem mudar o desenho.
 */
export function hitAt(hits: readonly HitRect[], x: number, y: number, minSize = 0): string | null {
  const byDepth = [...hits].sort((a, b) => a.depth - b.depth);
  const exact = byDepth.find((h) => h.rect.polys.some((poly) => pointInPolygon(x, y, poly)));
  if (exact) return exact.id;

  const slack = 8;
  const distance = (h: HitRect) => Math.hypot(x - (h.rect.x0 + h.rect.x1) / 2, y - (h.rect.y0 + h.rect.y1) / 2);
  const reach = (h: HitRect) => ({
    x: Math.max(slack, (minSize - (h.rect.x1 - h.rect.x0)) / 2 + slack / 2),
    y: Math.max(slack, (minSize - (h.rect.y1 - h.rect.y0)) / 2 + slack / 2),
  });
  const near = byDepth
    .filter((h) => {
      const r = reach(h);
      return x >= h.rect.x0 - r.x && x <= h.rect.x1 + r.x && y >= h.rect.y0 - r.y && y <= h.rect.y1 + r.y;
    })
    .sort((a, b) => distance(a) - distance(b))[0];
  return near?.id ?? null;
}

/** Um ponto da tela que, se tocado, escolhe exatamente este alvo (para os testes automáticos). */
export function tapPointFor(hits: readonly HitRect[], hit: HitRect): { x: number; y: number } | null {
  for (const poly of hit.rect.polys) {
    const x = poly.reduce((sum, p) => sum + p.x, 0) / poly.length;
    const y = poly.reduce((sum, p) => sum + p.y, 0) / poly.length;
    if (hitAt(hits, x, y) === hit.id) return { x, y };
  }
  return null;
}
