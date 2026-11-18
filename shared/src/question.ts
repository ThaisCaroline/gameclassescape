/** Versão da pergunta que pode ir ao cliente: sem a resposta certa. */
export interface QuestionPublic {
  id: string;
  text: string;
  /** Sempre 3 alternativas. */
  options: [string, string, string];
  /** Índices das alternativas eliminadas pelo sussurro do fantasma. */
  removedOptions: number[];
}
