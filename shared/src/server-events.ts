import type { QuestionPublic } from './question.js';
import type { RoomPublic } from './room.js';

export type AnswerOutcome = 'correct' | 'wrong' | 'timeout' | 'caught';

/** Mensagens que o servidor envia aos clientes. */
export interface ServerToClientEvents {
  /** Estado completo da sala (para todos). */
  'room:state': (state: RoomPublic) => void;

  /** Só para o aluno que pediu o pulo. */
  'question:show': (msg: { question: QuestionPublic; expiresAt: number }) => void;
  /** Só para o aluno alvo do sussurro. */
  'question:update': (msg: { questionId: string; removedOptions: number[] }) => void;
  'answer:result': (msg: { outcome: AnswerOutcome }) => void;

  /** Só para o fantasma que sussurrou. O professor não fica sabendo. */
  'ghost:whisper_cooldown': (msg: { readyAt: number }) => void;

  /** O professor saiu: a sala foi encerrada. */
  'room:closed': () => void;

  /** Efeitos: jumpscare só para quem estourou o tempo; régua para todos. */
  'fx:jumpscare': () => void;
  /** Régua: `studentId` é quem foi pego (para desenhar o feixe do professor até ele). */
  'fx:ruler': (msg: { studentId: string }) => void;
}
