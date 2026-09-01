import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const authUrl = env.VITE_AUTH_URL || 'http://auth-service:8001'
  const postUrl = env.VITE_POST_URL || 'http://post-service:8002'
  const commentUrl = env.VITE_COMMENT_URL || 'http://comment-service:8003'
  const aiUrl = env.VITE_AI_URL || 'http://ai-service:8004'

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api/auth': {
          target: authUrl,
          changeOrigin: true,
        },
        '/api/posts': {
          target: postUrl,
          changeOrigin: true,
        },
        '/api/comments': {
          target: commentUrl,
          changeOrigin: true,
        },
        '/api/ai': {
          target: aiUrl,
          changeOrigin: true,
        },
      },
    },
  }
})