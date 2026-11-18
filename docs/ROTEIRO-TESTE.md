# Roteiro de teste com pessoas

Objetivo: descobrir se a **mecânica está redonda** (figuras provisórias, sem arte nem sons finais). Nada daqui exige imagens ou sons novos.

As perguntas abertas que este teste precisa responder:
1. A partida dura o suficiente? **Meta combinada: 4 a 5 min.** O simulador de robôs deu só 70 a 95 s, porque jogador de verdade hesita.
2. A **pausa de 15 s** depois de cada acerto parece tensão ou parece o jogo travado?
3. O professor **consegue pegar com o dedo** no celular, inclusive os alunos do fundo?
4. Os **textos da explicação** deixam claro a pausa, a porta (só de uma carteira colada) e ser mandado para o fundo?
5. A **dificuldade** (fácil, médio, difícil) está no ponto? (Metas: o aluno escapa em uns 75%, 50% e 25%.)

---

## 1. Preparação (10 min antes)

**Como as pessoas entram no jogo** (escolha um; detalhes em `docs/DEPLOY.md`):
- **Publicado (recomendado):** abra o endereço do Railway no notebook e nos celulares. Funciona em qualquer rede.
- **Rede local:** no notebook, `npm run build` e `npm start`. Os celulares, na **mesma Wi-Fi**, abrem `http://IP-DO-NOTEBOOK:3000`. Sem HTTPS a tela do celular **pode apagar** durante a partida (peça para desativar o bloqueio de tela). Redes de escola às vezes isolam os aparelhos.

**Quem faz o quê**
- **Professor:** usa o **notebook** (tela grande, clique do mouse). Uma pessoa.
- **Alunos:** usam o **celular deitado** (paisagem). De 4 a 15 pessoas; com menos de 4 o jogo perde a graça.
- **Observador:** uma pessoa que **não joga** e só anota (pode ser você).

**Checklist**
- [ ] Todos com som ligado e volume médio (o susto é alto).
- [ ] O professor cadastra as perguntas antes (botão de exemplos serve) e anota o código da sala.
- [ ] Tela em **paisagem** nos celulares, sem bloqueio de rotação.
- [ ] Um bloco para anotações e um relógio/cronômetro.

---

## 2. Rodada 1: partida completa, dificuldade **fácil** (15 min)

1. O professor cria a sala em **fácil** e passa o código.
2. Os alunos entram, digitam o apelido, e **cada um escolhe a carteira no mapa** (as da zona da porta são proibidas).
3. O professor inicia. **Cronometre a partida** desde o início até o fim.
4. Observe em silêncio (não explique o jogo): quanto cada um entendeu **só pela tela**?
5. Ao fim, **troque o professor** (outra pessoa assume) e jogue uma segunda partida.

## 3. Rodada 2: **médio** e **difícil** (10 min cada)
Repita com a dificuldade maior. Peça ao grupo, antes, **para não combinar estratégia**, só jogar.

## 4. Rodada 3 (opcional): solo (5 min)
Uma pessoa joga **solo como aluno** e outra **solo como professor** (contra robôs), para ver se a explicação do solo está clara.

---

## 5. O que o observador anota

### Tempo (o mais importante)
| Partida | Dificuldade | Nº de alunos | Duração (min:s) | Como acabou (todos pegos / metade escapou / tempo / alguém escapou) |
|---|---|---|---|---|
| 1 | fácil | | | |
| 2 | fácil | | | |
| 3 | médio | | | |
| 4 | difícil | | | |

### Pausa de 15 s
- O aluno ficou **olhando o celular sem saber o que fazer**? Quantos?
- Alguém reclamou que "travou"? Alguém disse que a espera dava medo ou tensão?
- A contagem na tela ("frozen for Xs") foi lida e entendida?

### Toque do professor (no notebook com mouse) e, se der, **em celular**
- Quantos toques/cliques **erraram** o aluno que se movia?
- Os alunos do **fundo da sala** foram difíceis de pegar?
- O professor entendeu que só pega quem **se move** e só **olhando** para a turma?

### Entendimento das regras (sem ajuda)
Marque quem **não entendeu** cada ponto na primeira partida:
- [ ] Como pular (tocar na carteira que brilha)
- [ ] Verde = 1 carteira, laranja = 2 (menos tempo)
- [ ] Só pode se mexer quando o professor está **de costas**
- [ ] Depois de acertar há uma **pausa**
- [ ] Para **sair**, precisa estar numa carteira **colada** na porta (não dá para pular por cima)
- [ ] Ser **pego** manda para o **fundo** da sala
- [ ] Errar a resposta só **prende** (sem susto); estourar o tempo e ser pego dão o **susto**

### Emoção e clima
- O susto (a cara do professor na tela) **assustou**, **irritou** ou **foi indiferente**?
- Houve **tensão** quando o professor virava? Alguém riu, gritou, disputou?
- A **escuridão** do difícil atrapalhou demais?
- O aviso "o professor está olhando" no **fácil** ajudou? No **médio** (só com ele à vista) e **difícil** (nenhum), sentiram falta?

### Problemas técnicos (anote o aparelho)
- Travou, ficou sem tela, perdeu o lugar? (ainda **não há reconexão**: quem cai perde a vaga)
- Som tocou? O susto e a régua estavam **altos demais**?
- A tela girou/apagou sozinha? Algum texto cortado?
- Aparelho e navegador de quem teve problema: ______

---

## 6. Perguntas para o grupo (5 min no fim)
1. Em uma frase: o que era para fazer no jogo?
2. Qual foi o momento mais **divertido**? E o mais **chato**?
3. A partida foi **curta, boa ou longa demais**?
4. O professor era **fácil ou difícil demais** de enganar?
5. Voltaria a jogar? Indicaria?
6. Mudaria uma coisa no jogo: qual?

---

## 7. Como ler o resultado (decisões que o teste destrava)

| Se aparecer... | Provável ajuste (não faço sem sua decisão) |
|---|---|
| Partidas **abaixo de 3 min** | Subir a pausa (`restAfterJumpMs`, hoje 15 s; 30 s estima ~2,5 a 3 min no simulador) |
| Partidas **acima de 6 min** ou jogo "arrastado" | Reduzir a pausa ou o tempo de costas do professor |
| Jogadores **parados**, sem saber que há pausa | Texto/ícone melhor para a contagem da pausa |
| **Muitos erros de toque** do professor no celular | Aumentar a área de toque (`touchTargetPx`) ou ampliar a cena |
| Fácil/médio **fáceis demais** (quase todos escapam) | Números do professor-robô em `server/src/bots/difficulty.ts`; no multijogador, são as pessoas que decidem |
| **Susto forte demais** (crianças) | Reduzir volume do `jumpscare` ou a duração da cara (`jumpscareMs`) |
| Regras **não entendidas** | Reescrever a explicação (`client/src/i18n/en.json`, chaves `ui.howto_*`) |

---

## 8. Limites conhecidos (não conte como bug)
- **Sem reconexão:** se o celular cair ou a tela apagar, o jogador perde a vaga.
- **Figuras e sons provisórios** (gerados por código). O visual vai mudar depois (`docs/IMAGENS-GEMINI.md` e `docs/AUDIOS.md` têm as listas).
- **Nunca testado em celular físico** até agora: este teste é o primeiro. Se algo tiver comportamento estranho só no celular, anote o modelo.
- Limites do servidor: 50 salas ao mesmo tempo e 15 alunos por sala.

Depois do teste, me traga as anotações (a tabela de tempos e as respostas) e decidimos os ajustes juntos.
