import { defineConfig } from 'vite';
import {resolve as pathResolve} from 'node:path'
import solidPlugin from 'vite-plugin-solid';
import windiCSS from 'vite-plugin-windicss';

export default defineConfig({
  plugins: [solidPlugin(), windiCSS()],
  server: {
    port: 3000,
  },
  build: {
    lib: {
      entry: pathResolve(__dirname, 'src/index.tsx'),
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['solid-js']
    },
    target: 'esnext',
  },
});
