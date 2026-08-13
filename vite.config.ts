import { readFileSync } from 'fs'
import path from 'path'

import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import { defineConfig, loadEnv } from 'vite'

const packageJson = JSON.parse(readFileSync(path.resolve(__dirname, './package.json'), 'utf-8'))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:8000'

  return {
    plugins: [react(), UnoCSS()],
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      // MainPage（考试页）约 570KB，含 CodeMirror 固有体积且已按路由懒加载隔离，调高阈值避免误报
      chunkSizeWarningLimit: 600,
    },
  }
})
