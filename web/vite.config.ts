import * as path from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  // Get API configuration from environment variables
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://localhost:3000/api'
  // Extract base URL without /api for proxy target
  const proxyTarget = apiBaseUrl.replace('/api', '')

  const config: UserConfig = {
    base: command === 'build' ? '/static/' : '/',
    plugins: [react(), tsconfigPaths(), tailwindcss()],
    build: {
      manifest: true,
      cssCodeSplit: command === 'build' ? true : false
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      host: true, // Allow access from network
      port: 5173, // Frontend dev server port
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err)
            })
            proxy.on('proxyReq', (_proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url)
            })
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log(
                'Received Response from the Target:',
                proxyRes.statusCode,
                req.url
              )
            })
          }
        }
      }
    }
  }
  return config
})
