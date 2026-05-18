#!/usr/bin/env bash
# Read-only `gh` wrapper. Restricts subcommands and flags so the agent
# cannot mutate state via this script. Write operations live in
# sibling scripts (edit-issue-labels.sh, add-comment.sh) with their own
# allowlists.
#
# Usage:
#   ./gh.sh issue view 123
#   ./gh.sh issue view 123 --comments
#   ./gh.sh issue list --state open --limit 20
#   ./gh.sh search issues "query" --limit 10
#   ./gh.sh label list --limit 100
#   ./gh.sh pr view 123
#   ./gh.sh pr view 123 --comments
#   ./gh.sh pr diff 123
#   ./gh.sh pr checks 123
#   ./gh.sh pr status
#   ./gh.sh release list --limit 5
#   ./gh.sh release view <tag>

set -euo pipefail

export GH_HOST=github.com

REPO="${GH_REPO:-${GITHUB_REPOSITORY:-}}"
if [[ -z "$REPO" || "$REPO" == */*/* || "$REPO" != */* ]]; then
  echo "Error: GH_REPO or GITHUB_REPOSITORY must be set to owner/repo format" >&2
  exit 1
fi
export GH_REPO="$REPO"

ALLOWED_FLAGS=(--comments --state --limit --label)
FLAGS_WITH_VALUES=(--state --limit --label)

SUB1="${1:-}"
SUB2="${2:-}"
CMD="$SUB1 $SUB2"
case "$CMD" in
  "issue view"|"issue list"|"search issues"|"label list"|"pr view"|"pr diff"|"pr checks"|"pr status"|"release list"|"release view")
    ;;
  *)
    echo "Error: only 'issue view', 'issue list', 'search issues', 'label list', 'pr view', 'pr diff', 'pr checks', 'pr status', 'release list', 'release view' are allowed" >&2
    exit 1
    ;;
esac

shift 2

POSITIONAL=()
FLAGS=()
skip_next=false
for arg in "$@"; do
  if [[ "$skip_next" == true ]]; then
    FLAGS+=("$arg")
    skip_next=false
  elif [[ "$arg" == -* ]]; then
    flag="${arg%%=*}"
    matched=false
    for allowed in "${ALLOWED_FLAGS[@]}"; do
      if [[ "$flag" == "$allowed" ]]; then
        matched=true
        break
      fi
    done
    if [[ "$matched" == false ]]; then
      echo "Error: only --comments, --state, --limit, --label flags are allowed" >&2
      exit 1
    fi
    FLAGS+=("$arg")
    if [[ "$arg" != *=* ]]; then
      for vflag in "${FLAGS_WITH_VALUES[@]}"; do
        if [[ "$flag" == "$vflag" ]]; then
          skip_next=true
          break
        fi
      done
    fi
  else
    POSITIONAL+=("$arg")
  fi
done

if [[ "$CMD" == "search issues" ]]; then
  QUERY="${POSITIONAL[0]:-}"
  QUERY_LOWER=$(echo "$QUERY" | tr '[:upper:]' '[:lower:]')
  if [[ "$QUERY_LOWER" == *"repo:"* || "$QUERY_LOWER" == *"org:"* || "$QUERY_LOWER" == *"user:"* ]]; then
    echo "Error: search query must not contain repo:, org:, or user: qualifiers" >&2
    exit 1
  fi
  gh "$SUB1" "$SUB2" "$QUERY" --repo "$REPO" "${FLAGS[@]}"
elif [[ "$CMD" == "issue view" || "$CMD" == "pr view" || "$CMD" == "pr diff" || "$CMD" == "pr checks" ]]; then
  if [[ ${#POSITIONAL[@]} -ne 1 ]] || ! [[ "${POSITIONAL[0]}" =~ ^[0-9]+$ ]]; then
    echo "Error: $CMD requires exactly one numeric number" >&2
    exit 1
  fi
  gh "$SUB1" "$SUB2" "${POSITIONAL[0]}" "${FLAGS[@]}"
elif [[ "$CMD" == "release view" ]]; then
  if [[ ${#POSITIONAL[@]} -ne 1 ]] || ! [[ "${POSITIONAL[0]}" =~ ^[A-Za-z0-9._-]+$ ]]; then
    echo "Error: $CMD requires exactly one tag (alphanumerics, dot, dash, underscore)" >&2
    exit 1
  fi
  gh "$SUB1" "$SUB2" "${POSITIONAL[0]}" "${FLAGS[@]}"
else
  if [[ ${#POSITIONAL[@]} -ne 0 ]]; then
    echo "Error: this subcommand does not accept positional arguments" >&2
    exit 1
  fi
  gh "$SUB1" "$SUB2" "${FLAGS[@]}"
fi
