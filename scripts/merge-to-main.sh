#!/bin/bash
# Merge feature/results-page-ab-test into main and push to origin
# Run from repo root: ./scripts/merge-to-main.sh

set -e
cd "$(dirname "$0")/.."

echo "Fetching latest from origin..."
git fetch origin

echo "Checking out main..."
git checkout main

echo "Pulling latest main..."
git pull origin main

echo "Merging feature/results-page-ab-test into main..."
git merge origin/feature/results-page-ab-test -m "Merge feature/results-page-ab-test: Life insurance CA funnel, Elite University Readiness A/B tests, Game Plan -c funnel"

echo "Pushing main to origin..."
git push origin main

echo "Done. Production (parentsimple.org) will deploy from main."
echo "Optional: switch back to feature branch: git checkout feature/results-page-ab-test"
