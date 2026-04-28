import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

type Metric = 'lines' | 'statements' | 'functions' | 'branches'
type Summary = Record<Metric, { pct: number; covered: number; total: number }>

const PR_NUMBER = process.env.PR_NUMBER
const REPO = process.env.GITHUB_REPOSITORY
const HEAD_SUMMARY = 'coverage/final/coverage-summary.json'
const BASE_SUMMARY = 'coverage-baseline/coverage-summary.json'
const MARKER_START = '<!-- coverage-report:start -->'
const MARKER_END = '<!-- coverage-report:end -->'

if (!PR_NUMBER) {
  console.log('No PR_NUMBER — skipping PR description update.')
  process.exit(0)
}
if (!existsSync(HEAD_SUMMARY)) {
  console.error(`Missing ${HEAD_SUMMARY}.`)
  process.exit(1)
}

const head = JSON.parse(readFileSync(HEAD_SUMMARY, 'utf8')).total as Summary
const base = existsSync(BASE_SUMMARY)
  ? (JSON.parse(readFileSync(BASE_SUMMARY, 'utf8')).total as Summary)
  : null

const fmtPct = (n: number) => `${n.toFixed(2)}%`
const fmtDelta = (head: number, base: number | undefined) => {
  if (base === undefined) return '—'
  const d = head - base
  if (Math.abs(d) < 0.005) return '±0.00%'
  const sign = d > 0 ? '+' : ''
  return `${sign}${d.toFixed(2)}%`
}

const rows: Array<[string, Metric]> = [
  ['Lines', 'lines'],
  ['Statements', 'statements'],
  ['Functions', 'functions'],
  ['Branches', 'branches'],
]

const lines = [
  MARKER_START,
  '## Coverage',
  '',
  '| Metric     | Coverage         | Δ vs `main` |',
  '| ---------- | ---------------- | ----------- |',
  ...rows.map(([label, key]) => {
    const h = head[key]
    const b = base?.[key]
    const cov = `${fmtPct(h.pct)} (${h.covered}/${h.total})`
    return `| ${label.padEnd(10)} | ${cov.padEnd(16)} | ${fmtDelta(h.pct, b?.pct).padEnd(11)} |`
  }),
  '',
  base
    ? '_Baseline pulled from the latest successful `main` run._'
    : '_No baseline yet — first run on `main` will populate the delta._',
  MARKER_END,
]

const block = lines.join('\n')

const currentBody = execSync(
  `gh pr view ${PR_NUMBER} --repo ${REPO} --json body --jq .body`,
  { encoding: 'utf8' },
)

let newBody: string
if (currentBody.includes(MARKER_START) && currentBody.includes(MARKER_END)) {
  newBody = currentBody.replace(
    new RegExp(`${MARKER_START}[\\s\\S]*?${MARKER_END}`),
    block,
  )
} else {
  newBody = `${currentBody.trimEnd()}\n\n${block}\n`
}

writeFileSync('pr-body.md', newBody)
execSync(`gh pr edit ${PR_NUMBER} --repo ${REPO} --body-file pr-body.md`, {
  stdio: 'inherit',
})

console.log('PR body updated with coverage block.')
