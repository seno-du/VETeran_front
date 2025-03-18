import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    strictPort: true,
    open: true,
    hmr: {
      overlay: false,  // HMR 에러 오버레이 비활성화
    },
  },
  define: {
    'window.Kakao': 'window.Kakao',
    'window.naver': 'window.naver',
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 여기에서 SCSS 관련 설정을 추가할 수 있습니다
        // 예: 추가적인 변수나 경로를 설정할 수 있습니다
      },
    },
  },
})
