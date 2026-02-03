#!/bin/bash
# Manual Git Push - Run this in your terminal

cd "/Users/funkyfortress/Documents/01-ALL DOCUMENTS/05 - Projects/CallReady/02-Expansion-Operations-Planning/02-Publisher-Platforms/04-ParentSimple"

echo "🚀 Pushing ParentSimple application to GitHub..."
echo ""

# Kill any hung git processes
killall git 2>/dev/null || true
sleep 2

# Remove any lock files
rm -f .git/index.lock .git/HEAD.lock 2>/dev/null

# Verify commit is there
echo "📊 Current commit:"
git log --oneline -3
echo ""

echo "📤 Pushing to origin/main..."
echo "   (This may take 2-5 minutes for 334 files + 1.6MB image)"
echo ""

# Push with progress
git push origin main --progress

echo ""
echo "✅ Push complete!"
echo ""
echo "🔍 Verifying deployment..."
sleep 5
vercel ls --prod | head -10
echo ""
echo "🎯 Check your site at: https://parentsimple.org/quiz/life-insurance-ca/results"
