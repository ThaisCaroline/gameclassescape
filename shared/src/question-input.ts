/**
 * Pergunta cadastrada pelo professor (cliente -> servidor). Única via em que a resposta certa trafega,
 * e só nesse sentido. A pergunta não pertence a uma carteira: o servidor reparte pelas carteiras em rodízio.
 */
export interface QuestionInput {
  text: string;
  options: [string, string, string];
  correctIndex: 0 | 1 | 2;
}
