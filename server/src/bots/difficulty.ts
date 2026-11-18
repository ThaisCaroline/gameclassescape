import type { Difficulty } from '@game/shared';

/** Intervalo [mín, máx] em milissegundos. */
export type Range = readonly [number, number];

export interface BotProfile {
  /** Quantos colegas-robôs. */
  botCount: number;
  /** Professor-robô: quanto tempo fica de costas / olhando, e o quão rápido e certeiro pega. */
  teacher: { boardMs: Range; lookMs: Range; reactionMs: number; catchChance: number };
  /** Aluno-robô: ritmo, tempo para responder, acerto, imprudência e ajuda como fantasma. */
  student: { idleMs: Range; thinkMs: Range; accuracy: number; recklessChance: number; whisperChance: number };
}

/**
 * Os níveis são só combinações destes números. Ajustar a dificuldade = mexer aqui.
 *
 * `reactionMs` é o tempo que o jogador tem para terminar de ler e responder depois que o professor olha para a
 * turma, antes de poder ser pego. **Tem de ser MENOR que o mínimo de `lookMs`**: o professor só pega enquanto está
 * olhando, então se ele olhar por menos tempo que a tolerância, nunca consegue pegar ninguém (já foi um defeito).
 */
export const PROFILES: Record<Difficulty, BotProfile> = {
  easy: {
    botCount: 5,
    teacher: { boardMs: [6500, 10000], lookMs: [6500, 9000], reactionMs: 3500, catchChance: 0.85 },
    student: { idleMs: [2500, 6000], thinkMs: [4000, 9000], accuracy: 0.6, recklessChance: 0.1, whisperChance: 0.04 },
  },
  medium: {
    botCount: 7,
    teacher: { boardMs: [4500, 7500], lookMs: [6000, 8500], reactionMs: 3000, catchChance: 0.95 },
    student: { idleMs: [2000, 5000], thinkMs: [3000, 7000], accuracy: 0.75, recklessChance: 0.08, whisperChance: 0.02 },
  },
  hard: {
    botCount: 9,
    teacher: { boardMs: [4000, 6500], lookMs: [5000, 7500], reactionMs: 2500, catchChance: 0.95 },
    student: { idleMs: [1500, 3500], thinkMs: [2000, 5000], accuracy: 0.9, recklessChance: 0.05, whisperChance: 0 },
  },
};

export const between = ([min, max]: Range): number => min + Math.random() * (max - min);

/** Id fixo do professor-robô (não é um socket). */
export const BOT_TEACHER_ID = 'bot-teacher';

export const botStudentId = (index: number) => `bot-s-${index}`;
export const isBot = (id: string) => id.startsWith('bot-');

const NAMES = ['Mia', 'Leo', 'Zoe', 'Max', 'Ivy', 'Sam', 'Eli', 'Ava', 'Noah'];
export const botName = (index: number) => `${NAMES[index % NAMES.length]} (bot)`;
