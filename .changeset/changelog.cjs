// Formats one CHANGELOG.md line per changeset:
//
//   - Checkbox: a checked box lightens on hover (fix). [#1186](…/pull/1186)
//
// The PR number comes from the squash-merge subject of the commit that added
// the changeset, such as "fix(Checkbox): … (#1186)". A changeset without one
// gets no link.

const { execFileSync } = require('node:child_process')

const REPO_URL = 'https://github.com/frappe/frappe-ui'

function prNumber(commit) {
  if (!commit) return null
  try {
    const subject = execFileSync('git', ['log', '-1', '--format=%s', commit], {
      encoding: 'utf8',
    })
    return subject.match(/\(#(\d+)\)\s*$/)?.[1] ?? null
  } catch {
    return null
  }
}

async function getReleaseLine(changeset) {
  const summary = changeset.summary.trim().replace(/\s+/g, ' ')
  if (!summary) return ''
  const pr = prNumber(changeset.commit)
  return pr ? `- ${summary} [#${pr}](${REPO_URL}/pull/${pr})` : `- ${summary}`
}

// frappe-ui has no workspace packages that depend on it.
async function getDependencyReleaseLine() {
  return ''
}

module.exports = { getReleaseLine, getDependencyReleaseLine }
