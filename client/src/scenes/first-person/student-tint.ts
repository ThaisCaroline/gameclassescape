import { FP } from './fp-config.js';

/** A cor provisória de cada aluno, tirada do apelido (a mesma em todas as telas). */
export function studentTint(nickname: string): number {
  let hash = 0;
  for (const char of nickname) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return FP.studentTints[hash % FP.studentTints.length] ?? 0xffffff;
}
