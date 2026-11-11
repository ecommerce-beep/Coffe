import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative asset paths so the build works on any GitHub Pages repo path
export default defineConfig(({ command }) => ({
  base: command === 'build' ? './' : '/', // relative: works under any repo name
  plugins: [react()],
  server: { port: 5178 },
}));
