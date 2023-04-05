import { defineConfig } from 'vite'
import { VitePWA as pwaPlugin } from 'vite-plugin-pwa'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [
    // Do note remove imports, mostly for directives (https://www.solidjs.com/guides/typescript#use___)
    solidPlugin(),
    pwaPlugin({
      base: '/',
      // strategies: 'injectManifest',
      manifest: {
        name: 'Wildbits',
        short_name: 'Wildbits',
        description: 'Quickly share and collaborate on your ideas.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: [
          {
            src: 'logo-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'logo-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        // swDest: 'dist/sw.js',
        // globPatterns: ['**/*.tsx?', '**/*.css', 'index.html'],
        // navigateFallback: 'index.html',
        // navigateFallbackAllowlist: [/[\w-]{21}/],
        // additionalManifestEntries: [
        //   {
        //     url: '/index.html',
        //     revision: null,
        //   },
        // ],
        // runtimeCaching: [
        //   {
        //     // urlPattern: ({ request }) => request.mode === 'navigate',
        //     urlPattern: /\/[\w-]{21}/,
        //     handler: 'StaleWhileRevalidate',
        //     options: {
        //       precacheFallback: {
        //         // This URL needs to be included in your precache manifest.
        //         fallbackURL: '/index.html',
        //       },
        //     },
        //   },
        // ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
        //   //   // navigateFallback: '/index.html',
      },
    }),
  ],
  server: {
    port: 3000,
    strictPort: true,
  },
  preview: {
    port: 3000,
  },
  build: {
    outDir: '../dist',
    target: ['es2021', 'chrome100', 'safari13'],
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
})
