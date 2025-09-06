import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sitemap({
    hostname: "https://www.brandcom.store",
    dynamicRoutes: [
     "/",
    ],
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date(),
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
