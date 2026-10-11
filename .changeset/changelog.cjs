// Formats one CHANGELOG.md line per changeset:
//
//   - Checkbox: a checked box lightens on hover (fix). [#1186](…/pull/1186)
//
// The PR number comes from the commit that added the changeset. A squash merge
// puts it in the commit subject, such as "fix(Checkbox): … (#1186)". For other
// commits, the GitHub API gives the PR that merged the commit into main. A
// commit pushed to main without a PR gets no link. A failed git or GitHub
// lookup fails the version step.

const { execFileSync } = require('node:child_process')

const REPO = 'frappe/frappe-ui'
const REPO_URL = `https://github.com/${REPO}`

async function prNumber(commit) {
  if (!commit) return null
  const subject = execFileSync('git', ['log', '-1', '--format=%s', commit], {
    encoding: 'utf8',
  })
  return subject.match(/\(#(\d+)\)\s*$/)?.[1] ?? (await mergedPrNumber(commit))
}

async function mergedPrNumber(commit) {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    throw new Error(
      `Set GITHUB_TOKEN to find the PR for commit ${commit}. Its subject has no "(#N)".`,
    )
  }
  const url = `https://api.github.com/repos/${REPO}/commits/${commit}/pulls`
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  if (!response.ok) {
    throw new Error(
      `GitHub returned ${response.status} for ${url}: ${await response.text()}`,
    )
  }
  const pulls = await response.json()
  const merged = pulls
    .filter((pr) => pr.merged_at && pr.base.ref === 'main')
    .sort((a, b) => a.merged_at.localeCompare(b.merged_at))
  return merged[0] ? String(merged[0].number) : null
}

async function getReleaseLine(changeset) {
  const summary = changeset.summary.trim().replace(/\s+/g, ' ')
  if (!summary) return ''
  const pr = await prNumber(changeset.commit)
  return pr ? `- ${summary} [#${pr}](${REPO_URL}/pull/${pr})` : `- ${summary}`
}

// frappe-ui has no workspace packages that depend on it.
async function getDependencyReleaseLine() {
  return ''
}

module.exports = { getReleaseLine, getDependencyReleaseLine }
