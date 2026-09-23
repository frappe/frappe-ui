import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import frappeui from 'frappe-ui/vite'

export default defineConfig({
  // `frontendRoute` is where the site serves the app. The plugin proxies the
  // bench while you develop, and builds into the app's public and www folders.
  plugins: [frappeui({ frontendRoute: '__ROUTE__' }), vue()],
})
