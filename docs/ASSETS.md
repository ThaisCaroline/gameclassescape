# Guia de arte (pixel art, vista 3/4)

O jogo já roda com figuras provisórias geradas por código. Cada peça abaixo, quando você colocar o arquivo, **substitui o provisório sem mexer em código**.

## Como colocar uma peça no jogo
1. Salve o PNG em `client/public/assets/` com o nome exato da tabela.
2. Adicione a chave dela em `client/public/assets/available.json`, por exemplo: `["desk", "student"]`.
3. Recarregue a página. Peças que não estão na lista continuam provisórias.

## Regras de estilo (valem para TUDO, para o jogo parecer de uma peça só)
- **Pixel art**, vista **3/4** (de cima, levemente de frente), fundo **transparente** (exceto `floor`).
- **Tamanho exato** da tabela, em pixels (1x). O jogo amplia sem suavizar. Se a IA gerar maior, reduza com **nearest neighbor** (sem suavização), por exemplo no Aseprite, Piskel ou LibreSprite.
- **Paleta curta** (uns 16 a 24 cores), escura e fria (azul, roxo, marrom), com um único tom quente de destaque. Contorno escuro de 1 px.
- **Luz vinda de cima à esquerda**, a mesma em todas as peças.
- Terror **leve**: sombrio, nunca gore. Importante para a classificação etária da Play Store.

## Como a sala é montada (para você imaginar o desenho)
**ATENÇÃO: a vista da arte vai mudar.** A vista de cima que existe hoje é só um andaime para testar as regras. A decisão com o usuário é **primeira pessoa, com câmera livre para os 4 lados** (o jogador vê a sala pelos olhos do personagem sentado na própria carteira). Isso significa que as peças abaixo **vão precisar ser redesenhadas em perspectiva** (carteiras e alunos vistos de frente, de costas e de lado, e em tamanhos diferentes para perto, médio e longe). **Não gere arte definitiva ainda**: espere a gente fechar o desenho da primeira pessoa.

A sala é uma **sala de aula padrão**: grade de 5×5 carteiras de frente para o quadro; o professor fica na frente, junto ao quadro; a porta fica na frente, ao lado do quadro, ao lado da carteira do canto direito.

## Peças

| Arquivo | Chave | Tamanho | O que é |
|---|---|---|---|
| `floor.png` | floor | 64×64 | Piso de sala de aula, repetido em mosaico. Precisa **emendar** nas bordas. Madeira ou linóleo antigo. |
| `desk.png` | desk | 48×40 | Carteira escolar vista de cima/3-4, sem aluno. |
| `student.png` | student | 24×32 | Aluno sentado, de frente. **Em tons neutros/claros**: o jogo pinta cada aluno de uma cor (tint) enquanto for provisório. |
| `teacher_front.png` | teacher_front | 32×48 | Professor de pé, **de frente** (olhando para os alunos). |
| `teacher_back.png` | teacher_back | 32×48 | O mesmo professor, **de costas** (virado para o quadro). |
| `teacher_ruler.png` | teacher_ruler | 32×48 | O mesmo professor **batendo a régua** (braço levantado). |
| `board.png` | board | 128×40 | Quadro-negro/verde com giz, na parede. |
| `door.png` | door | 40×56 | Porta da sala (a saída). |
| `teacher_face.png` | teacher_face | 128×128 | **Cara do professor para o susto**: rosto bravo, grande, ocupando o quadro todo, fundo transparente, o mesmo professor das outras poses. Aparece em tela cheia (ampliada sem suavizar) quando o aluno estoura o tempo ou é pego. |

O mesmo personagem precisa ficar **igual** nas 3 poses do professor (mesma roupa, mesmas cores).

## Prompts sugeridos
Escreva em inglês (as ferramentas respondem melhor). Cole junto o bloco de estilo:

> **Estilo:** pixel art, 3/4 top-down view, limited dark cold palette (16-24 colors), 1px dark outline, light from top-left, transparent background, spooky-but-cute classroom, no gore.

