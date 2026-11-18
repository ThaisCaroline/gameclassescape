/** Carteira comum, ou a que fica junto à porta (chegar nela é escapar). */
export type DeskKind = 'normal' | 'door';

/**
 * Carteira da sala. A sala é uma grade de carteiras de frente para o quadro: a linha 0 é a da frente
 * (junto ao quadro e à porta) e a coluna 0 é a da esquerda.
 */
export interface DeskPublic {
  id: string;
  /** Posição na grade, da esquerda para a direita e de cima para baixo (usada para distribuir as perguntas). */
  index: number;
  row: number;
  col: number;
  kind: DeskKind;
}
