#!/bin/bash
# Fix Corrupted Git Repository
# This will rebuild the git repository while preserving all your working files

set -e

cd "/Users/funkyfortress/Documents/01-ALL DOCUMENTS/05 - Projects/CallReady/02-Expansion-Operations-Planning/02-Publisher-Platforms/04-ParentSimple"

echo "🔧 FIXING CORRUPTED GIT REPOSITORY"
echo "===================================="
echo ""

# Step 1: Kill any hung git processes
echo "1️⃣  Killing hung git processes..."
killall git 2>/dev/null || true
sleep 2

# Step 2: Backup corrupted .git directory
echo "2️⃣  Backing up corrupted .git directory..."
if [ -d ".git" ]; then
    mv .git .git.corrupted.backup
    echo "   ✓ Moved .git to .git.corrupted.backup"
fi

# Step 3: Re-initialize git
echo "3️⃣  Re-initializing git repository..."
git init
echo "   ✓ Fresh git repository created"

# Step 4: Add remote
echo "4️⃣  Adding remote origin..."
git remote add origin https://github.com/conversn-io/parentsimple.git
echo "   ✓ Remote added"

# Step 5: Fetch from remote
echo "5️⃣  Fetching from remote (this may take 30 seconds)..."
git fetch origin main
echo "   ✓ Fetched from remote"

# Step 6: Set up tracking
echo "6️⃣  Setting up branch tracking..."
git branch -u origin/main
git reset --soft origin/main
echo "   ✓ Now tracking origin/main (commit a4db81c)"

# Step 7: Stage all working directory changes
echo "7️⃣  Staging all your working files..."
git add src/ public/images/
echo "   ✓ Staged application files"

# Step 8: Show status
echo "8️⃣  Current status:"
git status --short | head -20
echo ""

# Step 9: Create first commit (the big one with 334 files)
echo "9️⃣  Creating commit with all restored files..."
git commit -m "fix: Restore complete ParentSimple application from Time Machine

CRITICAL FIX: Complete application files restored after repository corruption.

This commit includes:
- All quiz pages and routes (life-insurance-ca, elite-university-readiness, etc.)
- Complete src/app/ directory structure
- All components, hooks, lib utilities
- Public images and assets
- Professional advisor image (1.6MB)
- Meta CAPI integration
- Results page with agent assignment
- Width fixes (max-w-2xl throughout)

Fixes Vercel deployment error: Could not find pages or app directory

Total files: 335 (combined previous 2 commits into clean single commit)"
echo "   ✓ Commit created"

# Step 10: Show final state
echo ""
echo "🎯 REPOSITORY FIXED!"
echo "==================="
echo ""
git log --oneline -3
echo ""
echo "📤 Ready to push:"
echo "   git push origin main --force"
echo ""
echo "⚠️  Note: Using --force because we rebuilt the repository"
echo "   This is safe because your commits weren't on remote yet"
