#!/bin/bash

echo "========================================="
echo "🚀 Deploying Tailwind v3 Downgrade Fix"
echo "========================================="
echo ""

cd "/Users/funkyfortress/Documents/01-ALL DOCUMENTS/05 - Projects/CallReady/02-Expansion-Operations-Planning/02-Publisher-Platforms/04-ParentSimple"

echo "1️⃣  Checking git status..."
git status --short

echo ""
echo "2️⃣  Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "3️⃣  Waiting 90 seconds for Vercel to build..."
    sleep 90
    echo ""
    echo "4️⃣  Checking deployment status..."
    vercel ls | head -15
    echo ""
    echo "✅ DONE! Check if latest deployment is ● Ready (green)"
else
    echo ""
    echo "❌ Push failed. Please check the error above."
    exit 1
fi
