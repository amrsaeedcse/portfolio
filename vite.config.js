import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  server: {
    host: true,
  },
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    rollupOptions: {
      output: {
        // Function form — required by rolldown (object form throws TypeError)
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion')) return 'vendor-framer';
          if (id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom')) return 'vendor-react';
        },
      },
    },
    // three.js is large by nature; vendor-three chunk will still be under 1MB gzipped
    chunkSizeWarningLimit: 1000,
  },
})
