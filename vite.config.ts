import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      // Force copy _redirects → dist/
      name: "copy-redirects",
      writeBundle() {
        const src = path.resolve(__dirname, 'public/_redirects');
        const dest = path.resolve(__dirname, 'dist/_redirects');
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
          console.log("➡️  Copied _redirects → dist/");
        } else {
          console.log("⚠️  public/_redirects not found");
        }
      }
    }
  ],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@services': path.resolve(__dirname, './src/services'),
      '@data': path.resolve(__dirname, './src/data'),
      '@layouts': path.resolve(__dirname, './src/components/layouts')
    }
  }
})
