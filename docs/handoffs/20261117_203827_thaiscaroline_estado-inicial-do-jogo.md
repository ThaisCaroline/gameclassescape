# Handoff: Estado do Classroom Escape até o primeiro teste

**Data:** 2026-11-17 (commit `8fd9f32`, 20:38:27, fuso -04)
**Atualizado em:** 2026-11-17 20:39 (commit `70a6d91`)
**Autor:** ThaisCaroline (autora dos dois commits)
**Branch:** main
**Commits:**
- `8fd9f32 Primeira versão do Classroom Escape`
- `70a6d91 Handoff: anotações do primeiro teste e decisão sobre a porta`

**Status:** em andamento
**Handoff anterior relacionado:** Nenhum

> Este documento é anterior à skill `gen-handoff`. Foi o `Handoff.txt` da raiz, movido para cá com `git mv` (o histórico do arquivo foi preservado). Data e autor vêm do git, e não do momento da migração.
> As seções 1 a 9 são um **resumo** feito só com fatos que já estavam no texto original. Nada foi reverificado no código nesta migração. O texto original está completo e sem alterações no **Anexo**, e vale como fonte em caso de dúvida.

## 1. Objetivo
Jogo de fuga em sala de aula, com terror leve, para praticar inglês, no estilo "Luz Verde, Luz Vermelha". O professor joga no notebook e vigia a turma. Os alunos jogam no celular e pulam de carteira em carteira, respondendo perguntas de múltipla escolha, até a carteira da porta. Quem escapa vira fantasma.
Este handoff registra o estado do projeto na primeira versão ("Classroom Escape") e as anotações do primeiro teste. O foco é o projeto inteiro: `shared`, `server` e `client`, com os três personagens (teacher, student, ghost).

## 2. Decisões
**Regras de jogo e o que o jogador vê** (as vigentes, segundo o texto; todas decididas junto com o usuário):
- Sala em grade 5x5, com 25 carteiras de frente para o quadro. A carteira da porta é a `d0-4`, e chegar nela é escapar.
- No máximo 15 alunos por sala.
- Pulo só em linha reta, de 1 ou 2 carteiras, sem diagonal. Pulo de 1 dá 30 s para responder, e pulo de 2 dá 20 s. A porta só aceita pulo de 1. Uma pessoa por carteira, e fantasmas não ocupam carteira.
- Perguntas com 3 alternativas. O professor cadastra no máximo 10 perguntas, e elas não pertencem a uma carteira.
- Errar a resposta: fica preso 5 s na própria carteira, sem susto. Estourar o tempo: susto e trava de 8 s.
- Depois de acertar um pulo, o aluno fica parado 15 s. Esse valor foi mantido por decisão do usuário, até testar com pessoas.
- Quem é pego vai para a carteira livre mais distante da porta.
- A carteira é escolhida na sala de espera (quem chega primeiro escolhe primeiro), com uma zona proibida de 5 carteiras perto da porta.
- A dificuldade é escolhida por quem abre a sala. Ela controla o escuro, as piscadas e o aviso do professor (fácil: sempre; médio: só quando a câmera olha para ele; difícil: nunca).
- Susto com a cara do professor em pixel art, ao estourar o tempo e ao ser pego. Errar não dá susto.
- Vitória do aluno: sair pela porta. Vitória do professor: reter pelo menos metade da turma até o cronômetro zerar.
- Visão em primeira pessoa, com câmera livre para os 4 lados, para o aluno, o fantasma e o professor humano. A vista de cima é só andaime e mapa de escolha de carteira.
- Duração da aula: o texto traz valores diferentes (10 min por padrão no multijogador; no solo aparecem 4 e 5 min). Ver o Anexo.

**Técnicas e de estrutura:**
- TypeScript no cliente, no servidor e no `shared`, com npm workspaces. Cliente em Phaser + Vite, servidor em Node + Socket.io, estado em memória.
- O servidor valida tudo e guarda as respostas certas. Cronômetros são timestamps absolutos decididos pelo servidor.
- Os robôs do modo solo rodam no servidor e usam as mesmas funções de regra dos humanos, sem regra duplicada.
- Distribuição, em ordem: link web/PWA; Google Play via Capacitor (opcional); App Store adiada.
- Hospedagem escolhida: Railway, em modo Node nativo. Sem Docker, por decisão do usuário.
- Descartado: o Dockerfile (removido); duas perguntas por pulo (rejeitado pelo usuário); os layouts em U e em fileira (substituídos pela grade 5x5).

## 3. O que foi feito
1. Estrutura de pastas, `CLAUDE.md`, workspaces, tsconfigs, tipos em `shared/` e mensagens de rede.
2. Servidor: salas, rede, regras de cada personagem, cronômetros, fim de rodada e desconexão.
3. Cliente: Vite, i18n, telas Enter e lobby, painel do professor, telas do aluno e do fantasma, tela do professor, efeitos de tela, Wake Lock e áudio.
4. Cena em Phaser, primeiro vista de cima e depois primeira pessoa, com arte provisória gerada por código.
5. Modo solo com robôs no servidor e 3 dificuldades.
6. PWA, build e preparação da publicação (`docs/DEPLOY.md`).
7. Ajustes após o 1º teste do usuário (6 pontos), regras para alongar a partida e medição do equilíbrio dos níveis com um aluno simulado.
8. Limpeza de código morto, autorizada pelo usuário.
9. Registro das anotações do usuário depois do primeiro teste (nada decidido nem implementado).

## 4. Estado atual
**Funciona:** as regras no servidor, o multijogador, o modo solo, as telas, o áudio provisório, o PWA e o build local, segundo os testes descritos no texto (por socket e em navegador simulado).
**Incompleto:** arte e sons reais (hoje provisórios), animações em quadros, publicação, política de privacidade e faixa etária (Play Store). Pendências do texto: o apelido do professor não é guardado, não há reconexão, o professor não escolhe a duração da aula, não há rodízio de professor nem nova rodada na mesma sala, e o `npm audit` tem 2 vulnerabilidades no servidor de desenvolvimento.
**Quebrado / em dúvida:**
- Bug da porta no primeiro teste: o usuário não conseguiu clicar "na porta" para sair. A porta desenhada na parede não responde ao toque; só a carteira da porta responde. O usuário decidiu deixar como está por enquanto.
- A "cabeça flutuando na tela" relatada pelo usuário não foi reproduzida (falta um print).
- O texto registra que o teste antigo `grid-rules` pode estar desatualizado frente às regras novas.
**Testado:** por socket e em navegador simulado (Edge via Playwright): regras no servidor, os três papéis, solo com robôs, PWA, build limpo, servidor servindo o front, geração dos sons.
**Não testado:** celular de verdade; som ouvido por pessoas; publicação no Railway; equilíbrio e se é divertido (com pessoas e com professor humano); necessidade do toque no "Enter" em navegador com bloqueio estrito de áudio.
**Desvios das regras do `CLAUDE.md`:**
- `teacher-scene.ts` tem ~167 linhas (limite de ~150).
- A cena do professor vista de cima não é mais usada, mas foi mantida no código de propósito.
- O aviso do professor por dificuldade é só apresentação: o servidor continua enviando `teacherFacing` a todos.

## 5. Próximos passos
1. **Próximo passo imediato:** jogar o solo de verdade e ajustar os níveis em `server/src/bots/difficulty.ts`.
2. Testar com pessoas e em celulares reais antes de mexer de novo no tempo de pausa (`restAfterJumpMs`; o texto estima que 30 s dê ~2,5-3 min de partida no simulador).
3. Publicar seguindo `docs/DEPLOY.md` (ação do usuário) e testar em celulares reais.
4. Gerar a arte e os sons reais (`docs/ASSETS.md`) e integrá-los.
5. Discutir, um de cada vez, as anotações do primeiro teste (seção 6).
6. Do lado do código: reconexão, jogar de novo / rodízio de professor e, opcionalmente, Capacitor / Play Store.

