import { defineConfig } from 'cypress'
import cypressSplit from 'cypress-split'

export default defineConfig({
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    setupNodeEvents(on, config) {
      cypressSplit(on, config)
      return config
    },
  },
})
