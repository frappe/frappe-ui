#!/usr/bin/env bash
# Reads the claude-code-action execution file and appends a one-line
# stats footer to barista's most recent comment on the issue.
#
# Expected env:
#   EXECUTION_FILE  — path to action's JSON output
#   ISSUE_NUMBER    — issue we're triaging
#   REPO            — owner/repo
#   GH_TOKEN        — barista app token (must be able to PATCH the bot's own comment)
#
# Idempotent: re-running won't double-append because we check for the
# <!-- barista-stats --> marker and replace it.

set -euo pipefail

: "${EXECUTION_FILE:?EXECUTION_FILE not set}"
: "${ISSUE_NUMBER:?ISSUE_NUMBER not set}"
: "${REPO:?REPO not set}"

if [[ ! -f "$EXECUTION_FILE" ]]; then
  echo "No execution file at $EXECUTION_FILE — skipping stats footer." >&2
  exit 0
fi

# Sum usage across all turns + grab final-turn totals defensively.
INPUT_TOKENS=$(jq '[.. | objects | .usage? | .input_tokens? // 0] | add' "$EXECUTION_FILE" 2>/dev/null || echo 0)
OUTPUT_TOKENS=$(jq '[.. | objects | .usage? | .output_tokens? // 0] | add' "$EXECUTION_FILE" 2>/dev/null || echo 0)
CACHE_READ=$(jq '[.. | objects | .usage? | .cache_read_input_tokens? // 0] | add' "$EXECUTION_FILE" 2>/dev/null || echo 0)
CACHE_CREATE=$(jq '[.. | objects | .usage? | .cache_creation_input_tokens? // 0] | add' "$EXECUTION_FILE" 2>/dev/null || echo 0)

# Final-turn-style totals (action's result turn)
TOTAL_COST=$(jq 'first(.. | objects | (.total_cost_usd? // empty))' "$EXECUTION_FILE" 2>/dev/null || echo null)
DURATION_MS=$(jq 'first(.. | objects | (.duration_ms? // empty))' "$EXECUTION_FILE" 2>/dev/null || echo 0)

MODEL=$(jq -r 'first(.. | objects | (.model? // empty)) // "claude"' "$EXECUTION_FILE" 2>/dev/null || echo claude)

# Format token counts as k (1000s): <1000 → as-is, 1000-9999 → X.Xk, ≥10000 → Xk
fmt_k() {
  local n="${1:-0}"
  [[ "$n" =~ ^[0-9]+$ ]] || { echo "0"; return; }
  if   (( n < 1000 ));  then echo "$n"
  elif (( n < 10000 )); then awk -v n="$n" 'BEGIN { printf "%.1fk", n/1000 }'
  else                       awk -v n="$n" 'BEGIN { printf "%dk", int((n + 500) / 1000) }'
  fi
}
INPUT_FMT=$(fmt_k "$INPUT_TOKENS")
OUTPUT_FMT=$(fmt_k "$OUTPUT_TOKENS")
CACHE_READ_FMT=$(fmt_k "$CACHE_READ")

# Format duration
if [[ "$DURATION_MS" =~ ^[0-9]+$ ]] && (( DURATION_MS > 0 )); then
  DURATION_S=$(( DURATION_MS / 1000 ))
  DURATION_FMT="${DURATION_S}s"
else
  DURATION_FMT="?"
fi

# Format cost
if [[ "$TOTAL_COST" != "null" && -n "$TOTAL_COST" ]]; then
  COST_FMT=$(printf '$%.3f' "$TOTAL_COST" 2>/dev/null || echo "?")
else
  COST_FMT="—"
fi

# Find barista's most recent comment on this issue
COMMENT_ID=$(gh api "repos/$REPO/issues/$ISSUE_NUMBER/comments" --paginate \
  --jq '[.[] | select(.user.type == "Bot" and (.user.login | startswith("barista")))] | sort_by(.created_at) | last | .id // empty')

if [[ -z "$COMMENT_ID" ]]; then
  echo "No barista comment found on #$ISSUE_NUMBER — nothing to append stats to."
  exit 0
fi

CURRENT_BODY=$(gh api "repos/$REPO/issues/comments/$COMMENT_ID" --jq '.body')

# Strip any pre-existing barista stats footer so re-runs replace rather than stack.
STRIPPED=$(printf '%s' "$CURRENT_BODY" | awk '
  /<!-- barista-stats -->/ { found=1 }
  !found { print }
')

# Trim trailing whitespace
STRIPPED=$(printf '%s' "$STRIPPED" | sed -e 's/[[:space:]]*$//')

FOOTER=$(cat <<EOF

<!-- barista-stats -->
<sub><i>barista · ${MODEL} · ${INPUT_FMT} in / ${OUTPUT_FMT} out · ${CACHE_READ_FMT} cached · ${DURATION_FMT} · ${COST_FMT}</i></sub>
EOF
)

NEW_BODY="${STRIPPED}
${FOOTER}"

# PATCH the comment via JSON input on stdin (handles newlines / special chars safely)
jq -n --arg body "$NEW_BODY" '{body: $body}' \
  | gh api -X PATCH "repos/$REPO/issues/comments/$COMMENT_ID" --input - > /dev/null

echo "Appended stats footer to comment $COMMENT_ID on #$ISSUE_NUMBER"
