STAGED=$(git diff --cached --name-only --diff-filter=ACMR)
yarn format

git diff --exit-code $STAGED || {
  echo "✗ Staged files were formatted - review and commit again."
  exit 1
}