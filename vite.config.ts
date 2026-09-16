import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The dev proxy mirrors nginx.conf in the container: the app always calls
// same-origin paths, so nothing in the code knows where the services live.
const service = (port: number) => ({ target: `http://localhost:${port}`, changeOrigin: true })

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4200,
    proxy: {
      '/auth': service(8084),
      '/customer': service(8085),
      '/account': service(8086),
      '/transaction': service(8087),
      '/rules': service(8090),
    },
  },
})