## 6. Perguntas em aberto
- [ ] Bug da porta: (A) a porta da parede vira o alvo do toque, com brilho e tempo, ou (B) manter a carteira da porta como alvo, mas desenhada como porta? Retomar mais tarde (usuário decide).
- [ ] Regra nova: dar um motivo para o professor virar para o quadro (o quadro mostra o progresso da aula; quando termina, o professor vence se tiver pelo menos X alunos). Em aberto: o progresso só avança com ele de costas? quanto tempo? quanto vale X? como convive com o cronômetro e com a vitória por "metade da turma"?
- [ ] Pesquisa: qual pista visual ou sonora é mais justa e assustadora para o professor identificar um aluno tentando trocar de cadeira (hoje: anel vermelho no chão, só enquanto ele olha)?
- [ ] Faixa etária (menores de 13 anos) e política de privacidade para a Play Store; checar se a conta exige teste fechado.
- [ ] Pedir ao usuário um print da "cabeça flutuando".
- [ ] "Bastante coisa para melhorar", segundo o usuário: ainda por listar, um de cada vez.

## 7. Trabalho paralelo e conflitos
**Arquivos e módulos que este handoff cobre:** o projeto inteiro da primeira versão (`shared`, `server`, `client`, `docs`).
**Áreas em que outros devs podem estar mexendo:** o texto diz que outro desenvolvedor também vai trabalhar no projeto. Não indica em qual área.
**Pontos de integração ou risco de conflito:** tipos e mensagens de rede em `shared/`, o `config` do servidor e do cliente, `client/src/i18n/en.json` e `client/public/assets/available.json` (arte e áudio compartilham o mesmo arquivo).

## 8. Artefatos relevantes
| Artefato | Caminho | Por que é relevante |
|---|---|---|
| Regras do projeto | `CLAUDE.md` | Regras de trabalho e de código |
| Guia de arte e sons | `docs/ASSETS.md` | Peças, tamanhos, estilo e tabela dos 8 sons |
| Guia de publicação | `docs/DEPLOY.md` | Passos para publicar no Railway |
| Perfis dos robôs | `server/src/bots/difficulty.ts` | Números dos níveis de dificuldade |
| Alcance do pulo | `shared/src/reach.ts` | Regra de alcance usada por servidor e cliente |

## 9. Instruções para quem continuar
- **Ler primeiro:** `CLAUDE.md` e o bloco "REGRAS ATUAIS DA SALA EM GRADE" do Anexo. Blocos marcados como HISTÓRICO ou SUPERSEDIDO não valem.
- **Armadilha:** tratar um bloco histórico como regra vigente, ou implementar algo das "ANOTAÇÕES DO USUÁRIO DEPOIS DO PRIMEIRO TESTE", que não foi decidido nem implementado.
- **Confirmação necessária:** qualquer código e qualquer mudança de regra do jogo ou do que o jogador vê exigem OK explícito do usuário (regras do `CLAUDE.md`).

## Anexo: texto original (sem alterações)

Conteúdo integral do `Handoff.txt` como estava no commit `70a6d91`.

