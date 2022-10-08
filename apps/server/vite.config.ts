import { defineConfig } from 'vite';
import { resolve as pathResolve } from 'path';
import SolidPlugin from 'vite-plugin-solid'

// https://vitejs.dev/config/
export default defineConfig({
  root: "./frontend",
  plugins: [SolidPlugin()],
  server: {
    proxy: {
      '^/api/.*': 'http://localhost:9001/',
    },
  },
});
