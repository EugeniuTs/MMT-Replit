#!/bin/bash
# Run from Shell tab: bash push-to-github.sh <YOUR_GITHUB_TOKEN>
set -e

TOKEN=$1
if [ -z "$TOKEN" ]; then
  echo "Usage: bash push-to-github.sh <github_token>"
  exit 1
fi

REPO_URL="https://EugeniuTs:${TOKEN}@github.com/EugeniuTs/MMT-Replit.git"

echo "Creating clean git history (removing all previous commits)..."
cd /home/runner/workspace

# Create a fresh orphan branch with a single clean commit
git checkout --orphan clean-main
git add -A
git commit -m "Moldova Moto Tours — initial release"

# Push clean history to GitHub main branch
echo "Pushing to GitHub..."
git push "$REPO_URL" clean-main:main --force

echo ""
echo "Done! Clean code pushed to: https://github.com/EugeniuTs/MMT-Replit"

# Remove this script
rm -- "$0"
