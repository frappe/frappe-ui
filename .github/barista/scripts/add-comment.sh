#!/usr/bin/env bash
# Posts a single comment on the current issue. Issue number is sourced from
# $BARISTA_ISSUE with a fallback to the event payload.
#
# Usage:
#   ./add-comment.sh "Body text, multi-line OK"
#   ./add-comment.sh --file body.md

set -euo pipefail

ISSUE="${BARISTA_ISSUE:-}"
if ! [[ "$ISSUE" =~ ^[0-9]+$ ]]; then
  ISSUE=$(jq -r '.issue.number // empty' "${GITHUB_EVENT_PATH:?GITHUB_EVENT_PATH not set}")
fi
if ! [[ "$ISSUE" =~ ^[0-9]+$ ]]; then
  echo "Error: no issue number resolved" >&2
  exit 1
fi

if [[ "${1:-}" == "--file" ]]; then
  FILE="${2:?--file requires a path}"
  if [[ ! -f "$FILE" ]]; then
    echo "Error: file not found: $FILE" >&2
    exit 1
  fi
  gh issue comment "$ISSUE" --body-file "$FILE"
else
  BODY="${1:?body required}"
  gh issue comment "$ISSUE" --body "$BODY"
fi

echo "Commented on #$ISSUE"
