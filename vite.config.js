import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base is the GitHub Pages sub-path in production (https://andricanuta.github.io/issue-28/),
// and '/' locally so `npm run dev` works at localhost.
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/issue-28/' : '/',
  plugins: [react()],
  // Honour PORT when the harness assigns one, otherwise the usual 5173.
  server: { port: Number(process.env.PORT) || 5173, host: true },
}))
