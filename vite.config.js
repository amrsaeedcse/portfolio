import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/portfolio/',
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    // Split heavy vendor chunks so the browser can cache them separately
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-gsap': ['gsap', '@gsap/react'],
          'vendor-framer': ['framer-motion'],
        },
      },
    },
    // Raise chunk size warning limit for three.js (it's large by nature)
    chunkSizeWarningLimit: 1000,
  },
})
