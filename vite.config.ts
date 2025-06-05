import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './src',
  base: '/skyrim-control-mapper',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
