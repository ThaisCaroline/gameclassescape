export type RoundPhase = 'lobby' | 'running' | 'ended';

export type TeacherFacing = 'students' | 'board';

export type RoundWinner = 'teacher' | 'students';

export interface RoundPublic {
  phase: RoundPhase;
  /** Timestamp (ms) em que o cronômetro da aula zera; null fora de 'running'. */
  endsAt: number | null;
  teacherId: string;
  teacherFacing: TeacherFacing;
  /** Preenchido só em 'ended'. */
  winner: RoundWinner | null;
}
