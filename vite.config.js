import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/poisson-party-predictor/',
  server: {
    port: 3003,
    open: true
  }
});