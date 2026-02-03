#!/bin/bash
# Fix Corrupted Git Repository - Version 3
set -e
cd "/Users/funkyfortress/Documents/01-ALL DOCUMENTS/05 - Projects/CallReady/02-Expansion-Operations-Planning/02-Publisher-Platforms/04-ParentSimple"

echo "🔧 FIXING GIT REPOSITORY (V3)"
echo "=============================="
echo ""

killall git 2>/dev/null || true
sleep 1

echo "1️⃣  Removing partial git directory..."
rm -rf .git
echo "   ✓ Done"

echo "2️⃣  Initializing fresh repository..."
git init -b main
echo "   ✓ Done"

echo "3️⃣  Adding remote..."
git remote add origin https://github.com/conversn-io/parentsimple.git
echo "   ✓ Done"

echo "4️⃣  Fetching from remote..."
git fetch origin main
echo "   ✓ Done"

echo "5️⃣  Setting base commit..."
git reset origin/main
echo "   ✓ Branch now based on origin/main (a4db81c)"

echo "6️⃣  Staging all files..."
git add src/ public/images/
echo "   ✓ Staged"

echo "7️⃣  Creating commit..."
git commit -m "fix: Restore complete ParentSimple application with width fixes

Complete application restored after repository corruption.

Includes:
- All quiz pages and routes
- Meta CAPI integration
- Professional advisor image (1.6MB)
- Results page with max-w-2xl width fixes
- Compact notification bar
- 335 files total"

echo ""
echo "✅ FIXED!"
echo ""
git log --oneline -2
echo ""
echo "📤 Push with: git push origin main"