```text
Handoff: Game de sala de aula (inglês)

Conceito: jogo de fuga em sala de aula com tema de terror leve, para praticar inglês. Parecido com “Luz Verde, Luz Vermelha”. Professor e alunos jogam na mesma sala, uma rodada por vez.

Papéis

Professor: joga no notebook. Antes da rodada, cadastra 1 pergunta por carteira (múltipla escolha, 4 opções + resposta certa). Durante a rodada, vigia a sala com um cone de visão, pode virar e, se pegar um aluno se movendo enquanto olha, clica nele e bate a régua.
Aluno: joga no celular. Começa sentado numa carteira e tenta chegar à carteira da porta, pulando de carteira em carteira (grid fixo, sem movimento livre).
Fantasma: aluno que escapou. Continua na sala, translúcido, e o professor não consegue pegá-lo.

Regras fechadas

Para pular de carteira, o aluno responde a pergunta da carteira de destino, em múltipla escolha.
30s para responder. Estourou o tempo: jumpscare + trava de 8s (parâmetro configurável), fica na carteira atual.
Errou a resposta: bloqueia só aquela carteira por alguns segundos, sem jumpscare.
Pego pelo professor: batida de régua (som alto e tela treme para todos) + volta para a carteira inicial.
Só dá para pegar quem estiver se movendo enquanto o professor está olhando. Quando ele vira para o quadro, os alunos têm uma janela para andar.
Susurro do fantasma: elimina uma alternativa errada da pergunta aberta de um aluno. Cooldown de 20s. O professor não vê.
Vitória do aluno: individual, ao sair pela porta.
Vitória do professor: reter pelo menos metade da turma até o cronômetro da aula zerar.
Dá para fazer rodízio de professor entre rodadas (ideia, não obrigatória).

Clima de terror: sala escura, luz piscando, só o cone do professor iluminado, passos, giz arranhando, jumpscare sonoro.

Escala: uma sala, convite por link/código, até ~20 pessoas, sem economia, sem inventário, sem moderação em escala.

Arquitetura

Front web (Phaser ou PixiJS), um único código com telas diferentes por papel (professor/aluno).
Servidor Node + WebSocket (Socket.io ou Colyseus), estado em memória, sem banco no início.
O servidor valida tudo e guarda as respostas certas (nunca no celular do aluno), além de controlar os cronômetros (30s, trava, aula).
Hospedagem: Render, Railway ou Fly.io (plano grátis ou poucos dólares). Planos grátis podem “dormir”, então abrir o link antes da aula.

Exigências

Idioma: inglês/português à escolha do usuário. Versão 1 toda em inglês, mas com os textos em arquivo de traduções (chaves tipo ui.enter_room) para adicionar português depois.
Plataforma: navegador e também app. Caminho sugerido: web + Capacitor (Android/iOS) ou PWA.
Celular (aluno): vertical, carteiras como botões grandes, vibração no jumpscare (Android), Wake Lock para a tela não apagar, tela inicial “Enter” para liberar o áudio.
Notebook (professor): tela grande, teclado/mouse, painel lateral para cadastrar perguntas.

Estimativa solo: protótipo jogável em ~1 a 2 semanas.

Preferências de trabalho: respostas diretas e concisas, em português; código em blocos no chat, entregue de forma incremental com confirmação a cada passo; sem over-engineering e sem antecipar passos não pedidos.

REGRAS DE TRABALHO DEFINIDAS PELO USUÁRIO (prioridade máxima; também em CLAUDE.md):
1. NÃO CODAR ATÉ TER O OK DO USUÁRIO. Primeiro conversar e propor; só escrever/alterar código depois de um OK explícito para aquele passo.
2. NÃO PRESSUPOR. Perguntar, sugerir opções (com recomendação) e decidir junto. Não escolher regras de jogo, formatos, limites ou números sozinho.
3. Pedido ambíguo: dizer como entendi e confirmar antes de agir. Mudança que afeta regra do jogo ou o que o jogador vê: sempre discutir antes.

Decisões de desenvolvimento e publicação

Editor: VS Code (projeto web: front Phaser/PixiJS + servidor Node no mesmo workspace). Android Studio só entra no final, para gerar o build Android via Capacitor.
Local do projeto: C:\Users\17862\OneDrive - BEMOL S A\Documentos\GitHub\GameClassRoom

Distribuição, em ordem:
1. Link web / PWA: front e servidor publicados juntos, aluno entra por link ou código da sala. Cobre Android, iOS e notebook sem loja.
2. Google Play: mesmo código empacotado com Capacitor (AAB). Conta de desenvolvedor já existe (CuidadoPet). Opcional, não muda a arquitetura.
3. App Store (iOS): adiado. Exige conta Apple (US$ 99/ano) e Mac.

Servidor público: plano pago que não "dorme", com HTTPS/WSS.

Pontos de atenção para a Play Store:
- Declarar o terror leve com jumpscare no questionário de classificação etária.
- Política de privacidade obrigatória (apelido do aluno e código de sala).
- Decidir antes se o público é menor de 13 anos (regras de Families, mais rígidas).
- Verificar no console se a conta exige teste fechado (12 testadores por 14 dias) antes da produção.

Decisões de código (definidas)
- TypeScript no cliente, servidor e shared (npm workspaces: shared, server, client).
- Cliente: Phaser + Vite. Servidor: Node + Socket.io.
- Separação por responsabilidade, um módulo por personagem (teacher, student, ghost) no servidor e no cliente. Regras completas em CLAUDE.md.

Status
- Estrutura de pastas, CLAUDE.md, package.json, tsconfigs e .gitignore criados.
- npm install rodado. Há 2 vulnerabilidades (1 moderada, 1 alta) ainda não investigadas (npm audit).
- Modelo de dados pronto e com typecheck ok:
  - shared/src: desk, question, student, round, room (tipos *Public, que podem ir ao cliente).
  - server/src/questions/question.ts: Question (com correctIndex e deskId), só no servidor.
- Convenções do modelo: cronômetros como timestamps absolutos (ms), servidor decide; a pergunta de uma carteira só vai ao cliente quando o aluno tenta pular para ela; "moving" indica se o aluno pode ser pego.
- Mensagens de rede prontas em shared/src (typecheck ok):
  - Cliente -> servidor (client-events.ts): room:create, room:join, teacher:set_questions, teacher:start_round, teacher:turn, teacher:catch, student:request_jump, student:answer, ghost:whisper.
  - Servidor -> cliente (server-events.ts): room:state (snapshot completo), question:show, question:update (só ao aluno alvo), answer:result, ghost:whisper_cooldown (só ao fantasma), fx:jumpscare, fx:ruler, room:closed. answer:result tem outcome correct, wrong, timeout ou caught.
  - ack.ts: Ack<T> e ErrorCode. question-input.ts: pergunta cadastrada pelo professor (única via em que a resposta certa trafega, só cliente -> servidor).
- Decisões: "moving" é derivado no servidor (pulo em andamento); o fantasma escolhe o aluno e o servidor sorteia a alternativa errada a eliminar; o professor não é avisado do sussurro.
- Servidor: salas prontas (server/src/rooms: criar, entrar, snapshot público, grid) e network (room-handlers, teacher-handlers, broadcast). Testado via socket: room:create, room:join.
- teacher:set_questions pronto (characters/teacher/set-questions.ts + questions/validate-input.ts). Só o professor, só no lobby; substitui a lista inteira; valida carteira existente e única, texto, 4 alternativas distintas e correctIndex 0-3. Exigir 1 pergunta por carteira fica para o start_round.
- [SUPERSEDIDO: hoje é UMA fileira de 12 cadeiras, ver "SALA DE UMA FILEIRA" acima; mantido só como histórico] Layout da sala: U de fileira dupla, 6 colunas x 5 linhas, 24 carteiras. Vão do meio sem carteira (onde fica o professor). Largada: 4 carteiras no topo do braço esquerdo. Porta: topo do braço direito (d0-5). Alunos entram nas carteiras de largada em rodízio (várias pessoas por carteira).
- Pulo: até 2 passos retos entre carteiras, SEM diagonal (desk-reach.ts). Com isso o caminho mínimo largada -> porta é 5 pulos, e não dá para atravessar o vão. Com diagonal eram só 3 pulos.
- teacher:start_round pronto (characters/teacher/start-round.ts). Só o professor, só no lobby; exige >= 1 aluno e 1 pergunta por carteira (erros no_students, questions_incomplete). Muda para running, define endsAt e liga o cronômetro da aula (timers/round-timer.ts). Ao zerar: endRound (rooms/end-round.ts) -> phase ended; professor vence se reteve >= metade da turma (quem não virou fantasma; empate favorece o professor). Duração padrão 10 min (config.classDurationMs, env CLASS_DURATION_MS). Ninguém entra depois que a rodada começa. Testado via socket.
- student:request_jump pronto (characters/student/request-jump.ts). Valida: aluno jogando, rodada running, sem pulo aberto, sem trava, carteira ao alcance e não bloqueada. Abre o pulo (moving=true, PendingJump na sala) e envia question:show só ao aluno (sem resposta certa). Timer de 30s por pulo (config.answerTimeMs, env ANSWER_TIME_MS). Estouro (jump-timeout.ts): jumpscare só para o aluno, answer:result timeout, trava de 8s (config.timeoutLockMs), fica na carteira atual.
- student:answer pronto (answer-jump.ts). Certa: muda de carteira; se for a porta, escapa e vira fantasma (continua na carteira da porta). Errada: o aluno fica preso na própria carteira por 5s (config.wrongLockMs), sem jumpscare; a carteira de destino NÃO é bloqueada (regra atual; ver bloco da regra de errar). Resposta com alternativa removida pelo sussurro, pergunta errada ou depois do tempo é ignorada.
- teacher:turn e teacher:catch prontos (turn.ts, catch-student.ts). Só vale pegar com o professor olhando para os alunos e o alvo com pulo aberto (moving). Pego: cancela o pulo, volta para a carteira inicial, fx:ruler para todos da sala, answer:result caught para o aluno. Pegar fora dessas condições é ignorado, sem penalidade.
- ghost:whisper pronto (characters/ghost/whisper.ts). Só fantasma, cooldown 20s por fantasma, alvo precisa ter pulo aberto, máximo de 2 alternativas eliminadas por pergunta (nunca sobra só a certa). Remoção guardada no pulo do aluno (não na pergunta). question:update só ao aluno alvo; ghost:whisper_cooldown só ao fantasma; o professor não recebe nada.
- Fim da rodada: por tempo (professor vence se reteve >= metade da turma) ou antecipado quando o professor já não consegue reter metade (endRoundIfDecided, vence students). endRound limpa todos os timers e pulos abertos.
- Desconexão: aluno que sai é removido da sala (libera timers; pode encerrar antes). Professor que sai encerra a sala: room:closed para todos e a sala é apagada da memória. Não há reconexão.
- Testado via socket (end-to-end): resposta errada/certa, bloqueio de carteira, pegar, fuga, sussurro (cooldown, não-fantasma, alternativa removida), fim antecipado, desconexão.

Cliente (em andamento)
- Decisão: cliente final direto (Phaser), sem versão de teste separada. Telas com formulário/texto (Enter, lobby, painel de perguntas do professor) em HTML (client/src/screens); Phaser só para a sala (carteiras, cone, efeitos), a ser feito.
- Pronto: Vite (client/index.html, vite.config.ts, host na rede local), i18n (en.json + t() com chaves tipadas; todo ErrorCode tem texto error.<code>), conexão socket tipada (network/socket.ts; URL padrão = mesmo host na porta 3000, ou VITE_SERVER_URL), room-api (createRoom/joinRoom), room-store (estado da sala; null se sala fechada ou conexão cai), tela Enter (apelido + criar/entrar) e lobby (código e lista de alunos ao vivo). Build do Vite e typecheck ok; carga dos módulos verificada em dev. A interface em si ainda não foi vista num navegador.
- Como testar: npm run dev:server e npm run dev:client; abrir http://localhost:5173 em duas abas (uma cria a sala, outra entra com o código). No celular: http://IP-DO-NOTEBOOK:5173 na mesma rede.
- Painel do professor pronto (client/src/characters/teacher: desk-picker, question-editor, question-drafts, sample-questions, teacher-setup). No lobby: mapa em U com um botão por carteira (marca verde = pergunta completa), formulário (texto, 4 alternativas, qual é a certa), contador "X of 24 desks ready", botão "Fill with sample questions" (24 perguntas de exemplo em inglês) e "Start round" (envia set_questions e start_round; mostra o erro traduzido se falhar). Rascunhos ficam só em memória (perdem-se se recarregar a página). Ao iniciar, o painel some e o lobby mostra "The round has started."
- Testado em navegador real (Edge via Playwright, fora do projeto): criar sala, validações, aluno entra (código em minúsculas), lista ao vivo nos dois lados, rascunho mantido ao trocar de carteira, iniciar com exemplos, aluno vê a rodada iniciada, professor sai -> aluno volta ao Enter com aviso. Sem erros no console.
- DOM helper em client/src/dom/create-element.ts (h()).
- Tela do aluno pronta (client/src/characters/student + ghost). Ao começar a rodada o aluno sai do lobby e vai para o jogo: mapa em U com carteiras como botões grandes (só as ao alcance ficam ativas; a atual marcada "You are here"; bloqueadas mostram os segundos), pergunta com 4 alternativas e barra/contagem de tempo, resultado (certa/errada/tempo/pego), trava "frozen for Ns", relógio da aula, e tela final (escapou / professor ganhou / alunos ganharam). Depois de escapar vira fantasma (tela translúcida): lista quem está respondendo e botão "Whisper to X" com cooldown. Alternativas eliminadas pelo sussurro aparecem riscadas e desabilitadas.
- Também feito: efeitos de tela (effects/screen-effects.ts: jumpscare = flash vermelho + vibração; régua = tela treme em todos), Wake Lock (device/wake-lock.ts), relógio do servidor (RoomPublic.serverTime + serverNow() no cliente corrige diferença de relógio nos timestamps), regra de alcance do pulo movida para shared (canReach, JUMP_RANGE) para servidor e cliente usarem a mesma, CSS global [hidden] (sem isso display:flex/grid anulava o atributo hidden).
- Testado em navegador real (Edge via Playwright, fora do projeto), 3 páginas: professor + 2 alunos. Passou: erro de resposta (carteira bloqueada, sem jumpscare), fuga em 6 pulos (caminho mínimo), vira fantasma, sussurro (1 alternativa riscada, nunca a certa, cooldown), estouro de tempo (jumpscare + "frozen" + tudo desabilitado), fim da aula com mensagens certas, telas escondidas de verdade. Sem erros no console.
- Tela do professor na rodada pronta (client/src/characters/teacher: teacher-screen, room-view, turn-controls). Mapa em U com os alunos nas carteiras; só enxerga quando olha para os alunos (de costas, mapa escurecido e sem alunos). Alunos "se movendo" ficam destacados e clicáveis para pegar (régua: tela treme em todos); fantasmas aparecem translúcidos e não são clicáveis. Botões "Look at the students"/"Turn to the board" e tecla Espaço para virar. Mostra relógio, quantos ainda estão na aula, quantos escaparam e quantos precisa reter. Fim: "You kept the class! You win." ou "Too many students escaped...". Lobby agora chama onRoundStarted para os dois papéis (professor e aluno trocam de tela sozinhos).
- Testado em navegador real (professor + 2 alunos): estatísticas, escurecer ao virar, pegar aluno (volta à largada, pergunta fecha), tremor em todos, Espaço, não ver nem pegar de costas, fantasma não clicável, fim da aula. Sem erros no console.
- VISUAL (decidido com o usuário): pixel art, vista 3/4. Ferramentas de arte do usuário: Gemini, Meta AI, Pixel Lab. Guia completo em docs/ASSETS.md (peças, tamanhos, regras de estilo, prompts).
- Cena Phaser pronta (client/src/scenes + art + characters/*/ *-sprite.ts). Substituiu os botões HTML do mapa, tanto no aluno quanto no professor. Mundo 384x384 (tile 64, uma fileira de parede no topo com quadro e porta), canvas ampliado sem suavizar. Sala escura (RenderTexture preta com buracos): cone do professor (virado para os alunos ~300°, de costas só a área do quadro), brilho pessoal do aluno, luz piscando, fantasma enxerga melhor. Professor no vão do U (de frente/de costas/batendo régua), alunos com hop entre carteiras, anel+balanço quando se movem, translúcidos se fantasma, nome em cima, cor por aluno. Carteiras com contorno (aqui / ao alcance pulsando / bloqueada). Aluno toca na carteira ao alcance para pular; professor clica no aluno em movimento para pegar. A tela (HTML) só informa o estado à cena (ViewState); a cena só desenha.
- ARTE ENTRA SEM CÓDIGO: art/manifest.ts lista as 8 peças (floor, desk, student, teacher_front/back/ruler, board, door). Arquivos em client/public/assets/ e a chave em client/public/assets/available.json; o que não estiver na lista usa o provisório gerado por código (art/placeholders.ts). Testado: uma carteira PNG real substituiu o provisório (arquivo de teste já removido; available.json está []).
- Ganchos de teste só em DEV: window.__game.{debug, clickDesk, clickStudent} (scenes/game-view.ts). Testado em navegador (professor + 2 alunos): luz/escuro, quem é visível, clicável, bloqueio, pegar, Espaço, fuga e fim, sem erros nem avisos no console.
- ÁUDIO pronto (client/src/audio): Web Audio direto (não o áudio do Phaser, que está desligado). Primeira tela agora é "Enter" (screens/splash-screen.ts): o toque libera o som (exigência dos navegadores, principalmente iOS). Sons provisórios gerados por código (audio/synth.ts); arquivos reais entram sem código: MP3 em client/public/assets/audio/ + chave sfx_<nome> em assets/available.json (mesmo available.json da arte). 8 sons: footstep, chalk, ruler, jumpscare, correct, wrong, whisper, ambience (tabela em docs/ASSETS.md). Gatilhos (audio/audio-events.ts): ambiente em loop durante a rodada (entra/sai suave), giz quando o professor vira para o quadro, passos quando alguém muda de carteira, régua (todos), jumpscare (só quem estourou o tempo), acerto/erro (só o aluno), sussurro (só o alvo). Botão fixo "Sound: on/off" (mudo lembrado no navegador).
- Testado em navegador (professor + 2 alunos): estado do áudio, os 8 sons gerados sem NaN/mudo e com loop sem estalo (analisados por script), todos os gatilhos e quem ouve o quê, mudo (ganho 0, persiste ao recarregar), ambiente para no fim, e um arquivo real substituindo o provisório. NÃO foi possível ouvir de fato (só verificado por código/estado). O Edge de teste já inicia o áudio liberado, então a necessidade do toque em "Enter" não foi comprovada num navegador com bloqueio estrito (Chrome/Safari reais bloqueiam).
- Falta: animações em quadros (spritesheets) quando a arte existir (hoje hop/balanço/batida são por código); jumpscare visual com imagem (hoje flash vermelho + vibração) (tela "Enter" para liberar áudio, passos, giz, jumpscare, régua); PWA/Capacitor; tela final do professor; jogar de novo.

AJUSTES APÓS O 1º TESTE DO USUÁRIO (6 pontos). Feito: (1) 3 alternativas em tudo (shared/question.ts, sample-questions, validação, UI do aluno e do professor, bots, sussurro elimina no máx. 1) e ritmo bem mais lento (bots/difficulty.ts: professor-robô fica de costas 10-16s fácil / 8-12s médio / 5-8s difícil; reactionMs = tolerância depois que ele olha: 7s / 5s / 3s; colegas-robôs mais lentos; aula solo 5 min). Medido por socket: respondendo em 2s ninguém é pego em nenhum nível; em 8s só o difícil pega. Provavelmente folgado demais no fácil/médio: avaliar jogando. (3) jogador local marcado: anel amarelo + seta pulando + "Nome (you)" + por cima na carteira; e faixa grande "THE TEACHER IS LOOKING! Stay still." (vermelha) / "His back is turned. Go!" (verde) na tela do aluno. (4a) professor cadastra no máximo 10 perguntas (mínimo 1; incompletas são ignoradas); pergunta NÃO pertence mais a uma carteira: as carteiras repartem em rodízio pela posição (rooms/desk-question.ts); solo sorteia 10 do banco de 24 a cada partida. QuestionInput/Question sem deskId. (5) luz: ambiente 0.93 -> 0.6, fantasma 0.4, brilho pessoal 70, piscada escurece mais mas curta (explicação ao usuário: o escuro é intencional, mas estava escuro demais para jogar).
=== PRIMEIRA PESSOA, PASSO 1 (FEITO, com figuras provisórias; usuário deu OK para este passo) ===
O ALUNO (e o fantasma) agora joga em PRIMEIRA PESSOA (client/src/scenes/first-person/): câmera sentada na própria carteira, perspectiva calculada à mão (camera.ts: projeção com corte no plano próximo; draw-room/draw-box/draw-desk/draw-people: piso, paredes, quadro, porta, carteiras e pessoas como caixas e círculos, tudo provisório), giro para os 4 lados com SETAS nas bordas (ícones SVG, screens/turn-arrow.ts) e setas do teclado, bússola ("Looking at the board"...), câmera desliza até a carteira nova ao pular, toque numa carteira pelo desenho exato (da mais perto para a mais longe; corrigido bug em que a caixa retangular fazia tocar na carteira errada), pergunta no CENTRO da tela cobrindo toda a visão (o jogador não vê o professor nem vira a cabeça enquanto responde), escuro por dificuldade e piscadas. O PROFESSOR (humano) continua na VISTA DE CIMA (não decidimos a primeira pessoa dele). Tela do aluno: painel lateral à direita com aviso do professor, mensagem, legenda 30s/20s e lista do fantasma.
NÃO feito neste passo (combinado ou ainda por decidir):
 - [FEITO depois, com OK do usuário] Regra "errar = fica preso 5 s na PRÓPRIA carteira, sem susto, e a carteira de destino NÃO bloqueia para os outros": server characters/student/answer-jump.ts (student.lockedUntil = agora + config.wrongLockMs, env WRONG_LOCK_MS, padrão 5000; antes era WRONG_BLOCK_MS/wrongBlockMs). Estourar o tempo continua com susto e trava de 8 s. Testado por socket e no navegador (mensagem "Wrong answer! You are stuck on your desk for a few seconds.", sem susto, nenhuma carteira tocável durante a trava, volta após ~5 s). SOBROU CÓDIGO MORTO: DeskPublic.blockedUntil nunca mais é preenchido, então o erro desk_blocked, o modo "blocked" nas cenas e a checagem de carteira bloqueada nos robôs/cliente não fazem mais nada; limpar quando o usuário autorizar.
 - Susto com a CARA DO PROFESSOR em pixel art (decidido: dispara ao estourar o tempo E ao ser pego; errar NÃO). Hoje o susto é o flash vermelho.
 - Aviso do professor por dificuldade (fácil sempre; médio só olhando para ele; difícil nenhum): hoje a faixa vermelha/verde aparece sempre.
 - Arte de verdade (perspectiva, alunos de frente/costas/lado, vários tamanhos).
 - Proporções: o enquadramento está tosco (carteiras muito grandes e altas, sala apertada); precisa ajustar a câmera junto com o usuário.
 - Em primeira pessoa o "CAUGHT!"/feixe do professor da vista de cima não existe; o aviso de ser pego é só a mensagem no painel.
 - A vista de cima continua existindo para o professor e para o mapa de escolher a carteira (HTML).

=== REGRAS ATUAIS DA SALA EM GRADE (decididas JUNTO com o usuário, uma pergunta por vez; SUBSTITUEM o formato em U descrito abaixo, que fica só como histórico) ===
Todas implementadas e testadas (regras por socket, navegador em celular deitado e notebook, robôs). Decisões:
- Sala de aula padrão: grade 5x5 = 25 carteiras de frente para o quadro; fileira 0 = frente; ids d<linha>-<coluna>. Carteira da porta = D = d0-4 (canto da frente, à direita, junto ao quadro); chegar nela é escapar. Servidor: rooms/desk-layout.ts (a grade já existe no lobby).
- Máximo de 15 alunos (config.maxStudents; era 14/20). Com 15 sobram 10 carteiras vazias na largada.
- Pulo só em LINHA RETA (mesma linha ou coluna), 1 ou 2 carteiras; diagonal não vale (shared/reach.ts). Pulo de 1 = 30s para responder; pulo de 2 = 20s (config answerTimeMs / answerTimeFarMs). Uma pessoa por carteira (pular por cima de ocupada é permitido no pulo de 2). Fantasmas não ocupam carteira.
- ESCOLHA DA CARTEIRA na sala de espera (evento student:pick_seat; rooms/pick-seat.ts): quem chega primeiro escolhe primeiro; escolheu, ficou (não troca); quem não escolhe até o professor iniciar recebe uma sorteada entre as livres permitidas. ZONA PROIBIDA para escolher (shared/seating.ts forbiddenSeatIds): D e as de onde se chega em D com 1 pulo = d0-4, d0-3, d0-2, d1-4, d2-4 (5 carteiras); depois de começar, podem ser usadas. Mapa 5x5 de escolha (client screens/seat-map.ts) na sala de espera do aluno (vem primeiro) e, no solo, na tela de explicação. No solo o humano escolhe antes e os robôs sorteiam o resto.
- Carteira de quem sai fica LIVRE para qualquer um. Quem é pego volta para a carteira que escolheu; se alguém a tomou, para a livre mais próxima (nunca a da porta).
- DIFICULDADE é escolhida por quem abre a sala (multiplayer: professor ao criar; solo: o jogador) e vale para todos; aparece na sala de espera (RoomPublic.difficulty). Ela controla o ESCURO da sala e a frequência das piscadas (scenes/scene-config.ts SCENE.darkness: fácil mais clara, difícil escura e piscando muito; números provisórios) e, QUANDO HOUVER primeira pessoa, o aviso do professor: fácil = indicador sempre na tela; médio = só quando olha para o professor; difícil = nenhum (só som e visão). Hoje o aviso (faixa vermelha/verde) continua visível em todos os níveis porque na vista de cima não existe "olhar para o professor".
- VISÃO: o usuário NÃO quer vista de cima; quer PRIMEIRA PESSOA (decidido), com CÂMERA LIVRE para os 4 lados (setas na tela), porque dá mais medo. A vista de cima atual é só andaime para testar as regras e depois vira o mapa de escolher carteira. Ordem combinada: 1) regras (FEITO, esta etapa); 2) primeira pessoa (A FAZER; exige decidir arte em perspectiva/sprites em vários tamanhos e direções, e como tocar numa carteira em cada direção).
- SUSTO (ideia do usuário, AINDA SEM DECISÃO): a cara do professor "pulando" na tela do aluno. Falta decidir em quais momentos dispara (estouro de tempo como hoje? ao ser pego?) e se é arte nova (cara do professor em tela cheia).
- Mudança de método (regra do usuário): "faz em sequência, não fica esperando por mim" valeu SÓ para a etapa das regras da grade. Fora disso continua valendo conversar e esperar o OK (ver REGRAS DE TRABALHO abaixo e em CLAUDE.md).
Corrigido nesta etapa também: ver (e) a (f) abaixo (professor-robô que nunca pegava; servidor que caía com pacote mal formado).

=== (HISTÓRICO, SUPERSEDIDO PELO BLOCO ACIMA) REGRAS NOVAS APÓS O 2º TESTE DO USUÁRIO (sala em U, uma pessoa por cadeira, custo do pulo de 2, clareza do professor): ===
(a) SALA EM U de UMA cadeira de espessura (o usuário queria isso; eu tinha entendido "fileira reta"): server/src/rooms/desk-layout.ts monta N cadeiras, braço = floor(N/4), fundo = N-2*braço (12 cadeiras = 3+6+3). Ordem (DeskPublic.index): desce pelo braço esquerdo, atravessa o fundo, sobe pelo direito; a ÚLTIMA fica junto à porta (topo do braço direito) e chegar nela é escapar. N = alunos + 6 livres, entre 12 e 20 (rooms/desk-layout.ts chairsFor); o U é montado QUANDO A RODADA COMEÇA (no lobby room.desks é []); config maxStudents agora 14 (antes 20). Professor na frente, logo abaixo do quadro, na abertura do U (client scenes/room-layout.ts).
(b) UMA PESSOA POR CADEIRA (ideia do usuário, que também justifica o pulo de 2): cada aluno larga sentado na própria cadeira (sorteada, nas primeiras do U) e não dá para pular para cadeira ocupada ou para onde outro já está indo (reserva): rooms/occupancy.ts isOccupied; erro novo desk_occupied. Fantasmas não ocupam cadeira (a da porta fica livre). Quem é pego volta à cadeira de origem; se alguém a tomou, para a livre mais próxima (nearestFreeDesk, nunca a da porta). Alcance por POSIÇÃO NO U (shared/reach.ts: jumpDistance/canReach por DeskPublic.index; JUMP_RANGE 2), não mais por grade. Consequência: como todos largam em cadeiras seguidas, quem está no meio da fila fica sem cadeira habilitada até os da frente andarem; a tela avisa "No free chair within reach. Wait for the students ahead of you to move."
(c) CUSTO DO PULO DE 2: pular 1 cadeira = tempo cheio (30s, ANSWER_TIME_MS); pular 2 = 15s (ANSWER_TIME_FAR_MS). RoomPublic.jumpTimes leva isso ao cliente; no jogo a cadeira ao alcance é verde (1, tempo cheio) ou laranja (2, metade) com os segundos escritos em cima, e uma legenda no painel.
(d) CLAREZA DO PROFESSOR (o usuário disse que não ficava claro o papel dele e que "me pegou e não teve nada"): painel lateral em tela cheia (client screens/game-frame.ts: sala à esquerda, painel à direita com aviso grande vermelho/verde de para onde o professor olha, mensagem, pergunta, legenda), um "!" vermelho em cima do professor quando olha para a turma, e ao pegar: feixe vermelho do professor até o aluno, o aluno pisca e sobe "CAUGHT!", o professor bate a régua (maior), tela treme, mensagem vermelha "THE TEACHER CAUGHT YOU! You go back to your seat." fx:ruler agora carrega {studentId}. EXPLICAÇÃO ANTES DE COMEÇAR: solo agora cria a sala no lobby e mostra "How to play" (screens/briefing-screen.ts, how-to-play.ts) com botão Start (evento solo:start); alunos no lobby de sala normal também leem a explicação. Texto da explicação em duas colunas em celular deitado.
(e) BUG DO PROFESSOR-ROBÔ CORRIGIDO: nos níveis fácil e médio ele NUNCA conseguia pegar ninguém (a tolerância reactionMs era maior que o tempo olhando lookMs, então a janela de captura nunca abria; só o difícil pegava). Agora reactionMs < mínimo de lookMs (fácil 5s/olha 6,5-9s; médio 4s/5,5-8s; difícil 3s/4,5-7s). Regra anotada em bots/difficulty.ts.
(f) ROBUSTEZ DO SERVIDOR (achada testando): um pacote com o callback na posição errada (ou sem callback) DERRUBAVA O SERVIDOR INTEIRO ("ack is not a function"). Corrigido em network/ack-guard.ts (normaliza ou descarta) + rede de segurança em main.ts (uncaughtException/unhandledRejection só logam) + falha ao escutar na porta agora ENCERRA o processo (antes de eu corrigir, a rede de segurança deixava um servidor zumbi vivo sem escutar). Testado com pacotes hostis. OBS. de teste: processos node/tsx de testes anteriores podem ficar segurando a porta 3000 e fazer testes rodarem contra código antigo; matar o dono da porta antes (aconteceu uma vez nesta sessão).
Testado agora: regras por socket (U, largada em cadeiras distintas, tempo 30s/15s, ocupação, reserva, retorno à cadeira livre mais próxima), navegador em celular 844x390 e notebook 1280x720 (explicação, geometria do U, painel, cores/tempos, professor-robô difícil pegando e a tela dizendo, fuga até a porta, aviso de girar, professor solo pegando robô, sem erros no console), pacotes hostis, e os cenários dos robôs. NÃO testado em celular de verdade. Os números de equilíbrio continuam palpites.

(HISTÓRICO, SUPERSEDIDO) SALA DE UMA FILEIRA + TELA CHEIA EM PAISAGEM (usuário aprovou "paisagem e 12 cadeiras"; a parte da FILEIRA RETA foi substituída pelo U acima, a tela cheia/paisagem continua valendo): (6) o professor agora fica NA FRENTE, logo abaixo do quadro (parede de cima), olhando para a fileira; (4b) uma fileira horizontal de 12 cadeiras (server config.layout.chairs, máx. 20): as 2 primeiras são a largada, a última é a porta; ids d0-0..d0-11; pulo de até 2 cadeiras (JUMP_RANGE 2) => 5 a 6 pulos até a porta; (2) tela cheia: as telas de jogo ocupam a janela (barra de info em cima, canvas no resto, pergunta/avisos por cima: screens/game-frame.ts), Fullscreen API ao tocar "Enter" SÓ em aparelho de toque (device/fullscreen.ts; no notebook use F11), trava de paisagem ao entrar na rodada (Android em tela cheia) e, em retrato, um aviso "Rotate your phone to play." cobre o jogo (iPhone não tem Fullscreen API nem trava: depende do aviso/PWA instalado). Mundo achatado 768x312 para as cadeiras ficarem grandes (70px num celular 844x390; antes 49px). Pergunta aparece numa faixa livre no meio da sala (3 alternativas lado a lado, >= 44px de altura), sem cobrir as cadeiras. Nomes só do jogador local, de quem se move ou em cadeiras com até 2 alunos (a largada fica cheia). Corrigido bug: a batida de régua fazia a tela sumir (transform no body quebra elementos fixos); o tremor agora é no .game-screen.
LUZ (usuário perguntou "a luz fica sempre desligada?"): agora a sala fica sempre legível (ambiente 0.38; medido: brilho médio 88/255 na cadeira mais longe do professor, antes ~5), o cone do professor realça a área vigiada, a luz PISCA (escurece e encolhe por ~0,1s a cada 3-8s) e há um "apagão" raro (a cada 25-50s, 0,7s, quase tudo escuro) só de clima, sem efeito no jogo. Tudo em scenes/scene-config.ts.
Testado: landscape.mjs em celular 844x390 e notebook 1280x720 (geometria, pergunta não cobre cadeiras, retrato mostra aviso, brilho, fuga até a porta, professor pega robô, tela sobrevive à tremida), painel de 10 perguntas, e os 4 cenários dos robôs na fileira nova. NÃO testado em celular de verdade (tela cheia, trava de orientação, toque, iPhone).

MODO SOLO (pronto): o jogador joga sozinho e os outros papéis são robôs. Pedido do usuário: aluno E professor; perguntas = banco embutido de inglês e 3 níveis (padrões que propus; o usuário não escolheu outros).
- Tela inicial ganhou "Play solo": seletor de dificuldade (Easy/Medium/Hard) e botões "Solo: escape as a student" / "Solo: catch as the teacher". A rodada já começa (sem lobby). No fim, botão "Back to menu" (recarrega a página; o servidor limpa a conexão antiga sozinho).
- Robôs rodam NO SERVIDOR e usam as mesmas funções de regra que os humanos (requestJump, answerJump, turn, catchStudent, whisper), então não há regra duplicada: server/src/bots (difficulty.ts com os perfis, path-finding.ts, bot-student.ts, bot-teacher.ts, bot-director.ts que "pensa" a cada 250 ms) e server/src/solo/create-solo-room.ts (monta a sala). Evento novo room:create_solo (shared/solo.ts: SoloRole, Difficulty). Banco de perguntas movido para shared/sample-questions.ts (usado pelo botão "preencher exemplos" e pelo solo).
- Professor-robô (você aluno): alterna costas/olhando em tempos sorteados; olhando, pega quem se move só depois do tempo de reação e com chance < 100%. Colegas-robôs: andam pelo caminho mais curto até a porta, preferem pular com o professor de costas (às vezes arriscam), respondem com taxa de acerto do nível; fantasmas-robôs podem sussurrar para você. Nível = combinação de números em bots/difficulty.ts (fácil: 5 robôs; médio: 7; difícil: 9). Aula solo dura 4 min (SOLO_DURATION_MS).
- Decisão de experiência: quando um ROBÔ é pego, a batida de régua (tela treme) toca no máximo 1 vez a cada 2,5 s; se for você, sempre. (Sem isso o difícil tremia a tela ~1x por segundo.)
- Sala solo fecha quando o humano sai (room.solo + room.cleanups param os robôs). Cada partida solo ocupa 1 das 50 vagas de sala.
- Testado: 4 partidas solo ao mesmo tempo por socket (aluno esperto escapa no fácil em ~18 s; aluno imprudente é pego no difícil; professor vigilante pega robôs; professor que nunca olha perde antes do tempo; sala fecha ao sair) e no navegador (interface, robôs visíveis na cena, pegar robôs, fim e voltar ao menu), mais regressão do multijogador e do áudio. NÃO foi avaliado se é DIVERTIDO/equilibrado: os números dos níveis são palpites e precisam de teste com gente jogando (como professor, quem alterna a cada 3 s pega quase tudo).
- Solo offline (sem servidor) NÃO existe: depende do servidor no ar. Fazer offline exigiria rodar as regras no navegador (refatoração maior), só vale se o app precisar.

PWA e PUBLICAÇÃO (pronto, testado localmente; ainda NÃO publicado)
- PWA: client/public/manifest.webmanifest + sw.js + ícones provisórios (client/public/icons, gerados por client/scripts/make-icons.mjs; trocar pelos definitivos) + registro em client/src/pwa.ts (só em produção). Service worker: rede primeiro; na instalação guarda a página e seus arquivos, então o app abre a tela inicial offline (jogar exige internet). Instalável (a checagem do Chrome só acusou "in-incognito", que é do contexto de teste).
- Servidor serve o front: server/src/http (static-files.ts: gzip, cache imutável para arquivos com hash, proteção contra ../, fallback de página única, /health). Em produção o socket usa o mesmo endereço (client/src/network/socket.ts), sem CORS (config.corsOrigin; defina CORS_ORIGIN só se o app rodar em outra origem, ex. Capacitor). Teto de 50 salas (erro server_busy), mensagens do cliente limitadas a 100 KB, SIGTERM fecha limpo.
- Build: npm run build (front em client/dist + servidor em UM arquivo dist/server/main.cjs via esbuild, sem node_modules) e npm start. package.json declara node >= 20. SEM DOCKER (decisão do usuário: não usar; o Dockerfile que eu havia criado sem perguntar foi removido). Guia em docs/DEPLOY.md.
- HOSPEDAGEM ESCOLHIDA: Railway, modo Node nativo (Build: "npm ci --include=dev && npm run build"; Start: "npm start"; Healthcheck: /health; 1 réplica; Generate Domain). O --include=dev é precaução caso a hospedagem rode o build com NODE_ENV=production (validado numa cópia limpa com NODE_ENV=production). Os nomes exatos dos menus do Railway não foram conferidos; o guia avisa. GitHub Pages não serve (não roda Node nem WebSocket). Alternativa sem hospedagem: rede local (npm start + IP do notebook; sem HTTPS não instala o app nem mantém a tela acesa).
- Testado: build limpo (npm ci + build numa cópia nova, também com NODE_ENV=production), servidor rodando só com main.cjs + front sem node_modules, HTTP (gzip 1,5 MB -> 366 KB, 404 em ../, 405 em POST, /health), navegador em produção (service worker ativo, manifesto e ícones ok, offline abre a tela inicial, partida real pelo mesmo endereço com toque no canvas, socket ws:// na mesma origem, ganchos de teste ausentes). NÃO testado: a publicação real no Railway.
- Para publicar o usuário precisa: colocar o projeto num repositório GitHub (a pasta ainda não é git; comandos no guia) e criar o projeto no Railway (ações dele). Uma única instância (estado em memória) e sem suspensão por inatividade.

SUSTO COM A CARA DO PROFESSOR (decidido com o usuário)
- A cara do professor (pixel art) pula e enche a tela do aluno: ao ESTOURAR O TEMPO (fx:jumpscare) e ao SER PEGO (answer:result caught; só o aluno pego vê). ERRAR a resposta NÃO dá susto (só fica preso 5 s). Um clarão vermelho único, sem luz piscando; vibração no Android.
- client/src/effects/teacher-face.ts: cara provisória desenhada por código (64x64) até existir assets/teacher_face.png (chave teacher_face em available.json). screen-effects.ts monta o overlay; CSS .jumpscare/.jumpscare-face em styles.css; duração config.jumpscareMs (1200).
- Testado no navegador (Edge/Playwright): errar = sem cara; estouro = cara visível, cobre a tela, só no aluno, some em ~1,2 s; pego = cara só no aluno pego, não no professor; sem erros no console. NÃO testado: celular real, som no momento do susto (pego só toca a régua), nem se assusta de verdade.

AVISO DO PROFESSOR POR DIFICULDADE (decidido com o usuário)
- O aviso grande "professor olhando / de costas" (.cue no painel lateral) depende da dificuldade da sala (config.cueByDifficulty em client/src/config.ts): fácil = sempre; médio = só quando a câmera do aluno está virada para a frente (professor à vista); difícil = nunca. A regra vale igual para fantasmas. O professor continua visível na cena em primeira pessoa quando se olha para a frente.
- Testado no navegador: fácil mostra de frente e de lado; médio mostra de frente e some ao virar; difícil nunca mostra; sem erros no console. É só apresentação: o servidor continua mandando teacherFacing a todos (quem mexer no cliente poderia ler); se virar problema, o servidor deve parar de enviar. Não testado em celular nem se o equilíbrio é bom.

LIMPEZA (código morto removido, autorizado pelo usuário)
- Removidos DeskPublic.blockedUntil, ErrorCode desk_blocked (+ texto en.json), o modo visual 'blocked' e a cor blocked nas cenas, e o parâmetro now de nextDeskTowardDoor. Nada disso era usado desde a regra de errar = ficar preso. Testes: ver resultado abaixo no histórico da sessão.

PRIMEIRA PESSOA DO PROFESSOR (decidido com o usuário)
- O professor humano (multijogador e solo) vê a sala em primeira pessoa, em pé na frente, no centro, com o olho MAIS ALTO que o do aluno (FP.teacherView em scenes/first-person/fp-config.ts, ajustado depois de comparar 6 enquadramentos em capturas: eye 2.3, horizon 0.26, focal 250, back 0.8, boardDarkness 0.55; "back" não pode passar de ~0.85 porque a parede da frente está a 1.6 e o plano próximo da câmera deixaria o quadro aparecer atrás dele; FpCamera agora tem eye/horizon próprios). Olhando a turma: vê carteiras e alunos e toca em quem se move para pegar (regra do servidor inalterada). De costas: vê só o quadro, escurecido, e nada de alunos/carteiras são desenhados.
- Arquivos novos: scenes/first-person/teacher-scene.ts (cena), teacher-view.ts (monta o Phaser; ganchos DEV __game com clickStudent), hit-test.ts (toque por polígono, agora compartilhado com a cena do aluno), student-tint.ts. teacher-screen.ts usa mountTeacherView. drawStudent devolve a área do tronco (para o toque).
- Passos ABAFADOS: se o professor está de costas, o som de passos toca com filtro passa-baixa 450 Hz e 60% do volume (audio/player.ts, parâmetro muffled; audio-events.ts). Olhando a turma, normal. Sons continuam provisórios; o usuário vai buscar sons melhores em bibliotecas públicas e pediu uma LISTA dos áudios necessários (a fazer).
- A cena do professor vista de cima (game-view.ts, room-scene.ts, characters/student/student-layer.ts etc.) NÃO é mais usada; ficou no código de propósito (o usuário não pediu para apagar).
- Testado no navegador: cena em primeira pessoa com olho mais alto; os dois alunos visíveis; clique REAL de mouse no aluno que se move pega (susto só no aluno); de costas ninguém é desenhado nem clicável; passos abafados registrados (footstep:muffled); solo como professor pega robôs com cliques reais; sem erros no console. Tela do professor conferida em captura de tela (visual provisório, carteiras da frente grandes). NÃO testado: celular real, equilíbrio, o som abafado ouvido por gente (só o registro do evento). teacher-scene.ts tem ~167 linhas (limite de 150 do projeto): dividir se crescer.

TOQUE NO CELULAR (professor)
- No celular deitado (844x390) a cena do professor ocupa só ~540x338 px e um aluno do fundo mede ~12x21 px (frente: 47x81). Para o dedo: FP.touchTargetPx (44) = lado mínimo da área de toque de cada aluno, na tela do aparelho (hitAt ganhou o parâmetro minSize; o desenho não muda). Só alunos PEGÁVEIS (se movendo, professor olhando) disputam o toque: um colega parado, perto ou na frente, não rouba o toque. A cena do aluno não mudou.
- Testado com celular simulado (Edge, toque de verdade): com 16 px de erro do dedo pega o aluno certo em todas as fileiras (antes só aguentava ~6 px). NÃO testado: celular físico, e dois alunos pegáveis muito juntos no fundo (o mais próximo do dedo ganha).

EQUILÍBRIO DOS NÍVEIS (rodada feita, números do professor-robô em server/src/bots/difficulty.ts)
- Meta combinada: o aluno (solo) escapar pela porta em ~75% (fácil), ~50% (médio), ~25% (difícil). Medido com um aluno simulado por socket (só pula com o professor de costas, acerta 85%, responde em 5-9 s, caminho mais curto até a porta), 30-44 partidas por nível.
- Antes: fácil 90%, médio 83%, difícil 40%. Agora: fácil 78% (n=40), médio 52% (n=44), difícil 27% (n=30). Margem de erro ~±15 pontos. Só mudaram os números do professor-robô (tempo de costas/olhando, reação, chance de pegar): fácil boardMs 6500-10000, reactionMs 3500, catchChance 0.85; médio boardMs 4500-7500, lookMs 6000-8500, reactionMs 3000, catchChance 0.95; difícil boardMs 4000-6500, lookMs 5000-7500, reactionMs 2500, catchChance 0.95. Alunos-robôs e número de robôs não mudaram. Invariante reactionMs < min(lookMs) mantida.
- ACHADO NÃO RESOLVIDO: a partida dura só ~30-60 s (3-6 pulos até a porta) numa aula de 5 min. O jogador simulado é "perfeito" (sempre sabe para onde o professor olha, mesmo no difícil sem aviso), então o difícil real tende a ser mais difícil. O multijogador (professor humano) não foi equilibrado. Falta teste com gente. Se o jogo parecer curto demais, é conversa de regra (ex.: pegar leva mais longe, mais pulos), não de números.
- O script de medição ficou na pasta temporária da sessão (não está no projeto).

REGRAS PARA ALONGAR A PARTIDA (decididas com o usuário; meta: partida de 4-5 min)
- 1) PAUSA depois de acertar: ao chegar numa carteira nova o aluno fica parado config.restAfterJumpMs = 15 s (env REST_AFTER_JUMP_MS), usando lockedUntil (o painel mostra "frozen"). Não vale para o pulo que sai pela porta. (answer-jump.ts)
- 2) PEGO vai para a carteira livre MAIS DISTANTE DA PORTA, em pulos (empate: sorteia). Antes voltava à carteira inicial. (rooms/occupancy.ts farthestFreeDesk; catch-student.ts). nearestFreeDesk foi removida (ficou sem uso).
- 3) PORTA só aceita pulo de 1 carteira: canReach (shared/src/reach.ts) exige distância 1 quando a origem ou o destino é a porta; o alcance de 2 vale entre carteiras comuns. Do canto mais distante o caminho vai de 4 para 5 pulos. A ZONA PROIBIDA da escolha de carteira NÃO mudou (porta + carteiras a até 2 em linha reta; por isso existe inJumpRange). A busca de pulos até a porta virou shared/src/door-distance.ts (jumpsToDoor), usada pelos robôs e pelo servidor.
- Textos da explicação e do aviso de pego atualizados (en.json). Duas perguntas por pulo foi REJEITADO pelo usuário.
- Medição (simulador perfeito, 30 partidas por nível): escape fácil 70%, médio 50%, difícil 20% (metas 75/50/25); tempo médio até escapar 77/93/72 s (antes 35/28/38 s). Ainda curto frente aos 4-5 min, mas o simulador responde em 5-9 s, nunca hesita e sempre faz o caminho mais curto. DECISÃO DO USUÁRIO: manter 15 s e TESTAR COM PESSOAS antes de mexer de novo. Se a partida real ficar curta, o botão mais simples é restAfterJumpMs (30 s estimado em ~2,5-3 min no simulador).
- Testado: servidor por socket (zona proibida mantida, pausa ~15 s com trava, porta de 2 recusada com out_of_reach, porta colada aceita e escapa sem pausa, pego vai para a carteira de distância máxima) e navegador (visão do aluno, professor, solo como professor). NÃO testado com gente nem em celular; teste antigo grid-rules pode estar desatualizado frente às regras novas.

ANOTAÇÕES DO USUÁRIO DEPOIS DO PRIMEIRO TESTE (nada disso foi decidido nem implementado; discutir um de cada vez)
- BUG da porta: ao chegar na carteira colada à porta o usuário não conseguiu clicar "na porta" para sair nem responder a pergunta da porta, e viu "uma cabeça flutuando na tela". O que foi verificado no navegador (teste automático): a carteira da porta (d0-4) existe e fica clicável depois da pausa (a pergunta abre ao clicar nela), MAS ela é desenhada como uma carteira comum, no canto da tela, enquanto a PORTA desenhada na parede (marrom, perto do quadro) NÃO responde ao toque; e a seta de virar da direita cobre o rótulo "30s" dessa carteira quando se olha de frente. É provável que o usuário tenha tocado na porta da parede. A "cabeça flutuando" NÃO foi reproduzida: pedir um print. Ideia a discutir: tornar a porta da parede o alvo do toque (com brilho e "EXIT"/tempo) em vez da carteira. DECISÃO DO USUÁRIO: deixar como está por enquanto (só anotado); retomar mais tarde. Opções discutidas: (A) a porta da parede vira o alvo do toque, com brilho e tempo; (B) manter a carteira da porta como alvo, mas desenhada como porta.
- IDEIA (regra de jogo): dar um MOTIVO para o professor virar para o quadro. Hoje ele pode ficar sempre olhando a turma. Proposta do usuário: o quadro mostra o PROGRESSO DA AULA; quando a progressão termina, o professor vence desde que tenha pelo menos X alunos na sala. (Detalhes em aberto: o progresso só avança com ele de costas? quanto tempo? quanto vale X? como isso convive com o cronômetro e com a vitória atual "metade da turma ainda na sala"?)
- PESQUISA FUTURA: como o professor identifica que um aluno está tentando trocar de cadeira (hoje: anel vermelho no chão do aluno que se move, só enquanto ele olha para a turma). Pesquisar referências de jogos parecidos (ex.: "Luz verde, luz vermelha" / Red Light Green Light, Grandmother's Footsteps, jogos de stealth/esconde-esconde) para decidir a pista visual/sonora mais justa e assustadora.
- O Handoff DEVE ir para o git: outro desenvolvedor também vai trabalhar no projeto e precisa lê-lo. Hoje a pasta ainda NÃO é um repositório git (sem .git); o .gitignore atual não ignora o Handoff.txt (ignora node_modules, dist, *.tsbuildinfo e .env). Criar o repositório e o primeiro commit/push depende do usuário (ou de OK explícito para eu fazer).
- Outros pontos que o usuário disse existirem ("bastante coisa para melhorar"): ainda por listar, um de cada vez.

Pendências
- npm audit: 2 vulnerabilidades (1 moderada, 1 alta), ambas no Vite/esbuild do servidor de DESENVOLVIMENTO; em produção "0 vulnerabilities". Corrigir exige subir o Vite para a versão 7 (mudança grande); não feito.
- Política de privacidade (obrigatória na Play Store) e decisão de faixa etária.
- Apelido do professor não é guardado.
- Sem reconexão (aluno que cai perde o lugar).
- Professor não escolhe a duração da aula (fixa em 10 min, config).
- A diagonal colada (1 linha + 1 coluna) conta como 2 passos e é permitida; só o atalho em diagonal longa foi bloqueado.
- Sem rodízio de professor entre rodadas nem nova rodada na mesma sala (após ended a sala fica parada).

Próximo passo sugerido: jogar o solo de verdade e ajustar os níveis (server/src/bots/difficulty.ts); o usuário publica seguindo docs/DEPLOY.md e testa com celulares reais (nada foi visto num celular de verdade ainda). Em paralelo, gera a arte e os sons reais (docs/ASSETS.md) e eu integro. Do lado do código: reconexão, jogar de novo/rodízio de professor, e (opcional) Capacitor/Play Store.
```
