import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, copyFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const merged = join(root, 'coverage/merged')
const final = join(root, 'coverage/final')
const vitestReport = join(root, 'coverage/vitest/coverage-final.json')
const cypressReport = join(root, 'coverage/cypress/coverage-final.json')

if (!existsSync(vitestReport) && !existsSync(cypressReport)) {
  console.error(
    'No coverage reports found. Run `yarn test:coverage` and/or `yarn test:cypress:coverage` first.',
  )
  process.exit(1)
}

rmSync(merged, { recursive: true, force: true })
rmSync(final, { recursive: true, force: true })
mkdirSync(merged, { recursive: true })

if (existsSync(vitestReport)) {
  copyFileSync(vitestReport, join(merged, 'vitest.json'))
} else {
  console.warn('Vitest coverage missing — merged report will reflect Cypress only.')
}

if (existsSync(cypressReport)) {
  copyFileSync(cypressReport, join(merged, 'cypress.json'))
} else {
  console.warn('Cypress coverage missing — merged report will reflect Vitest only.')
}

execSync(`npx nyc merge ${merged} ${join(merged, 'coverage-final.json')}`, {
  stdio: 'inherit',
})

execSync(
  `npx nyc report --reporter=lcov --reporter=text --reporter=text-summary -t ${merged} --report-dir ${final}`,
  { stdio: 'inherit' },
)

console.log(`\nMerged report: ${join(final, 'lcov-report/index.html')}`)
