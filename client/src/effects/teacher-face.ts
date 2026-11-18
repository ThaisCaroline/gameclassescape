const FACE_KEY = 'teacher_face';
const FACE_FILE = 'assets/teacher_face.png';
const SIZE = 64;

let loaded: string | null = null;
let placeholder: string | null = null;

/** Cara provisória do professor em pixel art (64x64), desenhada por código. Vira a arte de verdade quando o arquivo existir. */
function placeholderFace(): string {
  if (placeholder) return placeholder;

  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const rect = (color: string, x: number, y: number, w: number, h: number) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };

  rect('#f1c27d', 14, 10, 36, 44); // rosto
  rect('#222222', 12, 6, 40, 10); // cabelo
  rect('#222222', 12, 10, 4, 16);
  rect('#222222', 48, 10, 4, 16);
  rect('#ffffff', 18, 27, 11, 8); // olhos
  rect('#ffffff', 35, 27, 11, 8);
  rect('#000000', 22, 29, 4, 4); // pupilas
  rect('#000000', 38, 29, 4, 4);
  rect('#000000', 17, 26, 13, 1); // óculos
  rect('#000000', 17, 35, 13, 1);
  rect('#000000', 34, 26, 13, 1);
  rect('#000000', 34, 35, 13, 1);
  rect('#000000', 17, 26, 1, 10);
  rect('#000000', 29, 26, 1, 10);
  rect('#000000', 34, 26, 1, 10);
  rect('#000000', 46, 26, 1, 10);
  rect('#000000', 30, 30, 4, 1);
  rect('#8b1a1a', 18, 21, 5, 3); // sobrancelhas bravas
  rect('#8b1a1a', 23, 23, 5, 3);
  rect('#8b1a1a', 36, 23, 5, 3);
  rect('#8b1a1a', 41, 21, 5, 3);
  rect('#d9a566', 30, 36, 4, 6); // nariz
  rect('#000000', 22, 44, 20, 8); // boca aberta
  rect('#ffffff', 23, 44, 18, 3);

  placeholder = canvas.toDataURL('image/png');
  return placeholder;
}

/** A cara que aparece no susto: o arquivo real (se listado em assets/available.json) ou a provisória. */
export function teacherFaceSource(): string {
  return loaded ?? placeholderFace();
}

/** Baixa a arte de verdade, se existir, para o susto não atrasar. Chamar na inicialização. */
export async function preloadTeacherFace(): Promise<void> {
  try {
    const list = (await (await fetch('assets/available.json')).json()) as string[];
    if (!list.includes(FACE_KEY)) return;
    const response = await fetch(FACE_FILE);
    if (!response.ok) return;
    loaded = URL.createObjectURL(await response.blob());
  } catch {
    // sem a arte de verdade: fica a provisória
  }
}
