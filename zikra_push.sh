#!/bin/bash
# Push all Zikra repos to GitHub
# Usage: bash /mnt/d/GetZikra/zikra_push.sh

set -e

REPOS=(
  "/mnt/d/GetZikra/zikra-lite"
  "/mnt/d/GetZikra/Zikra"
  "/mnt/d/GetZikra/zikra.dev"
)

for REPO in "${REPOS[@]}"; do
  echo ""
  echo "── Pushing $REPO ──"
  cd "$REPO"
  git pull --rebase origin main
  git push origin main
  echo "✓ $REPO pushed"
done

echo ""
echo "✓ All repos pushed"
