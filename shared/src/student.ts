export type StudentStatus = 'playing' | 'ghost';

export interface StudentPublic {
  id: string;
  nickname: string;
  /** Carteira atual ('' enquanto o aluno ainda não escolheu a dele na sala de espera). */
  deskId: string;
  /** Carteira escolhida na largada, para onde volta ao ser pego. */
  startDeskId: string;
  status: StudentStatus;
  /** Timestamp (ms) até quando está travado por estouro de tempo; null se livre. */
  lockedUntil: number | null;
  /** Se está se movendo agora; o professor só pega quem estiver. */
  moving: boolean;
}
