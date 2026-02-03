#!/bin/bash
# Final Deployment Script
# Run: bash FINAL_DEPLOY.sh

set -e

cd "/Users/funkyfortress/Documents/01-ALL DOCUMENTS/05 - Projects/CallReady/02-Expansion-Operations-Planning/02-Publisher-Platforms/04-ParentSimple"

echo "🚀 FINAL DEPLOYMENT TO PRODUCTION"
echo "=================================="
echo ""

# Clean up
killall git 2>/dev/null || true
sleep 1

echo "📊 Ready to push 2 commits:"
git log --oneline -3
echo ""
echo "   - 82ac0e0: Complete application (334 files)"
echo "   - b89436f: Width fix (max-w-2xl)"
echo ""

echo "📦 Checking repository size..."
du -sh .git
echo ""

echo "📤 Pushing to GitHub (this may take 2-5 minutes for large commit)..."
echo "   Tip: You'll see 'Enumerating objects', 'Counting objects', 'Writing objects'"
echo ""

# Push with verbose output
git push origin main --verbose --progress 2>&1

echo ""
echo "✅ PUSH COMPLETE!"
echo ""
echo "🔄 Vercel is now auto-deploying..."
echo "   Watch: https://vercel.com/conversn-io/parentsimple/deployments"
echo ""
echo "⏱️  Waiting 15 seconds for deployment to start..."
sleep 15

echo ""
echo "🌐 Your site should be deploying at:"
echo "   https://parentsimple.org/quiz/life-insurance-ca/results"
echo ""
echo "✨ Deployment complete! Check Vercel dashboard for status."
