#!/usr/bin/env bash
# Orange Grove — Remote bootstrap.
#
# One-liner install when you do not have orange-grove cloned locally.
# Clones the repo shallow to a temp dir, runs install.sh, cleans up.
#
# Usage:
#   curl -sSL https://raw.githubusercontent.com/TanisJam/orange-grove/main/bootstrap.sh | bash -s -- --tool claude-code
#   curl -sSL https://raw.githubusercontent.com/TanisJam/orange-grove/main/bootstrap.sh | bash -s -- --tool opencode --target ~/myapp
#
# Override the source repo with ORANGE_GROVE_REPO env var:
#   ORANGE_GROVE_REPO=git@github.com:fork/orange-grove.git curl ... | bash -s -- --tool opencode
#
# Override the branch/tag with ORANGE_GROVE_REF (default: main):
#   ORANGE_GROVE_REF=v0.3.0 curl ... | bash -s -- --tool opencode
#
# All arguments after `--` are forwarded to install.sh verbatim.

set -euo pipefail

REPO="${ORANGE_GROVE_REPO:-https://github.com/TanisJam/orange-grove.git}"
REF="${ORANGE_GROVE_REF:-main}"

if ! command -v git >/dev/null 2>&1; then
  echo "Error: git is required to bootstrap Orange Grove." >&2
  exit 2
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Error: node (>= 18) is required." >&2
  exit 2
fi

TMPDIR="$(mktemp -d -t orange-sdd-XXXXXX)"
cleanup() { rm -rf "$TMPDIR"; }
trap cleanup EXIT

echo "[INFO] Cloning $REPO@$REF into $TMPDIR (shallow)..."
git clone --depth 1 --branch "$REF" --quiet "$REPO" "$TMPDIR"

echo "[INFO] Running installer with: $*"
"$TMPDIR/install.sh" "$@"

echo "[INFO] Bootstrap complete. Temp clone removed."
