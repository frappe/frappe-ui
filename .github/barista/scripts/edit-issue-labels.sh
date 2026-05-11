#!/usr/bin/env bash
# Adds/removes labels on an issue. Issue number is sourced from
# $BARISTA_ISSUE (set by the workflow) with a fallback to the event payload
# so this also works under workflow_dispatch where the payload lacks .issue.
#
# Usage:
#   ./edit-issue-labels.sh --add-label bug --add-label needs-repro
#   ./edit-issue-labels.sh --remove-label invalid

set -euo pipefail

ISSUE="${BARISTA_ISSUE:-}"
if ! [[ "$ISSUE" =~ ^[0-9]+$ ]]; then
  ISSUE=$(jq -r '.issue.number // empty' "${GITHUB_EVENT_PATH:?GITHUB_EVENT_PATH not set}")
fi
if ! [[ "$ISSUE" =~ ^[0-9]+$ ]]; then
  echo "Error: no issue number resolved (set BARISTA_ISSUE or use an event with .issue)" >&2
  exit 1
fi

ADD_LABELS=()
REMOVE_LABELS=()

while [[ $# -gt 0 ]]; do
  case $1 in
    --add-label)
      ADD_LABELS+=("$2")
      shift 2
      ;;
    --remove-label)
      REMOVE_LABELS+=("$2")
      shift 2
      ;;
    *)
      echo "Error: unknown argument (only --add-label and --remove-label are accepted)" >&2
      exit 1
      ;;
  esac
done

if [[ ${#ADD_LABELS[@]} -eq 0 && ${#REMOVE_LABELS[@]} -eq 0 ]]; then
  echo "Error: no labels supplied" >&2
  exit 1
fi

VALID_LABELS=$(gh label list --limit 500 --json name --jq '.[].name')

FILTERED_ADD=()
for label in "${ADD_LABELS[@]}"; do
  if echo "$VALID_LABELS" | grep -qxF "$label"; then
    FILTERED_ADD+=("$label")
  else
    echo "Skipping unknown label (does not exist in repo): $label" >&2
  fi
done

FILTERED_REMOVE=()
for label in "${REMOVE_LABELS[@]}"; do
  if echo "$VALID_LABELS" | grep -qxF "$label"; then
    FILTERED_REMOVE+=("$label")
  fi
done

if [[ ${#FILTERED_ADD[@]} -eq 0 && ${#FILTERED_REMOVE[@]} -eq 0 ]]; then
  exit 0
fi

GH_ARGS=("issue" "edit" "$ISSUE")
for label in "${FILTERED_ADD[@]}"; do
  GH_ARGS+=("--add-label" "$label")
done
for label in "${FILTERED_REMOVE[@]}"; do
  GH_ARGS+=("--remove-label" "$label")
done

gh "${GH_ARGS[@]}"

[[ ${#FILTERED_ADD[@]} -gt 0 ]] && echo "Added: ${FILTERED_ADD[*]}"
[[ ${#FILTERED_REMOVE[@]} -gt 0 ]] && echo "Removed: ${FILTERED_REMOVE[*]}"
exit 0
