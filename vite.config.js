import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss(),],
  build: {
    rollupOptions: {
      input: {
        // popup: resolve(__dirname, 'popup.html'),
        // sidepanel: resolve(__dirname, 'sidepanel.html'),
        "note-script": resolve(__dirname, 'src/note-script.jsx'),
        // 'content-script': resolve(__dirname, 'src/content-script.jsx'),

      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      }
    }
  }
})
