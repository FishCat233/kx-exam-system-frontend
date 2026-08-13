import path from 'path'

import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:8000'

  return {
    plugins: [react(), UnoCSS()],
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
