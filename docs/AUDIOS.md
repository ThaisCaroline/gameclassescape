# Lista de áudios para buscar

Lista para você procurar em bibliotecas públicas. O jogo **já funciona com sons provisórios** gerados por código; cada arquivo que você colocar **substitui o provisório sem mexer em código**.

## Como colocar um som no jogo
1. Salve o **MP3** em `client/public/assets/audio/` com o **nome exato** da tabela.
2. Abra `client/public/assets/available.json` e adicione a chave `sfx_<nome>` (por exemplo `["sfx_ruler"]`; se já houver chaves de arte, é uma lista só: `["teacher_face", "sfx_ruler"]`).
3. Recarregue a página. Sons que não estão na lista continuam provisórios.

## Formato que o jogo espera
- **MP3**, mono ou estéreo, 44,1 kHz, de 96 a 128 kbps (são curtos, o arquivo fica pequeno).
- **Volume parecido entre os sons**: o jogo aplica um volume geral e o botão de mudo, mas não nivela um som contra o outro. Normalize para uns −16 LUFS (ou deixe o pico perto de −3 dB) e ajuste o susto e a régua à parte (podem ser mais altos, **mas toca em celular de criança, então sem exagero**).
- **Sem silêncio no começo** do arquivo (o som tem que sair na hora) e **sem estalo** no final.
- O `ambience` precisa **emendar sem estalo** quando repete em loop.

## Os 8 sons que o jogo já usa

| # | Arquivo | Chave | Quando toca | Como deve soar | Duração | Para quem |
|---|---|---|---|---|---|---|
| 1 | `footstep.mp3` | `sfx_footstep` | Alguém muda de carteira | Passo abafado, de sapato de criança em piso de sala. Um passo ou dois, curto | ~0,2 a 0,4 s | Todos. O professor **de costas** ouve abafado (o jogo aplica o filtro, não precisa de arquivo separado) |
| 2 | `chalk.mp3` | `sfx_chalk` | O professor vira para o quadro | Giz arranhando o quadro, áspero, sem ser doloroso | ~1,5 s | Todos |
| 3 | `ruler.mp3` | `sfx_ruler` | O professor pega um aluno | Batida de régua de madeira na mesa, **alta e seca**, com um pouco de eco de sala | ~0,5 s | Todos (a tela também treme) |
| 4 | `jumpscare.mp3` | `sfx_jumpscare` | O aluno estoura o tempo **ou é pego** (junto com a cara do professor na tela) | Susto: grito ou ruído agudo e alto, abrupto, que corta rápido. Terror leve, sem gore | ~1,5 s | Só o aluno que se assustou |
| 5 | `correct.mp3` | `sfx_correct` | Resposta certa | Sino suave ou "ding" curto, agradável | ~0,5 s | Só o aluno |
| 6 | `wrong.mp3` | `sfx_wrong` | Resposta errada | Zumbido grave e curto, de "erro". **Sem susto** (errar não assusta) | ~0,4 s | Só o aluno |
| 7 | `whisper.mp3` | `sfx_whisper` | Um fantasma sussurra uma dica | Sussurro ou ar, meio sinistro, sem palavras claras | ~1 s | Só o aluno que recebe a dica |
| 8 | `ambience.mp3` | `sfx_ambience` | Durante toda a rodada, em loop | Zumbido grave de sala de aula vazia à noite, com um leve rangido ou lâmpada. **Tem que emendar sem estalo** | ~6 a 20 s | Todos |

## Termos de busca (em inglês, funcionam melhor)
- **footstep:** `footstep wooden floor single`, `child footsteps classroom`, `sneaker step hard floor`
- **chalk:** `chalk on blackboard`, `chalk scratch`
- **ruler:** `ruler slap desk`, `wooden ruler hit table`, `whip crack short` (para a batida seca)
- **jumpscare:** `jump scare scream short`, `horror sting`, `scary stinger` (procure versões **curtas** e sem violência explícita)
- **correct:** `soft bell ding`, `correct answer chime`, `success notification`
- **wrong:** `low buzz error`, `wrong answer buzzer short`
- **whisper:** `whisper ghost`, `creepy whisper air`
- **ambience:** `empty classroom ambience`, `dark room drone loop`, `fluorescent light hum loop`

## Onde buscar (conferindo a licença)
- **Freesound** (freesound.org): enorme, mas cada som tem uma licença própria. Prefira **CC0** (sem restrição). **CC-BY** exige dar crédito. **Evite CC-BY-NC** (não permite uso comercial, e o app vai para a Play Store).
- **Pixabay Sound Effects** (pixabay.com/sound-effects): licença própria que permite uso comercial sem crédito, mas **confira os termos atuais** antes de usar.
- **OpenGameArt** (opengameart.org): vários CC0 e CC-BY.
- **Kenney** (kenney.nl): pacotes de sons CC0, mas mais "de jogo" que de terror.
- **IA de efeitos sonoros** (por exemplo ElevenLabs Sound Effects): bom para o susto, o sussurro e o ambiente. Confira o termo de **uso comercial** do plano que você usar.

## Guarde a origem de cada som
Para cada arquivo, anote: **nome, link de origem, autor e licença**. A Play Store e a política de privacidade podem exigir isso. Um modelo de tabela:

| Arquivo | Link | Autor | Licença (CC0 / CC-BY / outra) | Precisa de crédito? |
|---|---|---|---|---|
| footstep.mp3 | | | | |
| chalk.mp3 | | | | |
| ruler.mp3 | | | | |
| jumpscare.mp3 | | | | |
| correct.mp3 | | | | |
| wrong.mp3 | | | | |
| whisper.mp3 | | | | |
| ambience.mp3 | | | | |

## Sons extras (opcionais, **ainda não existem no jogo**)
Só vale se você quiser; cada um precisaria de uma pequena mudança de código e da sua decisão (eu não adicionei nada).
- **Porta abrindo / escape:** quando o aluno sai pela porta (rangido de porta + passos). Hoje a saída não tem som.
- **Fim da pausa:** um "tic" discreto quando o aluno pode pular de novo (depois dos 15 s de descanso).
- **Fim da aula:** um sino de escola (alunos escapando ou tempo acabando). Hoje o fim não tem som.
- **Voz do professor:** uma frase curta tipo "Quem está se mexendo?" quando ele vira para a turma.
