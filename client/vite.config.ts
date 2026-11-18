import { defineConfig } from 'vite';

export default defineConfig({
  // host: true expõe na rede local, para abrir no celular pelo IP do notebook.
  server: { host: true, port: 5173 },
});
