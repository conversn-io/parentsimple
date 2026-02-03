#!/bin/bash
# Manual Git Repository Fix and Push
# Run this in your local terminal (not in Cursor agent)

set -e

cd "/Users/funkyfortress/Documents/01-ALL DOCUMENTS/05 - Projects/CallReady/02-Expansion-Operations-Planning/02-Publisher-Platforms/04-ParentSimple"

echo "🔧 Fixing Git Repository..."

# Kill any hung git processes
killall git 2>/dev/null || true
sleep 2

# Remove all locks
rm -f .git/index.lock .git/HEAD.lock .git/refs/heads/*.lock 2>/dev/null || true

# Try to fetch from remote
echo "📥 Fetching from remote..."
git fetch origin main || {
    echo "⚠️ Fetch failed, trying to recover..."
    
    # If fetch fails, try to reset HEAD
    git symbolic-ref HEAD refs/heads/main
    git fetch origin main
}

# Reset to remote main (this will discard local corrupt commits)
echo "🔄 Resetting to origin/main..."
git reset --hard origin/main

# Now the repository should be clean
echo "✅ Repository reset to origin/main"

# Show current status
echo ""
echo "📊 Current status:"
git log --oneline -5
echo ""
git status

echo ""
echo "✨ Repository is now clean and ready!"
echo ""
echo "The latest commit from remote is now active."
echo "Your changes to AgentAssignmentPage.tsx are already pushed (commit a4db81c)."
echo ""
echo "To verify deployment, run: vercel ls --prod"
