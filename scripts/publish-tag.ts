import { execSync } from 'node:child_process'
import { appendFileSync, readFileSync } from 'node:fs'

// Decides whether the publish workflow should publish, and under which
// npm dist-tag, based on the current vs previous package.json version.
//
// Mapping (prerelease identifier becomes the dist-tag):
//   1.0.0         → latest
//   1.0.0-beta.3  → beta
//   1.0.0-rc.1    → rc
//   1.0.0-alpha.0 → alpha
//
// Emits GitHub Actions outputs to $GITHUB_OUTPUT:
//   changed=true|false
//   tag=<dist-tag>     (only when changed)
//   version=<x.y.z>    (only when changed)

const PRERELEASE_RE = /^\d+\.\d+\.\d+-([a-zA-Z][a-zA-Z0-9]*)(?:\.\d+)?$/
const STABLE_RE = /^\d+\.\d+\.\d+$/

function distTag(version: string): string {
  const prerelease = version.match(PRERELEASE_RE)
  if (prerelease) return prerelease[1]
  if (STABLE_RE.test(version)) return 'latest'
  throw new Error(`Unrecognized version format: ${version}`)
}

function readPackageVersion(source: 'current' | 'previous'): string {
  const json =
    source === 'current'
      ? readFileSync('package.json', 'utf8')
      : execSync('git show HEAD~1:package.json', { encoding: 'utf8' })
  return JSON.parse(json).version as string
}

const oldVersion = readPackageVersion('previous')
const newVersion = readPackageVersion('current')

const outputs: Record<string, string> = {}
if (oldVersion === newVersion) {
  console.log(`Version unchanged (${newVersion}), skipping publish.`)
  outputs.changed = 'false'
} else {
  const tag = distTag(newVersion)
  console.log(`Version changed: ${oldVersion} → ${newVersion} (dist-tag: ${tag})`)
  outputs.changed = 'true'
  outputs.tag = tag
  outputs.version = newVersion
}

const githubOutput = process.env.GITHUB_OUTPUT
if (githubOutput) {
  for (const [key, value] of Object.entries(outputs)) {
    appendFileSync(githubOutput, `${key}=${value}\n`)
  }
}
