import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
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
