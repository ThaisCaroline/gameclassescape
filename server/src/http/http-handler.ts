import type { IncomingMessage, ServerResponse } from 'node:http';
import { createStaticHandler } from './static-files.js';

/** Responde ao HTTP comum: /health (para o monitoramento da hospedagem) e os arquivos do jogo. O socket.io cuida do resto. */
export function createHttpHandler(staticDir: string) {
  const serveStatic = createStaticHandler(staticDir);

  return (req: IncomingMessage, res: ServerResponse): void => {
    if ((req.url ?? '').split('?')[0] === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }).end('{"status":"ok"}');
      return;
    }
    void serveStatic(req, res);
  };
}
