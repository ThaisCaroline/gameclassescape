import type { DeskPublic, Difficulty, RoundPublic, SoloRole, StudentPublic } from '@game/shared';
import type { Question } from '../questions/index.js';
import type { PendingJump } from './pending-jump.js';

/** Estado interno da sala. Só no servidor (contém as respostas certas). */
export interface Room {
  code: string;
  difficulty: Difficulty;
  desks: DeskPublic[];
  students: StudentPublic[];
  round: RoundPublic;
  questions: Question[];
  /** Pulos em andamento, por id do aluno. */
  pendingJumps: Map<string, PendingJump>;
  /** Quando cada fantasma pode sussurrar de novo (timestamp ms), por id. */
  whisperReadyAt: Map<string, number>;
  /** Sala solo: quem é o jogador humano e o papel dele; null em sala normal. */
  solo: { humanId: string; role: SoloRole; difficulty: Difficulty } | null;
  /** O que fazer ao fechar a sala (ex.: parar os robôs). */
  cleanups: Array<() => void>;
}
