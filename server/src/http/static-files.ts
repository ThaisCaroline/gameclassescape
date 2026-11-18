import { readFile, stat } from 'node:fs/promises';
import type { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.woff2': 'font/woff2',
};
const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.webmanifest', '.svg', '.txt']);
/** Arquivos que o Vite nomeia com hash do conteúdo: nunca mudam, podem ficar em cache para sempre. */
const HASHED = /-[A-Za-z0-9_-]{8}\.(js|css)$/;

interface Cached {
  body: Buffer;
  gzip: Buffer | null;
  type: string;
  cacheControl: string;
}

const cache = new Map<string, Cached>();

async function load(file: string): Promise<Cached | null> {
  const known = cache.get(file);
  if (known) return known;

  try {
    if (!(await stat(file)).isFile()) return null;
    const body = await readFile(file);
    const ext = path.extname(file).toLowerCase();
    const gzip = COMPRESSIBLE.has(ext) ? gzipSync(body) : null;
    const entry: Cached = {
      body,
      gzip: gzip && gzip.length < body.length ? gzip : null,
      type: MIME[ext] ?? 'application/octet-stream',
      cacheControl: HASHED.test(file) ? 'public, max-age=31536000, immutable' : 'no-cache',
    };
    cache.set(file, entry);
    return entry;
  } catch {
    return null;
  }
}

function decodePathname(url: string | undefined): string | null {
  try {
    const pathname = decodeURIComponent(new URL(url ?? '/', 'http://localhost').pathname);
    return pathname.includes('\0') ? null : pathname;
  } catch {
    return null;
  }
}

/** Serve os arquivos do jogo (front compilado). Rotas sem extensão caem no index.html (app de página única). */
export function createStaticHandler(rootDir: string) {
  const root = path.resolve(rootDir);

  return async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }

    const pathname = decodePathname(req.url);
    if (pathname === null) {
      res.writeHead(400).end();
      return;
    }

    const target = path.join(root, pathname.endsWith('/') ? `${pathname}index.html` : pathname);
    if (target !== root && !target.startsWith(root + path.sep)) {
      res.writeHead(404).end(); // tentativa de sair da pasta (../)
      return;
    }

    const found =
      (await load(target)) ?? (path.extname(pathname) === '' ? await load(path.join(root, 'index.html')) : null);
    if (!found) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
      return;
    }

    const useGzip = found.gzip !== null && /\bgzip\b/.test(String(req.headers['accept-encoding'] ?? ''));
    const body = useGzip && found.gzip ? found.gzip : found.body;
    res.writeHead(200, {
      'Content-Type': found.type,
      'Content-Length': body.length,
      'Cache-Control': found.cacheControl,
      Vary: 'Accept-Encoding',
      ...(useGzip ? { 'Content-Encoding': 'gzip' } : {}),
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(req.method === 'HEAD' ? undefined : body);
  };
}
