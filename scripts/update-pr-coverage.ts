import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

type Summary = { lines: { pct: number } }

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
const fmtDelta = (h: number, b: number | undefined) => {
  if (b === undefined) return ''
  const d = h - b
  if (Math.abs(d) < 0.005) return ' (±0.00% vs `main`)'
  const sign = d > 0 ? '+' : ''
  return ` (${sign}${d.toFixed(2)}% vs \`main\`)`
}

const block = [
  MARKER_START,
  `Coverage: ${fmtPct(head.lines.pct)}${fmtDelta(head.lines.pct, base?.lines.pct)}`,
  MARKER_END,
].join('\n')

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
