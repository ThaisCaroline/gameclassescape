import { randomInt } from 'node:crypto';
import { config } from '../config.js';

// Sem 0/O e 1/I para evitar confusão ao digitar no celular.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateRoomCode(isTaken: (code: string) => boolean): string {
  for (;;) {
    let code = '';
    for (let i = 0; i < config.roomCodeLength; i++) {
      code += ALPHABET.charAt(randomInt(ALPHABET.length));
    }
    if (!isTaken(code)) return code;
  }
}
