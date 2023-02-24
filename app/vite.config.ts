import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    // Do note remove imports, mostly for directives (https://www.solidjs.com/guides/typescript#use___)
    solidPlugin(),
    tsconfigPaths(),
  ],
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
