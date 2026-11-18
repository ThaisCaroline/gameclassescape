---
name: gen-handoff
description: Gera um handoff datado e único em docs/handoffs/ resumindo a sessão de trabalho de um dev no GameClassRoom (objetivo, decisões, estado, próximos passos), como referência para outros devs e IAs. Use quando o usuário pedir "gera handoff", "salva contexto", "resumo da sessão", "vou encerrar" ou /gen-handoff.
---

# gen-handoff

Gera o handoff da sessão atual: um arquivo único e datado em `docs/handoffs/` com o que foi feito, por quê e o que falta. O objetivo é que outros devs e IAs entendam o desenvolvimento do GameClassRoom e continuem de onde a sessão parou.

Mais de uma pessoa trabalha no projeto ao mesmo tempo. Por isso cada handoff tem um autor e registra onde pode haver conflito com o trabalho dos outros.

Só gera quando o usuário pedir. Não monitora contexto nem custo.

## Princípios

- **Referência futura, não diário.** Registrar o que quem não estava na sessão precisa saber.
- **Só fatos da sessão.** Não inventar estado, teste ou decisão que não ocorreu.
- **Não duplicar o que o repositório já diz.** Código, histórico do git e `CLAUDE.md` não se copiam; apontar o arquivo ou o commit.
- **Nada de segredos** (chaves, tokens, `.env`).
- Escrito em português, direto e conciso.

## Como gerar

### 1. Coletar

Rodar:

- `git branch --show-current` e `git config user.name`
- `git status --short` e `git diff --stat`
- `git log --oneline main..HEAD` (commits da branch; se estiver na `main`, usar os commits feitos na sessão)
- `date +%Y%m%d_%H%M%S` (hora local; o contexto só traz a data)
- `ls docs/handoffs/` e ler os handoffs mais recentes, inclusive de outros autores, para não repetir e para registrar sobreposição

Reconstruir a sessão: objetivo, decisões (de regra de jogo e técnicas), o que foi feito e descartado, estado atual, o que foi testado e o que não foi, próximos passos, perguntas abertas.

### 2. Criar novo ou atualizar o existente

**Atualizar** o handoff existente, em vez de criar outro, só se **todas** as condições valerem:

- o autor é o mesmo (`git config user.name`);
- ainda é a mesma sessão de trabalho (continuação direta);
- as atividades estão alinhadas ao objetivo do arquivo.

Ao atualizar: ler a versão atual do disco, editar com Edit, ajustar as seções afetadas sem duplicar informação, manter o nome do arquivo e preencher `Atualizado em`.

**Criar novo** em qualquer outro caso. Se o trabalho deu outra direção, o handoff antigo fica como está e o novo o referencia.

Nunca editar handoff de outro autor. Se precisar corrigir ou complementar, criar um novo e referenciar o dele. Em dúvida entre criar e atualizar, perguntar ao usuário.

### 3. Nomear o arquivo

Formato: `docs/handoffs/YYYYMMDD_HHMMSS_<autor>_<slug>.md`

- `YYYYMMDD_HHMMSS`: hora local da geração.
- `<autor>`: `git config user.name` em kebab-case, minúsculo, sem acento.
- `<slug>`: 3 a 5 palavras em kebab-case sobre o trabalho principal.
- Ex.: `20261118_183000_rafael-guedes_config-handoff-skill.md`

Se `docs/handoffs/` não existir, criar.

### 4. Escrever e salvar

Seguir o template abaixo. Arquivo novo: Write. Atualização: Edit.

Todas as seções são obrigatórias. Se uma não se aplica, escrever "Nada" em vez de omitir.

### 5. Cápsula de retomada

Logo após salvar, gerar uma única linha para o usuário copiar:

```
Leia `docs/handoffs/<arquivo>.md` e retome do "Próximo passo imediato" da seção 5.
```

### 6. Responder ao usuário

```
Handoff salvo: `docs/handoffs/<arquivo>.md`

Para continuar em outra sessão: `/clear` (ou nova conversa) e cole a cápsula:

[cápsula]

**Estado resumido:** <1 a 2 frases do ponto exato onde paramos>
```

