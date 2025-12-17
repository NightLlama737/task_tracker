import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',        // kořen projektu, kde je index.html
  build: {
    outDir: 'dist', // výstupní složka, kterou Nginx servíruje
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
});
