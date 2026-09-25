import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'cypress'
import cypressSplit from 'cypress-split'

// `nyc report` reads the per-spec coverage files from this directory after
// the run, so the path comes from the same config.
const coverageDir: string = JSON.parse(readFileSync('.nycrc.json', 'utf8'))[
  'temp-dir'
]

export default defineConfig({
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    setupNodeEvents(on, config) {
      cypressSplit(on, config)
      if (process.env.COVERAGE === 'true') {
        // Start each run clean, then keep one file per spec.
        rmSync(coverageDir, { recursive: true, force: true })
        mkdirSync(coverageDir, { recursive: true })
        on('task', {
          saveCoverage({ spec, coverage }: { spec: string; coverage: object }) {
            const file = `${spec.replace(/[\\/]/g, '__')}.json`
            writeFileSync(join(coverageDir, file), JSON.stringify(coverage))
            return null
          },
        })
      }
      return config
    },
  },
})
