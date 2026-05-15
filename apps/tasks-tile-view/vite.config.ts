import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const dsRoot = new URL("../../src", import.meta.url).pathname

// Tauri expects a fixed port + no obfuscation of the renderer URL.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@ds": dsRoot,
    },
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
  },
})
