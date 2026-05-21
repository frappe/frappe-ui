#!/usr/bin/env bash
# Commits staged-or-unstaged changes on the barista working branch, pushes,
# and opens a DRAFT PR linked to the originating issue. Run once at the end
# of a /barista fix session.
#
# Refuses to touch files under a hardcoded denylist (workflows, app config,
# lockfiles, env files) even if the agent prompt was jailbroken into staging
# them. Refuses to run on any branch outside `barista/issue-<N>`.
#
# Usage:
#   ./open-pr.sh --title "<pr title>" --body-file <path>
#   ./open-pr.sh --title "<pr title>" --body "<inline body>"

set -euo pipefail

BRANCH="${BARISTA_BRANCH:?BARISTA_BRANCH not set}"
BASE="${BARISTA_BASE:?BARISTA_BASE not set}"
ISSUE="${BARISTA_ISSUE:?BARISTA_ISSUE not set}"

if [[ "$BRANCH" != barista/issue-* ]]; then
  echo "Error: refusing to push branch outside barista/issue-* namespace ($BRANCH)" >&2
  exit 1
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$CURRENT_BRANCH" != "$BRANCH" ]]; then
  echo "Error: HEAD is on '$CURRENT_BRANCH', expected '$BRANCH'" >&2
  exit 1
fi

TITLE=""
BODY=""
BODY_FILE=""
while [[ $# -gt 0 ]]; do
  case $1 in
    --title)     TITLE="${2:?--title requires a value}"; shift 2 ;;
    --body)      BODY="${2:?--body requires a value}";   shift 2 ;;
    --body-file) BODY_FILE="${2:?--body-file requires a path}"; shift 2 ;;
    *) echo "Error: unknown arg $1" >&2; exit 1 ;;
  esac
done

if [[ -z "$TITLE" ]]; then
  echo "Error: --title is required" >&2
  exit 1
fi
if [[ -z "$BODY" && -z "$BODY_FILE" ]]; then
  echo "Error: one of --body or --body-file is required" >&2
  exit 1
fi
if [[ -n "$BODY_FILE" && ! -f "$BODY_FILE" ]]; then
  echo "Error: body file not found: $BODY_FILE" >&2
  exit 1
fi

# Path denylist — barista must not touch these even if the prompt says to.
# Matches as fnmatch patterns against the path returned by `git diff --name-only`.
DENY=(
  '.github/*'
  'package.json'
  'package-lock.json'
  'pnpm-lock.yaml'
  'yarn.lock'
  '.env'
  '.env.*'
  '.changeset/config.json'
  'LICENSE*'
  'CODEOWNERS'
)

CHANGED=$(git status --porcelain | awk '{print $2}')
if [[ -z "$CHANGED" ]]; then
  echo "Error: no changes to commit" >&2
  exit 1
fi

while IFS= read -r path; do
  [[ -z "$path" ]] && continue
  for pattern in "${DENY[@]}"; do
    # shellcheck disable=SC2053
    if [[ "$path" == $pattern ]]; then
      echo "Error: refusing to commit change to denylisted path: $path (matches $pattern)" >&2
      exit 1
    fi
  done
done <<< "$CHANGED"

git add -A
git commit -m "barista: attempt fix for #${ISSUE}"

# Force-push is safe here: the branch namespace is barista-owned and the
# prepare-branch step resets it to base at the start of every run.
git push --force-with-lease origin "$BRANCH"

GH_ARGS=(
  pr create
  --draft
  --base "$BASE"
  --head "$BRANCH"
  --title "$TITLE"
)
if [[ -n "$BODY_FILE" ]]; then
  GH_ARGS+=(--body-file "$BODY_FILE")
else
  GH_ARGS+=(--body "$BODY")
fi

# If a PR already exists for this head (re-run), just print its URL — gh will
# error on duplicate, so check first.
EXISTING=$(gh pr list --head "$BRANCH" --state open --json url --jq '.[0].url // ""')
if [[ -n "$EXISTING" ]]; then
  echo "PR already open for $BRANCH: $EXISTING"
  echo "(force-push above updated the branch contents)"
  exit 0
fi

gh "${GH_ARGS[@]}"
