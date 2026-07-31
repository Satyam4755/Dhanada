import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api/chat': {
        target: 'http://127.0.0.1:3405',
        changeOrigin: true
      },
      '/api/leads': {
        target: 'http://127.0.0.1:3405',
        changeOrigin: true
      },
      '/api/health': {
        target: 'http://127.0.0.1:3405',
        changeOrigin: true
      },
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      }
    }
  }
})
