import { defineConfig } from 'vite';
import { resolve as pathResolve } from 'node:path';
import solidPlugin from 'vite-plugin-solid';
import windiCSS from 'vite-plugin-windicss';
import iconsPlugin from 'unplugin-icons/vite';

export default defineConfig({
  plugins: [solidPlugin(), windiCSS(), iconsPlugin({ compiler: 'solid', defaultClass: 'w-6 h-6' })],
  server: {
    port: 3000,
  },
  build: {
    lib: {
      entry: pathResolve(__dirname, 'src/index.tsx'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['solid-js'],
    },
    target: 'esnext',
    emptyOutDir: false,
  },
});
