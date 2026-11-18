import type { Difficulty } from '@game/shared';

const deg = (degrees: number) => (degrees * Math.PI) / 180;

/** Parâmetros visuais da cena. Distâncias em pixels do mundo (a tela amplia). */
export const SCENE = {
  tile: 64,

  /**
   * A sala vista de cima (andaime para as regras; a vista final será em primeira pessoa): parede com o quadro e a
   * porta no topo, um corredor na frente com o professor, e a grade de carteiras abaixo.
   */
  wallHeight: 48,
  /** Corredor entre a parede e a fileira da frente, onde o professor fica. */
  frontAisle: 56,
  roomBottomGap: 8,

  /**
   * Escuridão da sala por dificuldade (0 = claro, 1 = breu) e de quanto em quanto tempo a luz pisca.
   * Fácil: sala clara e piscadas raras. Difícil: bem escura, piscando muito. O fantasma enxerga melhor.
   * Números provisórios, para ajustar jogando.
   */
  darkness: {
    easy: { ambient: 0.22, ghostAmbient: 0.14, flickerGapMs: [5000, 12000] },
    medium: { ambient: 0.38, ghostAmbient: 0.25, flickerGapMs: [3000, 8000] },
    hard: { ambient: 0.62, ghostAmbient: 0.42, flickerGapMs: [1500, 4500] },
  } satisfies Record<Difficulty, { ambient: number; ghostAmbient: number; flickerGapMs: readonly [number, number] }>,

  /** Luz do professor: virado para os alunos ilumina a sala toda; de costas, só a área do quadro. */
  studentsConeSpread: deg(300),
  boardCone: { spread: deg(90), radius: 130 },
  teacherGlow: 40,
  /** Luz pessoal do aluno ao redor da própria carteira. */
  personalGlow: 70,

  /** Piscada: por um instante a sala escurece e a luz do professor encolhe. */
  flicker: { minLenMs: 60, maxLenMs: 160, dim: 0.55, extraDark: 0.4 },
  /** "Apagão": de vez em quando a sala fica quase toda escura por um momento (susto de ambiente, sem efeito no jogo). */
  blackout: { minGapMs: 25000, maxGapMs: 50000, lenMs: 700, alpha: 0.85 },

  hopMs: 260,
  hopHeight: 14,
  slamMs: 350,
  beamMs: 700,

  colors: {
    here: 0xffffff,
    /** Carteira a 1 de distância (tempo cheio) e a 2 (menos tempo). */
    near: 0x2e8b57,
    far: 0xff9f43,
    moving: 0xff6b6b,
    you: 0xffd43b,
    beam: 0xff3b3b,
  },
  studentTints: [0xff6b6b, 0x4dabf7, 0x69db7c, 0xffd43b, 0xda77f2, 0xff922b, 0x38d9a9, 0xf783ac],
} as const;
