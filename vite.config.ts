import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(
  ({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
    return {
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          selfDestroying: true,
          devOptions: {
            enabled: true
          },
          injectRegister: 'script',
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg}']
          },
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
          manifest: {
            name: 'FFF-Finance',
            short_name: 'FFF-Fin',
            description: 'Personal finance app based on firebase',
            theme_color: '#20b2aan',
            icons: [
              {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png'
              },
              {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any'
              },
              {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
              }
            ]
          }
        })
      ]

    }
})