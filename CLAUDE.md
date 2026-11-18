# GameClassRoom

Jogo de fuga em sala de aula (terror leve) para praticar inglês. Contexto completo em `Handoff.txt`.

## Como trabalhar (REGRAS DO USUÁRIO, valem sempre)
1. **Não codar sem o OK do usuário.** Primeiro conversar: entender o pedido, propor, e só escrever ou alterar código (e arquivos do projeto) depois de um OK explícito para aquele passo. Um OK vale só para o que foi combinado, não para o próximo passo.
2. **Não pressupor.** Dúvida de design, regra de jogo, formato ou prioridade: perguntar, sugerir opções (com uma recomendação) e decidir junto com o usuário. Não escolher sozinho nem "completar" o que não foi dito.
3. Se o pedido for ambíguo ou tiver mais de uma leitura razoável, dizer como entendi e confirmar antes de agir.
4. Mudança que altera uma regra do jogo ou o que o jogador vê: sempre discutir antes, mesmo que pareça pequena.
5. Responder em português, direto e conciso.
6. Entregar de forma incremental, com confirmação a cada passo.
7. Sem over-engineering e sem antecipar passos não pedidos.
8. Ao terminar algo, dizer com franqueza o que foi testado e o que não foi.

Histórico: em várias etapas anteriores eu decidi regras sozinho (ex.: formato da sala, limite de alunos, tempos) e implementei sem confirmar; o usuário pediu que isso pare.

## Regras de código
1. Um arquivo faz uma coisa só. Limite de ~150 linhas; passou disso, dividir.
2. O servidor é a única fonte de verdade. O cliente exibe e envia intenções; nunca recebe a resposta certa.
3. Lógica de regra (TS puro, sem Phaser nem socket) separada da apresentação (tela, som, vibração) e da rede.
4. Módulo não importa o interno de outro. Só usa o `index.ts` dele.
5. Constantes configuráveis (30s, 8s, 20s etc.) ficam num `config`; nada de número solto no código.
6. Textos só por chave de tradução (`ui.enter_room`), nunca string fixa na tela. V1 só em inglês (`client/src/i18n/en.json`).
7. Tipos e mensagens de rede compartilhados ficam em `shared/`.
8. Nomes claros; sem arquivo `utils` genérico.
9. Cada personagem (teacher, student, ghost) tem seu módulo próprio no servidor e no cliente.

## Estrutura
- `shared/` tipos e mensagens de rede
- `server/src/` rooms, characters/{teacher,student,ghost}, timers, questions, network
- `client/src/` characters/{teacher,student,ghost}, scenes (Phaser: só desenha, recebe ViewState da tela), art (manifest e provisórios), screens (telas HTML: formulários, lobby), effects (tremor, susto), device (wake lock), dom (helper h()), audio (Web Audio: sons provisórios + arquivos reais), i18n, network
- `docs/` documentação

## Stack
TypeScript, npm workspaces. Cliente: Phaser + Vite. Servidor: Node + Socket.io (estado em memória).
