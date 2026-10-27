import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'

// Fails a pull request when:
//   - it changes a shipped file and adds no changeset,
//   - a changeset names a package other than frappe-ui,
//   - a changeset asks for `minor` without the `release:minor` label,
//   - a changeset asks for `major`. v1 takes no major release from a PR.
//
// Shipped files are the `files` lists of frappe-ui and create-frappe-ui, plus
// the package.json of each. Markdown files are docs, so they do not count.
// create-frappe-ui has the same version as frappe-ui, so its changes take a
// frappe-ui changeset.
//
// Runs on Node 24 without an install: it uses only built-in modules.
//
// Inputs: the PR merge commit is checked out, so HEAD^1 is the base branch.
// LABELS is a JSON array of the PR's label names.

const PACKAGE = 'frappe-ui'
const MINOR_LABEL = 'release:minor'
// The `files` list of each package, split into included and excluded entries.
const ROOTS = ['.', 'packages/create-frappe-ui'].map((dir) => {
  const files: string[] = JSON.parse(
    readFileSync(path.join(dir, 'package.json'), 'utf8'),
  ).files
  return {
    dir,
    included: files.filter((entry) => !entry.startsWith('!')),
    excluded: files
      .filter((entry) => entry.startsWith('!'))
      .map((entry) => entry.slice(1)),
  }
})

const changes = execSync('git diff --name-status --no-renames HEAD^1 HEAD', {
  encoding: 'utf8',
})
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const [status, file] = line.split('\t')
    return { status, file }
  })

const labels: string[] = JSON.parse(process.env.LABELS ?? '[]')
const errors: string[] = []

const shipped = changes.filter(({ file }) => isShipped(file))
// Checks added and edited changesets. Only an added one covers this PR.
const changesets = changes.filter(
  ({ status, file }) =>
    status !== 'D' &&
    file.startsWith('.changeset/') &&
    file.endsWith('.md') &&
    file !== '.changeset/README.md',
)

if (shipped.length && !changesets.some(({ status }) => status === 'A')) {
  errors.push(
    [
      `This PR changes shipped files but adds no changeset:`,
      ...shipped.map(({ file }) => `  ${file}`),
      `Run \`yarn changeset\` and describe the change for app developers.`,
      `If apps see no change, run \`yarn changeset --empty\`.`,
      `See .claude/skills/changeset/SKILL.md.`,
    ].join('\n'),
  )
}

for (const { file } of changesets) {
  for (const [name, bump] of readReleases(file)) {
    if (name !== PACKAGE) {
      errors.push(`${file}: names "${name}". Name "${PACKAGE}" only.`)
    } else if (bump === 'minor' && !labels.includes(MINOR_LABEL)) {
      errors.push(
        `${file}: asks for a minor release. Add the "${MINOR_LABEL}" label, or use patch.`,
      )
    } else if (bump !== 'patch' && bump !== 'minor') {
      errors.push(
        `${file}: asks for "${bump}". Use patch, or minor with the "${MINOR_LABEL}" label. v1 takes no major release from a PR.`,
      )
    }
  }
}

if (errors.length) {
  for (const error of errors) {
    console.log(`::error::${error.replaceAll('\n', '%0A')}`)
  }
  process.exit(1)
}
console.log(
  changesets.length
    ? `Changesets OK: ${changesets.map(({ file }) => file).join(', ')}`
    : 'No shipped files changed. No changeset needed.',
)

/** Reads the `"package": bump` lines from a changeset's front matter. */
function readReleases(file: string): [string, string][] {
  const text = readFileSync(file, 'utf8')
  const match = text.match(/^---\r?\n([\s\S]*?)^---\s*$/m)
  if (match?.index !== 0) {
    errors.push(`${file}: has no front matter. Run \`yarn changeset\`.`)
    return []
  }
  return match[1]
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line) => {
      const release = line.match(/^\s*["']?([^"':]+)["']?\s*:\s*(\S+)\s*$/)
      if (!release) {
        errors.push(`${file}: cannot read the line "${line}".`)
        return null
      }
      return [release[1], release[2]] as [string, string]
    })
    .filter((release): release is [string, string] => release !== null)
}

function isShipped(file: string): boolean {
  if (file.endsWith('.md')) return false
  return ROOTS.some(({ dir, included, excluded }) => {
    const relative = path.posix.relative(dir, file)
    if (relative.startsWith('..')) return false
    if (relative === 'package.json') return true
    return (
      included.some(
        (entry) => relative === entry || relative.startsWith(`${entry}/`),
      ) &&
      // A pattern can name a directory, such as `**/stories`.
      !excluded.some(
        (pattern) =>
          path.posix.matchesGlob(relative, pattern) ||
          path.posix.matchesGlob(relative, `${pattern}/**`),
      )
    )
  })
}
