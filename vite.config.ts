import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base 设为相对路径，便于部署到任意子目录（如 /docs/）
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: 'dist', chunkSizeWarningLimit: 1500 },
  server: { host: true, port: 5173 },
})
