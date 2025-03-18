import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 6100,
    strictPort: true,
    open: true,
  },
  define: {
    global: 'window',  // 브라우저에서 'window' 객체를 global로 설정
  },
})
