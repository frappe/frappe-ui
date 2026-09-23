import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import frappeui from 'frappe-ui/vite'

export default defineConfig({
  plugins: [
    // The parts that talk to a Frappe server are off. The rest keeps the dev
    // server fast and loads one copy of the modules behind toast() and dialog.
    frappeui({ frappeProxy: false, jinjaBootData: false, buildConfig: false }),
    vue(),
  ],
})
