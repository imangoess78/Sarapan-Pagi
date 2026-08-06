import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Plugin to serve public/index.html at root "/"
function servePublicIndex() {
  return {
    name: 'serve-public-index',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/' || req.url === '/index.html') {
          const filePath = resolve(__dirname, '../public/index.html')
          const content = readFileSync(filePath, 'utf-8')
          res.setHeader('Content-Type', 'text/html')
          res.end(content)
          return
        }
        next()
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), servePublicIndex()],
  base: '/admin',
  // Serve static assets (favicon, images) from the root public folder
  publicDir: '../public',
  server: {
    proxy: {
      // In dev, proxy /api → Cloudflare Worker (wrangler dev runs on 8787)
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
})
