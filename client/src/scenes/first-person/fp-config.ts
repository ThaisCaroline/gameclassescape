/**
 * Parâmetros da cena em primeira pessoa (figuras provisórias). Unidades: o mundo é medido em CARTEIRAS
 * (x = coluna, y = fileira; a fileira 0 é a da frente, junto ao quadro) e as alturas em carteiras também.
 */
export const FP = {
  /** Tamanho lógico do canvas (a tela amplia mantendo a proporção). */
  width: 800,
  height: 500,

  /** Distância focal (em pixels): maior = mais "zoom". */
  focal: 300,
  /** Quanto à frente do olho a profundidade começa a contar (para as carteiras ao lado aparecerem). */
  near: 0.75,
  /** Profundidade mínima: o que está mais perto que isso é cortado. */
  minDepth: 0.2,
  /** Altura do olho e posição do horizonte (fração da altura da tela). */
  eye: 0.85,
  horizon: 0.44,

  /** Folga da sala em volta das carteiras, e altura do teto. */
  margin: { left: 0.9, right: 0.9, front: 1.6, back: 1.3 },
  ceiling: 2.6,

  desk: { width: 0.8, depth: 0.55, height: 0.5 },
  /** O aluno senta um pouco atrás do centro da carteira (de frente para o quadro). */
  sitOffset: 0.3,
  /** O professor fica no corredor da frente, no meio. */
  teacherFront: 0.75,
  /** Lado mínimo da área de toque de um aluno, em pixels da tela do aparelho (um dedo mede uns 40 a 48). */
  touchTargetPx: 44,
  /** Visão do professor (em pé, mais alta) e o quanto a tela escurece quando ele está de costas, olhando o quadro. */
  teacherView: { eye: 2.3, horizon: 0.26, back: 0.8, focal: 250, boardDarkness: 0.55 },

  /** Giro da câmera por toque (graus) e suavidade do movimento (maior = mais rápido). */
  turnStep: Math.PI / 2,
  smoothing: 11,

  colors: {
    floor: 0x2b211c,
    floorLine: 0x1d1511,
    wallFront: 0x1c1a2b,
    wallBack: 0x161424,
    wallSide: 0x201e31,
    board: 0x1b4332,
    boardFrame: 0x6f4e37,
    door: 0x4a2c2a,
    deskTop: 0x8b5a2b,
    deskSideNS: 0x5c3a1a,
    deskSideEW: 0x4a2f16,
    myDesk: 0x6b4423,
    suit: 0x1d3557,
    suitDark: 0x14253d,
    skin: 0xf1c27d,
    hair: 0x222222,
    near: 0x2e8b57,
    far: 0xff9f43,
    moving: 0xff6b6b,
  },
  studentTints: [0xff6b6b, 0x4dabf7, 0x69db7c, 0xffd43b, 0xda77f2, 0xff922b, 0x38d9a9, 0xf783ac],
} as const;
