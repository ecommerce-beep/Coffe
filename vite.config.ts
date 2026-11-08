import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from https://<user>.github.io/coffe/ on GitHub Pages
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/coffe/' : '/',
  plugins: [react()],
  server: { port: 5178 },
}));
