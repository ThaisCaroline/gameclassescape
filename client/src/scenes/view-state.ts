import type { RoomPublic } from '@game/shared';

/** O que a tela (HTML) informa à cena a cada mudança. A cena só desenha; as regras ficam no servidor. */
export interface ViewState {
  room: RoomPublic;
  /** Hora do servidor (ms). */
  now: () => number;
  /** Quem é o jogador local (null = professor). */
  meId: string | null;
  /** O jogador local é um fantasma (enxerga melhor no escuro). */
  ghostView: boolean;
  /** Carteiras em que o aluno pode tocar para pular agora. */
  enabledDesks: ReadonlySet<string>;
  /** O professor pode pegar alunos agora (olhando para a turma, rodada em andamento). */
  canCatch: boolean;
}

export interface SceneCallbacks {
  onDeskClick?: (deskId: string) => void;
  onStudentClick?: (studentId: string) => void;
}
