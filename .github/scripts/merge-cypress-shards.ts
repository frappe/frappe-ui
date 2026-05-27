import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, copyFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const shardsDir = 'coverage/cypress-shards'
const out = 'coverage/cypress'

if (!existsSync(shardsDir)) {
  console.log(`No ${shardsDir} — skipping cypress shard merge.`)
  process.exit(0)
}

const tmp = 'coverage/cypress-merge-input'
rmSync(tmp, { recursive: true, force: true })
rmSync(out, { recursive: true, force: true })
mkdirSync(tmp, { recursive: true })
mkdirSync(out, { recursive: true })

let copied = 0
for (const entry of readdirSync(shardsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const file = join(shardsDir, entry.name, 'coverage-final.json')
  if (existsSync(file)) {
    copyFileSync(file, join(tmp, `${entry.name}.json`))
    copied++
  }
}

if (copied === 0) {
  console.log('No cypress shard coverage files found.')
  process.exit(0)
}

execSync(`npx nyc merge ${tmp} ${join(out, 'coverage-final.json')}`, {
  stdio: 'inherit',
})

console.log(`Merged ${copied} cypress shards into ${out}/coverage-final.json.`)
