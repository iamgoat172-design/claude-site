import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    target: 'es2019',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        offer: resolve(__dirname, 'offer.html'),
        ecoclean: resolve(__dirname, 'eco-clean.html'),
        aquabiography: resolve(__dirname, 'aquabiography.html'),
      },
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
        },
      },
    },
  },
});
