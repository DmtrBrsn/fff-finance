import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import optimizeLocales from '@react-aria/optimize-locales-plugin'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(
  ({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
      plugins: [
        react(),
        {
          ...optimizeLocales.vite({
            locales: ['en-US', 'ru-RU']
          }),
          enforce: 'pre'
        },
      ],
      build: {
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                const modulePath = id.split('node_modules/')[1]
                const scopedPackageName = modulePath?.split('/')[1]
                const chunkName = scopedPackageName?.split('@')[scopedPackageName.startsWith('@') ? 1 : 0]
                return chunkName
              }
            },
          }
        }
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
          '@app': path.resolve(__dirname, 'src/app'),
          '@pages': path.resolve(__dirname, 'src/pages'),
          '@features': path.resolve(__dirname, 'src/features'),
          '@shared': path.resolve(__dirname, 'src/shared'),
        }
      },
    }
  })
