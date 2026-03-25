#!/data/data/com.termux/files/usr/bin/bash
set -e

BRANCH="${1:-main}"
COMMIT_MSG="${2:-wire MCP runtime and safe mode execution}"

echo "[1/6] git status"
git status

echo "[2/6] git add ."
git add .

echo "[3/6] git commit"
git commit -m "$COMMIT_MSG" || echo "No changes to commit"

echo "[4/6] current branch"
git branch --show-current

echo "[5/6] remotes"
git remote -v

echo "[6/6] push -> origin/$BRANCH"
git push -u origin "$BRANCH"
