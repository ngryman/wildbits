import { defineConfig } from 'vite'
import process from 'node:process'
import tsconfigPaths from 'vite-tsconfig-paths'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [tsconfigPaths(), solidPlugin()],
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    target: ['es2021', 'chrome100', 'safari13'],
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
})
