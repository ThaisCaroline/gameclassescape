const timers = new Map<string, NodeJS.Timeout>();

/** Agenda `onExpire` para o instante `endsAt` (ms). Substitui um timer anterior com a mesma chave. */
export function startTimer(key: string, endsAt: number, onExpire: () => void): void {
  clearTimer(key);
  const handle = setTimeout(() => {
    timers.delete(key);
    onExpire();
  }, Math.max(0, endsAt - Date.now()));
  timers.set(key, handle);
}

export function clearTimer(key: string): void {
  const handle = timers.get(key);
  if (handle) clearTimeout(handle);
  timers.delete(key);
}
