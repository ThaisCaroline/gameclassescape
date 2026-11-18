/** Pulo em andamento: o aluno recebeu a pergunta da carteira de destino e ainda não respondeu. */
export interface PendingJump {
  studentId: string;
  toDeskId: string;
  questionId: string;
  /** Timestamp (ms) em que o pulo começou (o professor-robô conta o tempo de reação a partir daqui). */
  startedAt: number;
  /** Timestamp (ms) em que o tempo de resposta estoura. */
  expiresAt: number;
  /** Alternativas eliminadas pelo sussurro, só para este aluno. */
  removedOptions: number[];
}
