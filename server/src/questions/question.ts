import type { QuestionPublic } from '@game/shared';

/** Pergunta completa. Só existe no servidor: nunca enviar ao cliente. */
export interface Question extends QuestionPublic {
  /** Índice (0 a 2) da alternativa correta. */
  correctIndex: 0 | 1 | 2;
}
