import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '/@': resolve(__dirname, 'src'),
      '/@router': resolve(__dirname, 'src/router'),
      '/@views': resolve(__dirname, 'src/views'),
      '/@components': resolve(__dirname, 'src/components'),
      '/@utils': resolve(__dirname, 'src/utils'),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/scss/index";`
      }
    }
  }
})
