/** Pergunta de exemplo. */
export interface SampleQuestion {
  text: string;
  options: [string, string, string];
  correctIndex: 0 | 1 | 2;
}

const q = (text: string, options: SampleQuestion['options'], correctIndex: SampleQuestion['correctIndex']): SampleQuestion => ({
  text,
  options,
  correctIndex,
});

/**
 * Banco de perguntas de inglês embutido (conteúdo de aula, não texto de interface).
 * Usado pelo botão "preencher exemplos" do professor e pelo modo solo.
 */
export const SAMPLE_QUESTIONS: readonly SampleQuestion[] = [
  q('She ___ to school every day.', ['goes', 'go', 'going'], 0),
  q('I ___ a book right now.', ['read', 'am reading', 'reads'], 1),
  q('They ___ football yesterday.', ['play', 'plays', 'played'], 2),
  q('He is ___ than his brother.', ['tall', 'taller', 'tallest'], 1),
  q('There ___ two cats in the garden.', ['is', 'are', 'am'], 1),
  q('I have ___ apple.', ['a', 'an', 'the'], 1),
  q('What time ___ the movie start?', ['do', 'does', 'are'], 1),
  q('We ___ pizza last night.', ['eat', 'eats', 'ate'], 2),
  q('She can ___ very well.', ['sings', 'sing', 'singing'], 1),
  q('My birthday is ___ May.', ['in', 'on', 'at'], 0),
  q('The book is ___ the table.', ['on', 'in', 'to'], 0),
  q('He ___ his homework yet.', ["doesn't finish", "hasn't finished", 'not finished'], 1),
  q('How ___ water do you drink?', ['many', 'much', 'few'], 1),
  q("I'm afraid ___ spiders.", ['of', 'from', 'with'], 0),
  q('If it rains, we ___ at home.', ['stay', 'will stay', 'stayed'], 1),
  q("This is the ___ movie I've ever seen.", ['good', 'better', 'best'], 2),
  q('She asked me where I ___.', ['live', 'lived', 'am living'], 1),
  q('They have lived here ___ 2010.', ['for', 'since', 'during'], 1),
  q('I look forward to ___ you.', ['see', 'seeing', 'saw'], 1),
  q("Which word means 'big'?", ['huge', 'tiny', 'small'], 0),
  q("The opposite of 'cold' is ___.", ['hot', 'cool', 'ice'], 0),
  q('Please ___ the door.', ['close', 'closing', 'closed'], 0),
  q('He ___ breakfast every morning.', ['have', 'has', 'having'], 1),
  q('I was ___ when the phone rang.', ['sleep', 'slept', 'sleeping'], 2),
];
