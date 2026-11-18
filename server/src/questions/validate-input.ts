import type { Ack } from '@game/shared';
import { config } from '../config.js';
import type { Question } from './question.js';

const INVALID = { ok: false, error: 'invalid_input' } as const;

/** Valida perguntas vindas do cliente (não confiáveis) e as converte para `Question`. */
export function validateQuestionInputs(raw: unknown): Ack<Question[]> {
  if (!Array.isArray(raw) || raw.length < config.minQuestions || raw.length > config.maxQuestions) return INVALID;

  const questions: Question[] = [];
  for (const [index, item] of (raw as unknown[]).entries()) {
    const question = parseOne(item, index);
    if (!question) return INVALID;
    questions.push(question);
  }
  return { ok: true, data: questions };
}

function parseOne(item: unknown, index: number): Question | null {
  if (typeof item !== 'object' || item === null) return null;
  const { text, options, correctIndex } = item as Record<string, unknown>;

  if (!isText(text, config.questionTextMaxLength)) return null;
  if (!Array.isArray(options) || options.length !== 3) return null;
  if (!options.every((o) => isText(o, config.optionMaxLength))) return null;
  if (new Set(options.map((o: string) => o.trim().toLowerCase())).size !== 3) return null;
  if (correctIndex !== 0 && correctIndex !== 1 && correctIndex !== 2) return null;

  return {
    id: `q-${index}`,
    text: text.trim(),
    options: options.map((o: string) => o.trim()) as Question['options'],
    removedOptions: [],
    correctIndex,
  };
}

function isText(value: unknown, maxLength: number): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength;
}
