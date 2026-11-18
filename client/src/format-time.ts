/** Milissegundos como m:ss (arredonda para cima, nunca negativo). */
export function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

/** Segundos restantes, arredondados para cima. */
export function secondsLeft(ms: number): number {
  return Math.max(0, Math.ceil(ms / 1000));
}
