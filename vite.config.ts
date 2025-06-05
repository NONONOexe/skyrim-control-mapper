import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,txt}'],
      },
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Skyrim Control Mapper',
        short_name: 'SCM',
        description: 'Visual editor for Skyrim SE controlmap.txt files',
        start_url: '/skyrim-control-mapper/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2196f3',
        icons: [
          {
            src: '/skyrim-control-mapper/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/skyrim-control-mapper/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  root: './src',
  base: '/skyrim-control-mapper',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
