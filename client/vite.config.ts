import * as path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, UserConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config: UserConfig = {
    base: command === 'build' ? '/static/' : '/',
    plugins: [react(), tsconfigPaths(), tailwindcss()],
    build: {
      manifest: true,
      cssCodeSplit: command === 'build' ? true : false,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    }
  };
  return config;
});
