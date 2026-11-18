import en from './en.json';

/** Chaves válidas de texto. Adicionar um idioma = novo JSON com as mesmas chaves. */
export type TextKey = keyof typeof en;

const dictionary: Record<TextKey, string> = en;

/** Texto traduzido; `{nome}` é substituído pelo valor em `params`. */
export function t(key: TextKey, params: Record<string, string | number> = {}): string {
  let text = dictionary[key];
  for (const [name, value] of Object.entries(params)) {
    text = text.replaceAll(`{${name}}`, String(value));
  }
  return text;
}
