import { defineConfig } from 'cypress'
import cypressSplit from 'cypress-split'
import codeCoverageTask from '@cypress/code-coverage/task'

export default defineConfig({
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    setupNodeEvents(on, config) {
      cypressSplit(on, config)
      codeCoverageTask(on, config)
      return config
    },
  },
  env: {
    codeCoverage: {
      exclude: ['src/**/*.cy.ts', 'src/**/stories/**'],
    },
  },
})
