# Publicação (Railway, sem Docker)

O servidor Node entrega **o jogo (front) e o tempo real (socket) no mesmo endereço**. Basta publicar um único serviço. A hospedagem cuida do HTTPS, e o socket passa a `wss://` sozinho.

## Como o projeto é montado
| Comando | O que faz |
|---|---|
| `npm run build` | compila o front (`client/dist`) e empacota o servidor em **um arquivo** (`dist/server/main.cjs`) |
| `npm start` | roda o servidor empacotado (precisa do build antes) |

## Antes de tudo
- **Uma única instância.** O estado das salas fica na memória do servidor. Não aumente o número de réplicas/instâncias (os jogadores de uma sala cairiam em servidores diferentes).
- **Não deixe o serviço "dormir".** Se o Railway tiver a opção de suspender por inatividade (nomes como *App Sleeping* ou *Serverless*), deixe **desligada**; senão o primeiro acesso demora ou falha. Confira também o plano e o preço atuais no site, porque mudam.
- **Reiniciar derruba as partidas em andamento** (sem banco de dados, por decisão do projeto). Evite publicar versão nova durante a aula.

## 1) Colocar o projeto no GitHub
A pasta ainda não é um repositório git. Crie um repositório **vazio** no GitHub (pode ser privado) e, na pasta do projeto:

```
git init
git add .
git commit -m "Classroom Escape"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

O `.gitignore` já deixa de fora `node_modules`, `dist` e `.env`. Confira com `git status` antes do primeiro `add` se nada pessoal vai junto.

## 2) Criar o serviço no Railway
1. Em railway.com, entre com sua conta do GitHub: **New Project → Deploy from GitHub repo** e escolha o repositório.
2. Abra o serviço criado, em **Settings**, e configure (os nomes dos menus podem variar um pouco):
   - **Build Command:** `npm ci --include=dev && npm run build`
     (o `--include=dev` garante que as ferramentas de build sejam instaladas mesmo que a hospedagem rode com `NODE_ENV=production`)
   - **Start Command:** `npm start`
   - **Healthcheck Path:** `/health`
   - **Réplicas:** 1
3. Em **Settings → Networking**, clique em **Generate Domain**. O endereço `https://...up.railway.app` serve o jogo e o socket.
4. Não precisa definir variáveis. O Railway já informa a `PORT`, e o servidor a usa.

O projeto declara `node >= 20` em `package.json`, e o Railway escolhe uma versão compatível.

## 3) Testar
1. Abra o endereço no celular e no notebook. A tela "Enter" deve aparecer.
2. No notebook: criar sala, preencher perguntas, iniciar. No celular: entrar com o código e jogar uma carteira.
3. Celular (Chrome/Android): menu → **Instalar app**. iPhone (Safari): Compartilhar → **Adicionar à Tela de Início**.

Para atualizar o jogo: `git push` na branch `main` e o Railway publica de novo.

## Alternativa: testar na rede local (sem hospedagem)
Serve para experimentar com celulares de verdade antes de publicar.
1. No notebook: `npm run build` e depois `npm start`.
2. Descubra o IP do notebook (`ipconfig`, procure "Endereço IPv4"). Se o Windows perguntar sobre o firewall, permita o acesso.
3. Os celulares, **na mesma rede Wi-Fi**, abrem `http://IP-DO-NOTEBOOK:3000`.

Limites: sem HTTPS, o celular **não deixa instalar o app nem manter a tela acesa** (o Wake Lock exige HTTPS), e redes de escola às vezes isolam os aparelhos e os celulares não enxergam o notebook.

## Variáveis de ambiente (todas opcionais)
| Variável | Para quê |
|---|---|
| `PORT` | a hospedagem define sozinha |
| `NODE_ENV=production` | muda o CORS para "só mesma origem" |
| `CORS_ORIGIN` | só se o app rodar em **outra origem** (ex.: app Capacitor). No navegador, não precisa |
| `STATIC_DIR` | pasta do front (padrão: `client/dist`) |
| `CLASS_DURATION_MS`, `ANSWER_TIME_MS`, `TIMEOUT_LOCK_MS`, `WRONG_BLOCK_MS` | ajustes de jogo (padrões: 10 min, 30 s, 8 s, 5 s) |

O servidor responde `GET /health` com `{"status":"ok"}`.

## Antes de abrir para o público
- **Política de privacidade.** O jogo guarda apelido e código de sala só na memória, enquanto a partida dura; não há conta, banco de dados nem rastreamento. A Play Store exige a política.
- Definir o **público-alvo por idade** (menores de 13 anos têm regras mais rígidas) e declarar o terror leve com susto no questionário de classificação.
- Os **ícones do app** em `client/public/icons/` são provisórios (porta vermelha). Troque pelos definitivos mantendo nomes e tamanhos: `icon-192.png` (192×192), `icon-512.png` (512×512, mantenha o desenho dentro da área central) e `apple-touch-icon.png` (180×180). O script `node client/scripts/make-icons.mjs` regera os provisórios.

## Limites atuais
- Teto de **50 salas** simultâneas e **15 alunos** por sala (`server/src/config.ts`). A sala é uma grade de 5×5 = 25 carteiras, e cada aluno escolhe a sua (as 5 perto da porta ficam proibidas na escolha).
- Sem reconexão: quem perde a conexão sai da sala e precisa entrar de novo.
- O modo offline do app só abre a tela inicial. Jogar exige internet e o servidor no ar.
