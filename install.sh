#!/usr/bin/env bash
# Orange SDD — Install script.
#
# Usage:
#   ./install.sh --tool <opencode|claude-code|cursor|codex> [--target <path>] [--force] [--dry-run]
#   ./install.sh --target <path>     # auto-detects tool from existing dirs
#   ./install.sh                     # installs into current directory, auto-detect
#
# Examples:
#   ./install.sh --tool opencode --target ~/projects/my-app
#   ./install.sh --tool claude-code --target .
#
# Requires Node.js >= 18.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

TOOL=""
TARGET=""
EXTRA_ARGS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --tool)
      TOOL="$2"
      shift 2
      ;;
    --target)
      TARGET="$2"
      shift 2
      ;;
    --force|--dry-run)
      EXTRA_ARGS+=("$1")
      shift
      ;;
    -h|--help)
      grep '^#' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "Unknown flag: $1" >&2
      echo "Run with --help for usage." >&2
      exit 2
      ;;
  esac
done

# Default target = current directory.
if [[ -z "$TARGET" ]]; then
  TARGET="$(pwd)"
fi

# Resolve absolute target path.
TARGET="$(cd "$TARGET" 2>/dev/null && pwd || echo "$TARGET")"

# Auto-detect tool if not provided.
if [[ -z "$TOOL" ]]; then
  if [[ -d "$TARGET/.opencode" ]]; then
    TOOL="opencode"
    echo "[INFO] Detected opencode at $TARGET/.opencode"
  elif [[ -d "$TARGET/.claude" ]]; then
    TOOL="claude-code"
    echo "[INFO] Detected Claude Code at $TARGET/.claude"
  elif [[ -d "$TARGET/.cursor" ]]; then
    TOOL="cursor"
    echo "[INFO] Detected Cursor at $TARGET/.cursor"
  else
    echo "Error: could not auto-detect tool in $TARGET." >&2
    echo "Pass --tool <opencode|claude-code|cursor|codex>." >&2
    exit 2
  fi
fi

# Validate tool.
case "$TOOL" in
  opencode|claude-code|cursor|codex) ;;
  *)
    echo "Error: unknown tool \"$TOOL\". Allowed: opencode, claude-code, cursor, codex." >&2
    exit 2
    ;;
esac

if [[ ! -d "$SCRIPT_DIR/adapters/$TOOL" ]]; then
  echo "Error: adapter \"$TOOL\" not found at $SCRIPT_DIR/adapters/$TOOL." >&2
  exit 2
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Error: node is required (>= 18) and not on PATH." >&2
  exit 2
fi

echo "[INFO] Orange SDD installer"
echo "       tool   : $TOOL"
echo "       target : $TARGET"
echo "       extras : ${EXTRA_ARGS[*]:-none}"
echo ""

# Dispatch to Node installer.
cd "$SCRIPT_DIR"
node core/installer.mjs --tool "$TOOL" --target "$TARGET" "${EXTRA_ARGS[@]}"
