// Ponto de entrada do servidor. Só inicializa; sem lógica de jogo aqui.
import { createServer } from 'node:http';
import { config } from './config.js';
import { createHttpHandler } from './http/index.js';
import { createGameServer } from './network/index.js';

const httpServer = createServer(createHttpHandler(config.staticDir));
createGameServer(httpServer);

// Se não conseguir escutar (porta ocupada, sem permissão), o processo precisa ENCERRAR: um servidor vivo que
// não atende ninguém é pior que um que cai e é reiniciado pela hospedagem.
httpServer.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

httpServer.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});

// Rede de segurança: um erro inesperado num handler não deve derrubar todas as salas de uma vez.
// (As causas conhecidas, como pacotes sem callback, já são tratadas na origem em network/ack-guard.ts.)
process.on('uncaughtException', (error) => console.error('Uncaught exception:', error));
process.on('unhandledRejection', (reason) => console.error('Unhandled rejection:', reason));

// A hospedagem manda SIGTERM ao reiniciar/trocar de versão: fecha limpo em vez de cortar no meio.
process.on('SIGTERM', () => {
  httpServer.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 3000).unref();
});
