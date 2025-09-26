#!/bin/sh
# Symlink the repository's git hooks into .git/hooks for local enforcement.
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$SCRIPT_DIR/.."

while [ ! -d "$REPO_ROOT/.git" ] && [ "$REPO_ROOT" != "/" ]; do
  REPO_ROOT="$(dirname "$REPO_ROOT")"
done

if [ ! -d "$REPO_ROOT/.git" ]; then
  echo "⚠️  .git directory not found. Run this script from inside a cloned repository." >&2
  exit 1
fi

HOOK_SOURCE="$SCRIPT_DIR/git-hooks/pre-commit"
HOOK_TARGET="$REPO_ROOT/.git/hooks/pre-commit"

mkdir -p "$(dirname "$HOOK_TARGET")"

if [ -e "$HOOK_TARGET" ] || [ -L "$HOOK_TARGET" ]; then
  echo "Updating existing pre-commit hook..."
  rm -f "$HOOK_TARGET"
fi

ln -s "$HOOK_SOURCE" "$HOOK_TARGET"
echo "Pre-commit hook installed. Type checks will run before each commit."
