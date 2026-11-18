/**
 * Todas as peças de arte do jogo. Tamanhos são em pixels no tamanho original (1x); o jogo amplia sem suavizar.
 * Detalhes de estilo e prompts em docs/ASSETS.md. Arquivos em client/public/assets/.
 */
export interface ArtSpec {
  key: string;
  file: string;
  width: number;
  height: number;
}

export const ART: readonly ArtSpec[] = [
  { key: 'floor', file: 'floor.png', width: 64, height: 64 },
  { key: 'desk', file: 'desk.png', width: 48, height: 40 },
  { key: 'student', file: 'student.png', width: 24, height: 32 },
  { key: 'teacher_front', file: 'teacher_front.png', width: 32, height: 48 },
  { key: 'teacher_back', file: 'teacher_back.png', width: 32, height: 48 },
  { key: 'teacher_ruler', file: 'teacher_ruler.png', width: 32, height: 48 },
  { key: 'board', file: 'board.png', width: 128, height: 40 },
  { key: 'door', file: 'door.png', width: 40, height: 56 },
];
