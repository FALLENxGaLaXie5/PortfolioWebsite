import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            // three.js + R3F + drei are only needed by the lazily-loaded
            // canvases; keep them in one shared, long-cacheable chunk.
            {
              name: "three-vendor",
              test: /node_modules[\\/](three|three-stdlib|@react-three|maath|troika-|camera-controls|meshline|@monogrid|detect-gpu|hls\.js|stats|zustand|suspend-react|its-fine|@use-gesture|tunnel-rat|react-use-measure)/,
            },
          ],
        },
      },
    },
    // three-vendor is ~1 MB minified by itself and only loads after first paint.
    chunkSizeWarningLimit: 1100,
  },
});
