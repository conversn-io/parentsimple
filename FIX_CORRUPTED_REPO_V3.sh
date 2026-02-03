#!/bin/bash
# Fix Corrupted Git Repository - Version 3 (Preserve Working Files)
# This will rebuild the git repository while preserving all your working files

set -e

cd "/Users/funkyfortress/Documents/01-ALL DOCUMENTS/05 - Projects/CallReady/02-Expansion-Operations-Planning/02-Publisher-Platforms/04-ParentSimple"

echo "🔧 FIXING CORRUPTED GIT REPOSITORY (V3)"
echo "========================================"
echo ""

# Step 1: Kill any hung git processes
echo "1️⃣  Killing hung git processes..."
killall git 2>/dev/null || true
sleep 2

# Step 2: Remove the partial .git
echo "2️⃣  Cleaning up partial git directory..."
rm -rf .git
echo "   ✓ Cleaned up"

# Step 3: Re-initialize git
echo "3️⃣  Re-initializing git repository..."
git init -b main
echo "   ✓ Fresh git repository created with main branch"

# Step 4: Add remote
echo "4️⃣  Adding remote origin..."
git remote add origin https://github.com/conversn-io/parentsimple.git
echo "   ✓ Remote added"

# Step 5: Fetch from remote
echo "5️⃣  Fetching from remote..."
git fetch origin main
echo "   ✓ Fetched from remote (commit a4db81c)"

# Step 6: Set parent commit (makes our commit appear after remote's)
echo "6️⃣  Setting up branch to track remote..."
git reset origin/main
echo "   ✓ Branch 'main' now points to origin/main as base"

# Step 7: Show current state
echo "7️⃣  Repository state:"
git log --oneline -1
echo ""

# Step 8: Stage all working directory changes
echo "8️⃣  Staging all your working files..."
echo "   This includes:"
echo "   - 334 application files in src/"
echo "   - professional-advisor.jpg (1.6MB)"
echo "   - All modified components"
echo ""
git add src/ public/images/ -v 2>&1 | tail -10
echo ""
git status --short | wc -l | xargs -I {} echo "   ✓ {} files staged"
echo ""

# Step 9: Create the commit
echo "9️⃣  Creating commit with all restored files..."
git commit -m "fix: Restore complete ParentSimple application with width fixes

CRITICAL FIX: Complete application files restored after repository corruption.

This commit includes:
- All quiz pages and routes (life-insurance-ca, elite-university-readiness, etc.)
- Complete src/app/ directory structure
- All components, hooks, lib utilities
- Public images and assets
- Professional advisor image (1.6MB) at public/images/team/professional-advisor.jpg
- Meta CAPI integration with separate pixels for Life Insurance and College funnels
- Results page with agent assignment
- Width fixes: Consistent max-w-2xl throughout results page
- Compact notification bar matching landing page style
- Full-width 'What Happens Next' section (removed max-w-md constraint)

Fixes Vercel deployment error: Could not find pages or app directory

Total files: 335 files restored from Time Machine backup"

echo ""
echo "✅ REPOSITORY FIXED!"
echo "===================="
echo ""
git log --oneline -2
echo ""
echo "📤 Ready to push:"
echo "   git push origin main"
echo ""
echo "   (Clean linear history on top of a4db81c)"
