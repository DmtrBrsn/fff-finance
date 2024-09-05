// vite.config.ts
import { defineConfig, loadEnv } from "file:///D:/Temp/Projects/fff-finance/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Temp/Projects/fff-finance/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { VitePWA } from "file:///D:/Temp/Projects/fff-finance/node_modules/vite-plugin-pwa/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "D:\\Temp\\Projects\\fff-finance";
var vite_config_default = defineConfig(
  ({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
      plugins: [
        react(),
        VitePWA({
          registerType: "autoUpdate",
          selfDestroying: true,
          devOptions: {
            enabled: true
          },
          injectRegister: "script",
          workbox: {
            globPatterns: ["**/*.{js,css,html,ico,png,svg}"]
          },
          includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
          manifest: {
            name: "FFF-Finance",
            short_name: "FFF-Fin",
            description: "Personal finance app based on firebase",
            theme_color: "#20b2aan",
            icons: [
              {
                src: "pwa-192x192.png",
                sizes: "192x192",
                type: "image/png"
              },
              {
                src: "pwa-512x512.png",
                sizes: "512x512",
                type: "image/png"
              },
              {
                src: "pwa-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any"
              },
              {
                src: "pwa-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable"
              }
            ]
          }
        })
      ],
      resolve: {
        alias: {
          "@": path.resolve(__vite_injected_original_dirname, "src"),
          "@app": path.resolve(__vite_injected_original_dirname, "src/app"),
          "@pages": path.resolve(__vite_injected_original_dirname, "src/pages"),
          "@widgets": path.resolve(__vite_injected_original_dirname, "src/widgets"),
          "@features": path.resolve(__vite_injected_original_dirname, "src/features"),
          "@entities": path.resolve(__vite_injected_original_dirname, "src/entities"),
          "@shared": path.resolve(__vite_injected_original_dirname, "src/shared")
        }
      }
    };
  }
);
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxUZW1wXFxcXFByb2plY3RzXFxcXGZmZi1maW5hbmNlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxUZW1wXFxcXFByb2plY3RzXFxcXGZmZi1maW5hbmNlXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9UZW1wL1Byb2plY3RzL2ZmZi1maW5hbmNlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyhcbiAgKHsgY29tbWFuZCwgbW9kZSB9KSA9PiB7XG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpXG4gICAgcmV0dXJuIHtcbiAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgcmVhY3QoKSxcbiAgICAgICAgVml0ZVBXQSh7XG4gICAgICAgICAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXG4gICAgICAgICAgc2VsZkRlc3Ryb3lpbmc6IHRydWUsXG4gICAgICAgICAgZGV2T3B0aW9uczoge1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgaW5qZWN0UmVnaXN0ZXI6ICdzY3JpcHQnLFxuICAgICAgICAgIHdvcmtib3g6IHtcbiAgICAgICAgICAgIGdsb2JQYXR0ZXJuczogWycqKi8qLntqcyxjc3MsaHRtbCxpY28scG5nLHN2Z30nXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgaW5jbHVkZUFzc2V0czogWydmYXZpY29uLmljbycsICdhcHBsZS10b3VjaC1pY29uLnBuZycsICdtYXNrLWljb24uc3ZnJ10sXG4gICAgICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgICAgIG5hbWU6ICdGRkYtRmluYW5jZScsXG4gICAgICAgICAgICBzaG9ydF9uYW1lOiAnRkZGLUZpbicsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1BlcnNvbmFsIGZpbmFuY2UgYXBwIGJhc2VkIG9uIGZpcmViYXNlJyxcbiAgICAgICAgICAgIHRoZW1lX2NvbG9yOiAnIzIwYjJhYW4nLFxuICAgICAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNyYzogJ3B3YS0xOTJ4MTkyLnBuZycsXG4gICAgICAgICAgICAgICAgc2l6ZXM6ICcxOTJ4MTkyJyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJ1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3JjOiAncHdhLTUxMng1MTIucG5nJyxcbiAgICAgICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzcmM6ICdwd2EtNTEyeDUxMi5wbmcnLFxuICAgICAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgICAgICAgcHVycG9zZTogJ2FueSdcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNyYzogJ3B3YS01MTJ4NTEyLnBuZycsXG4gICAgICAgICAgICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgICAgICBwdXJwb3NlOiAnbWFza2FibGUnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICBdLFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICBhbGlhczoge1xuICAgICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxuICAgICAgICAgICdAYXBwJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9hcHAnKSxcbiAgICAgICAgICAnQHBhZ2VzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9wYWdlcycpLFxuICAgICAgICAgICdAd2lkZ2V0cyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvd2lkZ2V0cycpLFxuICAgICAgICAgICdAZmVhdHVyZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2ZlYXR1cmVzJyksXG4gICAgICAgICAgJ0BlbnRpdGllcyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvZW50aXRpZXMnKSxcbiAgICAgICAgICAnQHNoYXJlZCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvc2hhcmVkJyksXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfVxufSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQThRLFNBQVMsY0FBYyxlQUFlO0FBQ3BULE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFDeEIsT0FBTyxVQUFVO0FBSGpCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVE7QUFBQSxFQUNiLENBQUMsRUFBRSxTQUFTLEtBQUssTUFBTTtBQUN2QixVQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFDekMsV0FBTztBQUFBLE1BQ0wsU0FBUztBQUFBLFFBQ1AsTUFBTTtBQUFBLFFBQ04sUUFBUTtBQUFBLFVBQ04sY0FBYztBQUFBLFVBQ2QsZ0JBQWdCO0FBQUEsVUFDaEIsWUFBWTtBQUFBLFlBQ1YsU0FBUztBQUFBLFVBQ1g7QUFBQSxVQUNBLGdCQUFnQjtBQUFBLFVBQ2hCLFNBQVM7QUFBQSxZQUNQLGNBQWMsQ0FBQyxnQ0FBZ0M7QUFBQSxVQUNqRDtBQUFBLFVBQ0EsZUFBZSxDQUFDLGVBQWUsd0JBQXdCLGVBQWU7QUFBQSxVQUN0RSxVQUFVO0FBQUEsWUFDUixNQUFNO0FBQUEsWUFDTixZQUFZO0FBQUEsWUFDWixhQUFhO0FBQUEsWUFDYixhQUFhO0FBQUEsWUFDYixPQUFPO0FBQUEsY0FDTDtBQUFBLGdCQUNFLEtBQUs7QUFBQSxnQkFDTCxPQUFPO0FBQUEsZ0JBQ1AsTUFBTTtBQUFBLGNBQ1I7QUFBQSxjQUNBO0FBQUEsZ0JBQ0UsS0FBSztBQUFBLGdCQUNMLE9BQU87QUFBQSxnQkFDUCxNQUFNO0FBQUEsY0FDUjtBQUFBLGNBQ0E7QUFBQSxnQkFDRSxLQUFLO0FBQUEsZ0JBQ0wsT0FBTztBQUFBLGdCQUNQLE1BQU07QUFBQSxnQkFDTixTQUFTO0FBQUEsY0FDWDtBQUFBLGNBQ0E7QUFBQSxnQkFDRSxLQUFLO0FBQUEsZ0JBQ0wsT0FBTztBQUFBLGdCQUNQLE1BQU07QUFBQSxnQkFDTixTQUFTO0FBQUEsY0FDWDtBQUFBLFlBQ0Y7QUFBQSxVQUNGO0FBQUEsUUFDRixDQUFDO0FBQUEsTUFDSDtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1AsT0FBTztBQUFBLFVBQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLFVBQ2xDLFFBQVEsS0FBSyxRQUFRLGtDQUFXLFNBQVM7QUFBQSxVQUN6QyxVQUFVLEtBQUssUUFBUSxrQ0FBVyxXQUFXO0FBQUEsVUFDN0MsWUFBWSxLQUFLLFFBQVEsa0NBQVcsYUFBYTtBQUFBLFVBQ2pELGFBQWEsS0FBSyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxVQUNuRCxhQUFhLEtBQUssUUFBUSxrQ0FBVyxjQUFjO0FBQUEsVUFDbkQsV0FBVyxLQUFLLFFBQVEsa0NBQVcsWUFBWTtBQUFBLFFBQ2pEO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNKO0FBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
