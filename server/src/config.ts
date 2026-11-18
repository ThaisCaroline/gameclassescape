import path from 'node:path';

const isProduction = process.env['NODE_ENV'] === 'production';

/** Parâmetros configuráveis do servidor. Nenhum número solto no código. */
export const config = {
  /** A hospedagem define PORT; em desenvolvimento usa 3000. */
  port: Number(process.env['PORT'] ?? 3000),
  /** Pasta do front compilado (client/dist). Em desenvolvimento o front roda no Vite e esta pasta nem existe. */
  staticDir: process.env['STATIC_DIR'] ?? path.resolve(process.cwd(), 'client/dist'),
  /**
   * Origem liberada para o socket (CORS). Em produção o front e o servidor ficam no mesmo endereço, então
   * não precisa (vazio = só mesma origem). Defina CORS_ORIGIN se o app rodar em outra origem (ex.: Capacitor).
   */
  corsOrigin: process.env['CORS_ORIGIN'] ?? (isProduction ? '' : '*'),
  /** Teto de salas simultâneas, para o servidor público não ser inundado. */
  maxRooms: 50,
  /** Tamanho máximo de uma mensagem do cliente (10 perguntas cabem com folga). */
  maxMessageBytes: 100_000,
  /** Turma de até 15: cada um escolhe a sua carteira (de 25), e as 5 da zona da porta ficam proibidas na escolha. */
  maxStudents: 15,
  roomCodeLength: 4,
  nicknameMaxLength: 20,
  /** Quantas perguntas o professor cadastra (as carteiras repartem em rodízio). */
  minQuestions: 1,
  maxQuestions: 10,
  questionTextMaxLength: 200,
  optionMaxLength: 80,
  /**
   * Sala de aula padrão: grade de carteiras de frente para o quadro. A fileira 0 é a da frente e a carteira da porta
   * fica no canto da frente, à direita (junto ao quadro). Sempre a grade completa, mesmo com poucos alunos.
   */
  grid: { cols: 5, rows: 5 },
  /** Duração da aula (cronômetro da rodada). */
  classDurationMs: Number(process.env['CLASS_DURATION_MS'] ?? 10 * 60 * 1000),
  /** Duração da aula no modo solo (mais curta: é uma partida rápida). */
  soloClassDurationMs: Number(process.env['SOLO_DURATION_MS'] ?? 5 * 60 * 1000),
  /** Tempo para responder pulando 1 carteira. */
  answerTimeMs: Number(process.env['ANSWER_TIME_MS'] ?? 30_000),
  /** Tempo para responder pulando 2 carteiras: é o custo de ir mais rápido. */
  answerTimeFarMs: Number(process.env['ANSWER_TIME_FAR_MS'] ?? 20_000),
  /** Trava do aluno após estourar o tempo (com jumpscare). */
  timeoutLockMs: Number(process.env['TIMEOUT_LOCK_MS'] ?? 8_000),
  /** Trava do aluno na própria carteira após uma resposta errada (sem susto; é mais curta que a do estouro de tempo). */
  wrongLockMs: Number(process.env['WRONG_LOCK_MS'] ?? 5_000),
  /** Pausa obrigatória numa carteira depois de acertar (não vale para o pulo que sai pela porta). */
  restAfterJumpMs: Number(process.env['REST_AFTER_JUMP_MS'] ?? 15_000),
  /** Espera entre dois sussurros do mesmo fantasma. */
  whisperCooldownMs: 20_000,
  /** Máximo de alternativas que os sussurros eliminam por pergunta (com 3 alternativas, sobram a certa e 1 errada). */
  maxRemovedOptions: 1,
} as const;
