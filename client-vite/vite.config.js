import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/gallery": "http://localhost:3000",
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — changes rarely, cached for a long time
          "vendor-react": ["react", "react-dom"],
          // Router — changes rarely
          "vendor-router": ["react-router-dom"],
          // Helmet — changes rarely
          "vendor-helmet": ["react-helmet-async"],
          // Date utilities — only needed on /booking
          "vendor-dates": ["date-fns", "date-fns-tz", "react-datepicker"],
          // Icons — large, changes rarely
          "vendor-icons": ["react-icons"],
        },
      },
    },
  },
})
