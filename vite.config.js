import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/unifiedtree-accounting/', // <-- ADD THIS LINE
  server: {
    headers: {
      'Cache-Control': 'no-store',
    },
  },
  plugins: [
    tailwindcss(),
    react(),
  ],
})
