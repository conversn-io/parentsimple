#!/bin/bash

# Git Index Repair Script
# Use this when git index is corrupted or timing out

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

echo "🔧 Git Index Repair Tool"
echo "========================"
echo ""

# Check if we're in a git repo
if [ ! -d .git ]; then
  echo "❌ Not a git repository"
  exit 1
fi

echo "Current status:"
echo "  Index file: .git/index"
echo "  Size: $(ls -lh .git/index | awk '{print $5}')"
echo ""

# Method 1: Try to read the index with timeout
echo "1️⃣  Testing index file accessibility..."
if timeout 3 cat .git/index > /dev/null 2>&1; then
  echo "   ✅ Index file is readable"
else
  echo "   ❌ Index file times out when reading"
  echo ""
  echo "2️⃣  Attempting repair..."
  
  # Backup current index
  if [ -f .git/index ]; then
    echo "   Backing up current index..."
    cp .git/index .git/index.backup.$(date +%s) 2>/dev/null || true
  fi
  
  # Try to reset the index from HEAD
  echo "   Resetting index from HEAD..."
  git reset HEAD 2>&1 | head -5
  
  # If that fails, try to rebuild
  if [ $? -ne 0 ]; then
    echo "   Attempting to rebuild index..."
    rm -f .git/index
    git reset HEAD 2>&1 | head -5
  fi
fi

echo ""
echo "3️⃣  Testing git status..."
if timeout 5 git status --short > /dev/null 2>&1; then
  echo "   ✅ Git is working"
  git status --short | head -5
else
  echo "   ❌ Git still timing out"
  echo ""
  echo "4️⃣  Advanced repair options:"
  echo ""
  echo "   Option A: Remove and rebuild index"
  echo "   rm -f .git/index"
  echo "   git reset HEAD"
  echo ""
  echo "   Option B: Re-clone repository (last resort)"
  echo "   cd .."
  echo "   mv ParentSimple ParentSimple.backup"
  echo "   git clone <repository-url> ParentSimple"
  echo ""
  echo "   Option C: Check disk/filesystem health"
  echo "   diskutil verifyVolume /"
  echo "   fsck -y /dev/disk3s5"
fi

echo ""
echo "📋 Diagnostic complete"




