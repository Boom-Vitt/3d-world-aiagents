import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const hostingerRoot = resolve(projectRoot, 'hostinger');
const outputDirectory = resolve(projectRoot, 'hostinger-dist');

export default defineConfig({
  root: hostingerRoot,
  base: './',
  publicDir: resolve(projectRoot, 'public'),
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [
    react(),
    {
      name: 'copy-hostinger-apache-config',
      writeBundle() {
        copyFileSync(resolve(hostingerRoot, '.htaccess'), resolve(outputDirectory, '.htaccess'));
      },
    },
  ],
  build: {
    outDir: outputDirectory,
    emptyOutDir: true,
  },
});
