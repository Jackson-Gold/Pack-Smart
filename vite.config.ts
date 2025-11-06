import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages base path - defaults to repo name, can be overridden with BASE_PATH env var
const base = process.env.BASE_PATH || '/Pack-Smart/'

export default defineConfig({
  plugins: [react()],
  base: base,
  server: { port: 5173, open: true },
  build: { target: 'es2020' }
})