- **Piso:** `Seamless tileable 64x64 pixel art floor tile, worn wooden classroom floor, dark brown. [estilo]`
- **Carteira:** `48x40 pixel art school desk with attached chair, empty, seen from 3/4 top-down. [estilo]`
- **Aluno:** `24x32 pixel art child student sitting at a desk, front view, light neutral grey clothes so it can be color-tinted. [estilo]`
- **Professor:** `32x48 pixel art strict teacher, standing, front view, dark suit, glasses, holding a wooden ruler. [estilo]` Depois peça **a mesma personagem** de costas e batendo a régua (no Pixel Lab, use a opção de personagem com várias direções/poses para manter a consistência).
- **Quadro:** `128x40 pixel art classroom chalkboard with faint chalk scribbles. [estilo]`
- **Porta:** `40x56 pixel art old wooden classroom door, slightly ajar, dark. [estilo]`

## Dica de fluxo
1. Gere primeiro **professor** e **aluno** no Pixel Lab (são o que mais precisa de consistência).
2. Gere piso, carteira, quadro e porta no Gemini ou Meta AI, **no mesmo estilo**, e reduza para o tamanho certo.
3. Coloque duas ou três peças e veja no jogo antes de fazer o resto. Se o estilo destoar, ajuste o prompt cedo.

## Sons
O jogo já tem sons provisórios gerados por código (sintetizados). Os reais entram do mesmo jeito que a arte:
1. Salve o **MP3** em `client/public/assets/audio/` com o nome da tabela.
2. Adicione `sfx_<nome>` em `client/public/assets/available.json` (junto com as chaves da arte), por exemplo: `["desk", "sfx_ruler"]`.

| Arquivo | Chave | Quando toca | Como deve soar |
|---|---|---|---|
| `footstep.mp3` | sfx_footstep | alguém muda de carteira | passo abafado, curto (~0,2 s) |
| `chalk.mp3` | sfx_chalk | professor vira para o quadro | giz arranhando, áspero (~1,5 s) |
| `ruler.mp3` | sfx_ruler | professor pega um aluno (todos ouvem) | batida de régua, **alta e seca** (~0,5 s) |
| `jumpscare.mp3` | sfx_jumpscare | aluno estoura o tempo ou é pego (só ele ouve; sincronizado com a cara do susto) | susto: grito/ruído agudo e alto (~1,5 s) |
| `correct.mp3` | sfx_correct | resposta certa | sino suave, curto |
| `wrong.mp3` | sfx_wrong | resposta errada | zumbido grave curto, sem susto |
| `whisper.mp3` | sfx_whisper | fantasma sussurra (só o aluno alvo ouve) | sussurro/ar, ~1 s |
| `ambience.mp3` | sfx_ambience | durante toda a rodada, em loop | zumbido grave de sala vazia (~6 s) que **emenda sem estalo** no loop |

Dicas: normalize o volume (o jogo já aplica um volume geral e o botão de mudo); a batida de régua e o jumpscare são os únicos que podem ser bem altos, e mesmo assim cuidado, porque tocam no celular de crianças. Gere em IA de efeitos sonoros ou use bancos livres, **conferindo a licença**.

## O que ainda não está na lista (próximas etapas)
- **Animações em quadros** (andar, pulo, batida de régua com vários quadros). Hoje o pulo, o balanço e a batida são feitos por código. Quando houver spritesheets (uma tira horizontal de quadros do mesmo tamanho), me envie o tamanho do quadro e a ordem, e eu integro.
- **Jumpscare visual**: 1 a 3 imagens em tela cheia (vertical, 9:16, ex.: 540×960). Hoje o susto é um flash vermelho com vibração; a imagem substitui o flash.

## Antes de publicar
Confira os termos de **uso comercial** de cada ferramenta de IA usada, e guarde a origem de cada arquivo. A Play Store pode pedir declaração de conteúdo gerado por IA.
