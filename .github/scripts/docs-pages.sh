#!/usr/bin/env bash
set -euo pipefail

COMMAND="${1:?command is required}"
PAGES_DIR="${PAGES_DIR:-.gh-pages}"
PAGES_BRANCH="${PAGES_BRANCH:-gh-pages}"
PAGES_DOMAIN="${PAGES_DOMAIN:-ui.frappe.io}"

prepare_pages_worktree() {
  rm -rf "$PAGES_DIR"

  if git ls-remote --exit-code origin "$PAGES_BRANCH" >/dev/null 2>&1; then
    git fetch origin "$PAGES_BRANCH:refs/remotes/origin/$PAGES_BRANCH"
    git worktree add -B "$PAGES_BRANCH" "$PAGES_DIR" "origin/$PAGES_BRANCH"
    return
  fi

  git worktree add -B "$PAGES_BRANCH" "$PAGES_DIR" HEAD
  find "$PAGES_DIR" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
}

commit_and_push() {
  local message="$1"

  (
    cd "$PAGES_DIR"
    echo "$PAGES_DOMAIN" > CNAME
    touch .nojekyll
    git add -A

    if git diff --cached --quiet; then
      echo "No changes to publish"
      exit 0
    fi

    git config user.name "github-actions[bot]"
    git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
    git commit -m "$message"
    git push origin "$PAGES_BRANCH"
  )
}

deploy_root() {
  local build_dir="$1"
  local preview_tmp=''

  if [ -d "$PAGES_DIR/pr-preview" ]; then
    preview_tmp="$(mktemp -d)"
    mv "$PAGES_DIR/pr-preview" "$preview_tmp/pr-preview"
  fi

  find "$PAGES_DIR" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
  rsync -a "$build_dir"/ "$PAGES_DIR"/

  if [ -n "$preview_tmp" ] && [ -d "$preview_tmp/pr-preview" ]; then
    mv "$preview_tmp/pr-preview" "$PAGES_DIR/pr-preview"
  fi
}

deploy_preview() {
  local build_dir="$1"
  local pr_number="$2"
  local target_dir="$PAGES_DIR/pr-preview/pr-$pr_number"

  rm -rf "$target_dir"
  mkdir -p "$target_dir"
  rsync -a "$build_dir"/ "$target_dir"/
}

remove_preview() {
  local pr_number="$1"

  rm -rf "$PAGES_DIR/pr-preview/pr-$pr_number"
  rmdir "$PAGES_DIR/pr-preview" 2>/dev/null || true
}

case "$COMMAND" in
  deploy-root)
    BUILD_DIR="${2:?build directory is required}"
    [ -d "$BUILD_DIR" ] || {
      echo "Build directory not found: $BUILD_DIR" >&2
      exit 1
    }

    prepare_pages_worktree
    deploy_root "$BUILD_DIR"
    commit_and_push "deploy: update docs site"
    ;;
  deploy-preview)
    BUILD_DIR="${2:?build directory is required}"
    PR_NUMBER="${3:?pr number is required}"
    [ -d "$BUILD_DIR" ] || {
      echo "Build directory not found: $BUILD_DIR" >&2
      exit 1
    }

    prepare_pages_worktree
    deploy_preview "$BUILD_DIR" "$PR_NUMBER"
    commit_and_push "deploy: update docs preview for pr #$PR_NUMBER"
    ;;
  remove-preview)
    PR_NUMBER="${2:?pr number is required}"

    if ! git ls-remote --exit-code origin "$PAGES_BRANCH" >/dev/null 2>&1; then
      echo "No $PAGES_BRANCH branch found. Nothing to clean up."
      exit 0
    fi

    prepare_pages_worktree
    remove_preview "$PR_NUMBER"
    commit_and_push "deploy: remove docs preview for pr #$PR_NUMBER"
    ;;
  *)
    echo "Unknown command: $COMMAND" >&2
    exit 1
    ;;
esac
