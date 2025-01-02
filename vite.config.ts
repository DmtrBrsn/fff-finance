import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(
  ({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
    return {
      plugins: [
        react(),
      ],
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