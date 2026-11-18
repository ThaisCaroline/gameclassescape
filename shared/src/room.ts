import type { DeskPublic } from './desk.js';
import type { RoundPublic } from './round.js';
import type { Difficulty } from './solo.js';
import type { StudentPublic } from './student.js';

/** Estado da sala que o servidor envia aos clientes. */
export interface RoomPublic {
  /** Código curto de convite. */
  code: string;
  /** Dificuldade da sala (escolhida por quem a abriu). Controla o escuro da sala e, depois, o aviso do professor. */
  difficulty: Difficulty;
  /** Hora do servidor (ms) no instante do envio. O cliente usa para corrigir diferença de relógio nos timestamps. */
  serverTime: number;
  /** As carteiras (grade fixa 5x5). Cada aluno escolhe a sua na sala de espera (`StudentPublic.deskId`). */
  desks: DeskPublic[];
  /** Tempo para responder, em ms: pulando 1 cadeira (`near`) ou 2 (`far`, menos). */
  jumpTimes: { near: number; far: number };
  students: StudentPublic[];
  round: RoundPublic;
}
