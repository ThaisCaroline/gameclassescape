# Lista de imagens e prompts para o Gemini

Lista das imagens do jogo, com um prompt para cada. O jogo **já funciona com figuras provisórias** feitas por código.

## O que funciona hoje (importante)
- **Só `teacher_face` está ligada ao jogo agora.** Se você gerar essa imagem e colocar do jeito certo (abaixo), ela já aparece no susto.
- **As outras peças ainda não estão ligadas.** A visão em primeira pessoa hoje é desenhada por código (caixas e polígonos). Para usar imagens, eu preciso fazer a integração depois que você tiver os arquivos, e os **tamanhos abaixo são sugestões** que podemos ajustar juntos. Por isso: **gere primeiro `teacher_face` e os 3 desenhos do professor** para testarmos o estilo antes de fazer o resto.
- Depois de gerar, me diga os nomes e tamanhos finais que você usou, que eu integro.

## Como colocar uma imagem no jogo
1. Salve o **PNG** em `client/public/assets/` com o nome exato da tabela.
2. Adicione a chave em `client/public/assets/available.json` (por exemplo `["teacher_face"]`).
3. Recarregue a página.

## Dicas para usar o Gemini com pixel art
- O Gemini **não faz pixel art em tamanho exato** nem **fundo transparente de verdade**. Faça assim:
  1. Gere a imagem **maior** (o padrão serve), pedindo **fundo de uma cor chapada** (verde `#00FF00` ou magenta `#FF00FF`, que não aparecem no desenho).
  2. Remova o fundo (remove.bg, Photoshop, GIMP ou o Aseprite com "selecionar por cor").
  3. Reduza para o tamanho da tabela com **nearest neighbor** (sem suavização), no Aseprite, Piskel, LibreSprite ou "Redimensionar > Vizinho mais próximo".
- **Consistência do personagem:** gere o professor uma vez, depois anexe essa imagem no Gemini e peça "**the same character**, now seen from behind" (e de novo para a pose da régua). Use sempre a mesma descrição de roupa.
- Peça **só uma peça por imagem** e **sem texto escrito** na imagem.
- Se o resultado vier "pixelado de mentira" (borrado), peça de novo com "**crisp hard pixel edges, no anti-aliasing, no gradients, flat color blocks**".

## Bloco de estilo (cole no FINAL de todo prompt)
> **STYLE:** pixel art, crisp hard pixel edges, no anti-aliasing, limited dark cold palette (16 to 24 colors: deep blues, purples, browns) with a single warm accent color, 1px dark outline, light coming from the top-left, spooky-but-cute school horror, mild and friendly, absolutely no gore, no blood, no text, single object centered, solid flat #00FF00 background.

## Personagem do professor (descrição fixa, use em todas as poses)
> **TEACHER:** a strict middle-aged school teacher, tall and thin, dark navy suit, white shirt, thin round glasses, short dark hair, holding a wooden ruler.

---

## Peças

### Prioridade 1: funciona hoje

| Arquivo | Chave | Tamanho | O que é |
|---|---|---|---|
| `teacher_face.png` | `teacher_face` | **128×128** | A cara do professor que "pula" na tela no susto (quando o aluno estoura o tempo ou é pego) |

**Prompt (`teacher_face`):**
```
Close-up face of a strict, angry school teacher, front view, filling the whole frame, shouting with wide eyes and an open mouth, thin round glasses, furrowed eyebrows, short dark hair, pale skin with harsh shadows, intense and scary but mild, no gore. [TEACHER] [STYLE]
```
Dicas: o rosto deve **encher o quadro** (ele aparece em tela cheia e muito ampliado). Quanto mais expressivo, melhor o susto. Gere uma versão quadrada.

### Prioridade 2: o professor (3 poses, mesmo personagem)

| Arquivo | Chave | Tamanho sugerido | O que é |
|---|---|---|---|
| `teacher_front.png` | `teacher_front` | 64×96 | De pé, **de frente** para a turma (olhando) |
| `teacher_back.png` | `teacher_back` | 64×96 | O mesmo, **de costas** (virado para o quadro) |
| `teacher_ruler.png` | `teacher_ruler` | 64×96 | O mesmo, **batendo a régua** (braço levantado) |

**Prompts:**
- `teacher_front`:
```
Full body of a school teacher standing, front view, arms at his sides, looking straight ahead with a stern expression, holding a wooden ruler in one hand. [TEACHER] [STYLE]
```
- `teacher_back`: anexe a imagem do `teacher_front` e peça:
```
The same character, same clothes and colors, now seen entirely from behind (back view), standing still. Keep the exact same style, proportions and palette. [STYLE]
```
- `teacher_ruler`: anexe a imagem do `teacher_front` e peça:
```
The same character, same clothes and colors, front view, with his right arm raised high about to slam the wooden ruler down, angry expression. Keep the exact same style, proportions and palette. [STYLE]
```

