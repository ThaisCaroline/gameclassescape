import type { GameSocket } from './types.js';

/**
 * Eventos que respondem por callback (`ack`) e quantos argumentos de dados vêm antes dele.
 * Os outros eventos (virar, pegar, responder, sussurrar) não têm callback.
 */
const DATA_ARGS: Record<string, number> = {
  'room:create': 1,
  'room:join': 1,
  'room:create_solo': 1,
  'solo:start': 0,
  'teacher:set_questions': 1,
  'teacher:start_round': 0,
  'student:request_jump': 1,
  'student:pick_seat': 1,
};

const isFunction = (value: unknown): value is (...args: unknown[]) => void => typeof value === 'function';

/**
 * Protege o servidor de pacotes mal formados. Os handlers assumem `(dados, ack)`; um cliente que mande o callback
 * na posição errada ou nem mande derrubaria o servidor inteiro (`ack is not a function`). Aqui o pacote é
 * normalizado para `[evento, ...dados, ack]` ou descartado se não tiver callback nenhum.
 */
export function guardAcks(socket: GameSocket): void {
  socket.on('error', () => undefined); // o pacote descartado gera um 'error'; sem ouvinte ele estouraria

  socket.use((packet, next) => {
    const [event, ...rest] = packet as [string, ...unknown[]];
    const dataCount = DATA_ARGS[event];
    if (dataCount === undefined) return next();

    const ack = [...rest].reverse().find(isFunction);
    if (!ack) return next(new Error('ack required'));

    const data = rest.filter((arg) => !isFunction(arg)).slice(0, dataCount);
    while (data.length < dataCount) data.push(undefined);
    packet.splice(0, packet.length, event, ...data, ack);
    next();
  });
}
