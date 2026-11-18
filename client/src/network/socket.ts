import { io, type Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '@game/shared';

export type GameSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

/**
 * Onde está o servidor:
 * - VITE_SERVER_URL, se definido (ex.: app Capacitor apontando para o servidor público);
 * - em produção, o mesmo endereço que serviu a página (o servidor entrega o front e o socket juntos; https vira wss);
 * - em desenvolvimento, a porta 3000 do mesmo host da página (funciona no celular pela rede local).
 */
const configured = import.meta.env['VITE_SERVER_URL'] as string | undefined;
const url = configured ?? (import.meta.env.PROD ? location.origin : `${location.protocol}//${location.hostname}:3000`);

export const socket: GameSocket = io(url);
