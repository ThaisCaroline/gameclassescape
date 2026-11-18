import type { Ack } from './ack.js';
import type { QuestionInput } from './question-input.js';
import type { TeacherFacing } from './round.js';
import type { Difficulty, SoloRole } from './solo.js';

/** Mensagens que o cliente envia ao servidor. São intenções; o servidor valida tudo. */
export interface ClientToServerEvents {
  // Sala
  'room:create': (req: { nickname: string; difficulty: Difficulty }, ack: (r: Ack<{ code: string }>) => void) => void;
  'room:join': (req: { code: string; nickname: string }, ack: (r: Ack) => void) => void;
  /** Sala solo: o jogador escolhe o papel e os outros são robôs. A rodada já começa. */
  'room:create_solo': (
    req: { nickname: string; role: SoloRole; difficulty: Difficulty },
    ack: (r: Ack<{ code: string }>) => void,
  ) => void;

  /** Sala solo: o jogador leu a explicação e começou a rodada. */
  'solo:start': (ack: (r: Ack) => void) => void;

  // Professor
  'teacher:set_questions': (req: { questions: QuestionInput[] }, ack: (r: Ack) => void) => void;
  'teacher:start_round': (ack: (r: Ack) => void) => void;
  'teacher:turn': (req: { facing: TeacherFacing }) => void;
  'teacher:catch': (req: { studentId: string }) => void;

  // Aluno
  /** Escolhe a carteira na sala de espera. Escolheu, ficou: não dá para trocar. */
  'student:pick_seat': (req: { deskId: string }, ack: (r: Ack) => void) => void;
  'student:request_jump': (req: { toDeskId: string }, ack: (r: Ack) => void) => void;
  'student:answer': (req: { questionId: string; optionIndex: number }) => void;

  // Fantasma
  'ghost:whisper': (req: { studentId: string }) => void;
}
