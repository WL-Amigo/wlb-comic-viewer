import { defineConfig } from 'windicss/helpers';

export default defineConfig({
  extract: {
    include: ['./src/**/*.{ts,tsx}'],
  },
  safelist: ['w-screen', 'h-screen', 'overflow-hidden'],
});