A skill só salva o arquivo. Não faz `git add` nem `git commit`. Se o usuário pedir o commit, seguir as regras dele: mensagem de uma linha, em inglês, sem linha de co-autor, sem o caractere "—" e enviada para aprovação antes de executar.

## Template do handoff

```markdown
# Handoff: [título curto e descritivo, máx 60 caracteres]

**Data:** [AAAA-MM-DD]
**Atualizado em:** [AAAA-MM-DD HH:MM, só se o arquivo foi atualizado; senão "Não atualizado"]
**Autor:** [git config user.name]
**Branch:** [nome da branch]
**Commits:** [`abc1234 mensagem` por linha, ou "Nenhum (alterações não commitadas)"]
**Status:** [em andamento | bloqueado | aguardando decisão | concluído]
**Handoff anterior relacionado:** [`docs/handoffs/<arquivo>.md` ou "Nenhum"]

## 1. Objetivo
O que está sendo feito e por quê. 2 a 4 frases.
Citar o módulo em foco (shared, server, client, docs) e o personagem envolvido (teacher, student, ghost), se houver.

## 2. Decisões
**Regras de jogo e o que o jogador vê:** cada decisão, o motivo e que foi combinada com o usuário. Se não houve, "Nada".
**Técnicas e de estrutura:** cada decisão, o motivo e as alternativas descartadas ("escolhemos X porque Y, não Z porque W").

## 3. O que foi feito
Lista cronológica numerada de ações e artefatos criados ou alterados.
Registrar tentativas descartadas: "Tentamos X mas descartamos porque Y."

## 4. Estado atual
**Funciona:** o que está completo.
**Incompleto:** o que existe mas não está pronto.
**Quebrado / em dúvida:** o que não funciona ou está incerto.
**Testado:** o que foi de fato executado ou verificado e como.
**Não testado:** o que foi escrito mas não verificado.
**Desvios das regras do `CLAUDE.md`:** arquivo acima de ~150 linhas, número solto fora do `config`, texto fixo na tela etc. Se não há, "Nenhum".

## 5. Próximos passos
Lista numerada, executável sem contexto extra. O item 1 é o **Próximo passo imediato**.
1. Abrir `<arquivo>` e fazer X
2. ...

## 6. Perguntas em aberto
- [ ] Decisão pendente ou investigação necessária (indicar quem decide, se souber)

## 7. Trabalho paralelo e conflitos
**Arquivos e módulos que esta sessão tocou:** lista.
**Áreas em que outros devs podem estar mexendo:** conforme outros handoffs e branches. Se não há indício, "Nenhum conhecido".
**Pontos de integração ou risco de conflito:** tipos em `shared/`, mensagens de rede, `config`, `en.json` e qualquer arquivo editado por mais de uma pessoa.

## 8. Artefatos relevantes
| Artefato | Caminho | Por que é relevante |
|---|---|---|
| [nome] | `<caminho>` | [contexto] |

## 9. Instruções para quem continuar
- **Ler primeiro:** arquivos a abrir antes de qualquer coisa.
- **Armadilha:** o que a próxima pessoa ou IA vai querer fazer e não deve.
- **Confirmação necessária:** o que exige OK explícito do usuário antes de executar.
```

## Protocolo da próxima sessão (quando a cápsula é colada)

1. Ler o handoff referenciado e o `CLAUDE.md`, sem perguntar se deve ler.
2. Conferir se o repositório divergiu do que o handoff descreve: `git log` desde o último commit citado e `git status`. Outro dev pode ter avançado.
3. Recapitular em 2 frases o que foi feito e onde parou, e avisar se encontrou divergência.
4. Propor o "Próximo passo imediato" e **esperar o OK explícito do usuário antes de escrever ou alterar código**. As regras de trabalho do `CLAUDE.md` valem na retomada como em qualquer sessão.

## Restrições

- **Não omitir** seção do template.
- **Não ser vago** em "Próximos passos": cada item deve ser executável sem contexto extra.
- **Não inventar** estado, teste ou decisão que não ocorreu.
- **Não editar** handoff de outro autor, nem de outra sessão ou de outro assunto.
- Sessão só de exploração ou conversa, sem código: dizer isso nas seções 3 e 4.
- A cápsula tem **uma linha**.
