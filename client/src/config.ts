import type { Difficulty } from '@game/shared';

/** Quando o aviso grande "professor olhando / de costas" aparece: sempre, só com o professor à vista, ou nunca. */
export type CuePolicy = 'always' | 'when_teacher_in_view' | 'never';

/** Parâmetros do cliente. Os limites espelham os do servidor (que é quem valida de verdade). */
export const config = {
  /** Aviso do professor por dificuldade (combinado com o usuário). */
  cueByDifficulty: { easy: 'always', medium: 'when_teacher_in_view', hard: 'never' } satisfies Record<Difficulty, CuePolicy>,
  nicknameMaxLength: 20,
  roomCodeLength: 4,
  /** Quantas perguntas o professor cadastra (espelha o servidor). */
  maxQuestions: 10,
  questionTextMaxLength: 200,
  optionMaxLength: 80,
  /** Quanto tempo o resultado de uma resposta fica na tela. */
  feedbackMs: 2500,
  /** Duração do tremor de tela (régua) e do flash de susto. */
  shakeMs: 500,
  /** Quanto tempo a cara do susto fica na tela. */
  jumpscareMs: 1200,
  /** Intervalo de atualização das contagens regressivas. */
  tickMs: 250,
} as const;
