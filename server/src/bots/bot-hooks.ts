import type { Room } from '../rooms/index.js';

/** O que os robôs precisam do mundo de fora (rede). O servidor de verdade fornece; o resto só usa. */
export interface BotHooks {
  /** O estado da sala mudou: avisar todos. */
  changed(room: Room): void;
  /** O professor-robô pegou um aluno (régua para todos, aviso ao aluno). */
  caught(room: Room, studentId: string): void;
  /** Um fantasma-robô sussurrou para o jogador humano. */
  whispered(humanId: string, questionId: string, removedOptions: number[]): void;
}
