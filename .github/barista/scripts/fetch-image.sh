#!/usr/bin/env bash
# Downloads a GitHub-hosted image attachment to /tmp and prints the local path.
# Restricted to github.com user-attachments and *.githubusercontent.com to
# prevent SSRF via arbitrary URLs in issue bodies.
#
# Usage: ./fetch-image.sh <url>
#        Read the printed path with the Read tool to view the image.

set -euo pipefail

URL="${1:?usage: fetch-image.sh <url>}"

case "$URL" in
  https://github.com/user-attachments/* | \
  https://user-images.githubusercontent.com/* | \
  https://private-user-images.githubusercontent.com/* | \
  https://avatars.githubusercontent.com/*)
    ;;
  *)
    echo "Error: only GitHub user-attachments and *.githubusercontent.com URLs are allowed" >&2
    echo "Got: $URL" >&2
    exit 1
    ;;
esac

HASH=$(printf '%s' "$URL" | shasum -a 256 | cut -c1-16)
EXT=$(printf '%s' "$URL" | grep -oE '\.(png|jpg|jpeg|gif|webp|svg)' | head -1 || true)
[[ -z "$EXT" ]] && EXT=".png"
OUT="/tmp/barista-img-${HASH}${EXT}"

if [[ ! -f "$OUT" ]]; then
  AUTH_ARGS=()
  if [[ -n "${GH_TOKEN:-}" ]]; then
    AUTH_ARGS=(-H "Authorization: Bearer $GH_TOKEN")
  elif [[ -n "${GITHUB_TOKEN:-}" ]]; then
    AUTH_ARGS=(-H "Authorization: Bearer $GITHUB_TOKEN")
  fi
  curl -fsSL --max-time 30 "${AUTH_ARGS[@]}" -o "$OUT" "$URL"
fi

echo "$OUT"
