import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/enta/',
  build: {
    outDir: 'dist/enta',
  },
  plugins: [react()],
})
