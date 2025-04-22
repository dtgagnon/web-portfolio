import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next', '.direnv'],
    setupFiles: ['./vitest.setup.ts'],
    css: false, // Disable CSS processing during tests
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@components': resolve(__dirname, './components'),
      '@lib': resolve(__dirname, './lib'),
      '@app': resolve(__dirname, './app'),
    },
  },
});
