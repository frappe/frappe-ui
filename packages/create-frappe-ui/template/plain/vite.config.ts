import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import frappeui from 'frappe-ui/vite'

export default defineConfig({
  plugins: [
    frappeui({
      buildConfig: false,
      frappeProxy: false,
      jinjaBootData: false,
    }),
    vue(),
  ],
})
