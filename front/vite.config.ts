import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  
  server: {
    proxy: {
      '/productos': 'http://localhost:3000',
      '/pedidos': 'http://localhost:3000',
      '/reportes': 'http://localhost:3000',
      '/_test': 'http://localhost:3000',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});