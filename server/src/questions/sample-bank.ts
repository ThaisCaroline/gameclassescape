import { SAMPLE_QUESTIONS } from '@game/shared';
import { config } from '../config.js';
import type { Question } from './question.js';

/** Sorteia perguntas do banco embutido (outras a cada partida), no mesmo formato das cadastradas pelo professor. */
export function buildSampleQuestions(count: number = config.maxQuestions): Question[] {
  const pool = [...SAMPLE_QUESTIONS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }

  return pool.slice(0, count).map((sample, index) => ({
    id: `q-${index}`,
    text: sample.text,
    options: [...sample.options],
    removedOptions: [],
    correctIndex: sample.correctIndex,
  }));
}
