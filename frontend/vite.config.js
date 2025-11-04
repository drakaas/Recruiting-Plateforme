import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@frontend': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
})
