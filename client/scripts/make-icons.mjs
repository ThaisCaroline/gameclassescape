// Gera os ícones PROVISÓRIOS do app (porta vermelha numa sala escura) em client/public/icons/.
// Quando houver arte de verdade, é só substituir os PNGs (mesmos nomes e tamanhos).
// Uso: node client/scripts/make-icons.mjs
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const outDir = path.resolve(import.meta.dirname, '../public/icons');
fs.mkdirSync(outDir, { recursive: true });

const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (bytes) => {
  let c = 0xffffffff;
  for (const byte of bytes) c = crcTable[(c ^ byte) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
};

function png(size) {
  const px = (x, y) => {
    const u = x / size, v = y / size;
    const inDoor = u > 0.34 && u < 0.66 && v > 0.22 && v < 0.82; // dentro da "zona segura" do ícone mascarável
    const inFrame = u > 0.31 && u < 0.69 && v > 0.19 && v < 0.82;
    const knob = (u - 0.58) ** 2 + (v - 0.52) ** 2 < 0.0009;
    if (knob) return [255, 209, 102];
    if (inDoor) return [192, 57, 43];
    if (inFrame) return [74, 44, 42];
    return [11, 11, 16];
  };
  const raw = Buffer.alloc((size * 3 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0;
    for (let x = 0; x < size; x++) raw.set(px(x, y), y * (size * 3 + 1) + 1 + x * 3);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 2; // RGB
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

for (const [name, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]]) {
  fs.writeFileSync(path.join(outDir, name), png(size));
  console.log('wrote', name);
}
