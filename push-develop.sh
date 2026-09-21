#!/usr/bin/env bash
set -e

# Strictly push to develop branch only
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "develop" ]; then
  echo "Error: Current branch is $BRANCH, not develop. Aborting push to prevent accidental commits to other branches."
  exit 1
fi

COMMIT_MSG="${1:-feat: storefront update}"
git add .
git commit -m "$COMMIT_MSG" || echo "No changes to commit."
git push origin develop
echo "Pushed successfully to origin develop!"
