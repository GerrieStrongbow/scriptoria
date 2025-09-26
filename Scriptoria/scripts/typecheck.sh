#!/bin/sh
# Run the TypeScript compiler in no-emit mode to ensure types stay aligned.
set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT/Scriptoria"

npx tsc --noEmit "$@"
