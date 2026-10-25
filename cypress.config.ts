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
    experimentalSingleTabRunMode: true,
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    setupNodeEvents(on, config) {
      cypressSplit(on, config)
      // The preset wraps `hover:` in `@media (hover: hover) and (pointer: fine)`.
      // Headless Chrome reports no pointing device, so that query never matches
      // and no hover style applies. Report a mouse, as a desktop browser would.
      // Electron takes no switches here, so the scripts and CI run Chrome.
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.args.push(
            '--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4',
          )
        }
        return launchOptions
      })
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
