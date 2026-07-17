import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // Inline assets smaller than 4KB to reduce requests
    assetsInlineLimit: 4096,
    // Enable CSS code splitting per chunk
    cssCodeSplit: true,
    // Increase warning limit (we know our chunks)
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // Manual chunk splitting to reduce initial bundle
        manualChunks(id) {
          // React core
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          // React Router
          if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run')) {
            return 'vendor-router';
          }
          // Lucide icons — split into a separate vendor chunk
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          // Supabase (only loaded by auth/admin)
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }
          // Canvas confetti (only on some pages)
          if (id.includes('node_modules/canvas-confetti')) {
            return 'vendor-confetti';
          }
        },
      },
    },
  },
})