### Prioridade 3: alunos (tons claros e neutros)
O jogo pinta cada aluno de uma cor (tint), então desenhe **em cinza claro e neutro**, para a cor pegar bem.

| Arquivo | Chave | Tamanho sugerido | O que é |
|---|---|---|---|
| `student_back.png` | `student_back` | 48×64 | Aluno sentado, **visto de costas** (é o que se vê olhando para o quadro) |
| `student_front.png` | `student_front` | 48×64 | O mesmo, **visto de frente** (quando você olha para trás) |
| `student_side.png` | `student_side` | 48×64 | O mesmo, **visto de lado** (o jogo espelha para os dois lados) |

**Prompt (`student_back`):**
```
A schoolchild sitting at a school desk seen entirely from behind, head and shoulders and backpack hanging on the chair, wearing plain light grey clothes (neutral so it can be color-tinted), short messy hair. [STYLE]
```
Para as outras duas vistas, anexe a primeira e peça: `The same character and style, now seen from the front, sitting` / `...now seen from the side, sitting`.

### Prioridade 4: a sala

| Arquivo | Chave | Tamanho sugerido | O que é |
|---|---|---|---|
| `desk_front.png` | `desk_front` | 64×48 | Carteira escolar vista **de frente** (pelo lado do quadro) |
| `desk_back.png` | `desk_back` | 64×48 | A mesma, vista **por trás** |
| `desk_side.png` | `desk_side` | 64×48 | A mesma, vista **de lado** |
| `board.png` | `board` | 256×80 | Quadro-negro (ou verde) com giz, na parede da frente |
| `door.png` | `door` | 80×112 | Porta de sala de aula, a saída |
| `floor.png` | `floor` | 64×64 | Piso, **emenda** nas bordas (mosaico) |
| `wall.png` | `wall` | 128×128 | Parede de sala de aula, **emenda** nas bordas |
| `my_desk.png` | `my_desk` | 320×48 | A **carteira do jogador**, vista de cima e bem de perto, na parte de baixo da tela |

**Prompts:**
- `desk_front`:
```
An empty old wooden school desk with an attached chair, seen from the front, slightly from above, no student. [STYLE]
```
(para `desk_back` e `desk_side`: anexe a primeira e peça "the same desk, now seen from behind" / "from the side")
- `board`:
```
A classroom chalkboard in a worn wooden frame, dark green, with faint chalk scribbles and a small chalk tray at the bottom, flat front view. [STYLE]
```
- `door`:
```
An old wooden classroom door, dark brown, with a small window, slightly ajar with a sliver of dim light, flat front view. [STYLE]
```
- `floor` (**tile**):
```
Seamless tileable pixel art floor tile, top-down, worn wooden classroom floor, dark brown planks. [STYLE] (fill the entire image, no background color needed)
```
- `wall` (**tile**):
```
Seamless tileable pixel art classroom wall texture, muted dark blue-purple paint with subtle cracks and a wooden baseboard at the bottom. [STYLE] (fill the entire image)
```
- `my_desk`:
```
The top of a school desk seen from the player's point of view (first person), very close, wide and flat, worn wood with carved initials and an old pencil, dark corners. [STYLE]
```

### Prioridade 5: ícone e abertura (para o app)
Hoje o jogo usa ícones provisórios gerados por código.

| Arquivo | Tamanho | O que é |
|---|---|---|
| `icon-512.png` (+ derivar o 192) | 512×512 | Ícone do app (celular) |
| `logo.png` | 600×200 | Nome do jogo para a tela inicial |

**Prompt (ícone):**
```
App icon for a mobile game called "Classroom Escape": a creepy cute silhouette of a classroom door slightly open with a warm yellow light, a small kid silhouette running toward it, dark blue background, pixel art, bold and readable at small sizes, no text.
```
(O logo com texto o Gemini costuma errar as letras. Se quiser, gere só o fundo e eu escrevo o nome por código, ou monte o texto no Aseprite.)

---

## Antes de publicar
- Confira os **termos de uso comercial** da ferramenta de IA usada (Gemini, Meta AI, Pixel Lab etc.) e a política de uso de imagens geradas.
- **Guarde a origem de cada arquivo** (ferramenta, data, prompt). A Play Store pode pedir declaração de **conteúdo gerado por IA**.
- Mantenha o tom: terror **leve**, sem sangue nem violência, pensando na classificação etária.
