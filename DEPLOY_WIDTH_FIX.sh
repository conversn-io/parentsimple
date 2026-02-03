#!/bin/bash
# Deploy Width Fix to Production
# Run: bash DEPLOY_WIDTH_FIX.sh

set -e

cd "/Users/funkyfortress/Documents/01-ALL DOCUMENTS/05 - Projects/CallReady/02-Expansion-Operations-Planning/02-Publisher-Platforms/04-ParentSimple"

echo "🚀 Deploying Results Page Width Fix"
echo "====================================="
echo ""

# Kill any hung git processes
killall git 2>/dev/null || true
sleep 1

echo "📊 Commits ready to push:"
git log --oneline -3
echo ""

echo "📝 Latest change:"
echo "   - Fixed results page width (max-w-2xl everywhere)"
echo "   - Compact notification bar"
echo "   - Professional advisor image"
echo "   - Removed narrow max-w-md constraint"
echo ""

echo "📤 Pushing to GitHub..."
git push origin main --progress

echo ""
echo "✅ Push complete!"
echo ""
echo "🔄 Waiting for Vercel auto-deployment (10 seconds)..."
sleep 10

echo ""
echo "🎯 Your site will be live at:"
echo "   https://parentsimple.org/quiz/life-insurance-ca/results"
echo ""
echo "✨ Width fix deployed!"
