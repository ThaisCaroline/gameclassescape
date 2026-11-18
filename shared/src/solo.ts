/** Modo solo: os outros papéis são robôs. */
export type SoloRole = 'student' | 'teacher';
export type Difficulty = 'easy' | 'medium' | 'hard';

export const SOLO_ROLES: readonly SoloRole[] = ['student', 'teacher'];
export const DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard'];
