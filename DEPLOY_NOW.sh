#!/bin/bash
# Deploy ParentSimple to Production
# Run: bash DEPLOY_NOW.sh

set -e

cd "/Users/funkyfortress/Documents/01-ALL DOCUMENTS/05 - Projects/CallReady/02-Expansion-Operations-Planning/02-Publisher-Platforms/04-ParentSimple"

echo "🚀 Deploying ParentSimple to Production"
echo "========================================"
echo ""

# Kill any hung git processes
killall git 2>/dev/null || true
sleep 1

echo "📊 Current commit:"
git log -1 --oneline
echo ""

echo "📤 Pushing to GitHub (may take 2-3 minutes)..."
git push origin main --progress

echo ""
echo "✅ Push complete!"
echo ""
echo "🔄 Waiting 10 seconds for Vercel to detect changes..."
sleep 10

echo ""
echo "🌐 Checking Vercel deployments..."
vercel ls --prod 2>/dev/null | head -15 || echo "Install Vercel CLI: npm i -g vercel"

echo ""
echo "🎯 Your site should be live at:"
echo "   https://parentsimple.org/quiz/life-insurance-ca/results"
echo ""
echo "✨ Deployment complete!"
