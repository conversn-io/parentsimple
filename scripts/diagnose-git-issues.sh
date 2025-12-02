#!/bin/bash

# Git Deployment Diagnostic Script
# Run this before deploying to identify blocking issues

echo "🔍 Git Deployment Diagnostics"
echo "=============================="
echo ""

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

# 1. Check Disk Space
echo "1️⃣  Disk Space Check"
echo "-------------------"
df -h . | tail -1 | awk '{print "Available: " $4 " (" $5 " used)"}'
AVAILABLE_SPACE=$(df -h . | tail -1 | awk '{print $4}' | sed 's/[^0-9.]//g')
if (( $(echo "$AVAILABLE_SPACE < 1" | bc -l 2>/dev/null || echo 0) )); then
  echo "⚠️  WARNING: Less than 1GB available - may cause git issues"
else
  echo "✅ Disk space OK"
fi
echo ""

# 2. Check for Git Lock Files
echo "2️⃣  Git Lock File Check"
echo "----------------------"
if [ -f .git/index.lock ]; then
  echo "❌ LOCK FILE FOUND: .git/index.lock"
  echo "   Created: $(stat -f "%Sm" .git/index.lock 2>/dev/null || stat -c "%y" .git/index.lock 2>/dev/null || echo 'unknown')"
  echo "   Size: $(ls -lh .git/index.lock | awk '{print $5}')"
  echo "   Action: Remove with 'rm -f .git/index.lock'"
else
  echo "✅ No lock file found"
fi
echo ""

# 3. Check for Running Git Processes
echo "3️⃣  Git Process Check"
echo "---------------------"
GIT_PROCESSES=$(ps aux | grep -i "git" | grep -v grep | grep -v "diagnose-git-issues" | wc -l | tr -d ' ')
if [ "$GIT_PROCESSES" -gt 0 ]; then
  echo "⚠️  Found $GIT_PROCESSES git-related process(es):"
  ps aux | grep -i "git" | grep -v grep | grep -v "diagnose-git-issues" | awk '{print "   PID: " $2 " - " $11 " " $12 " " $13}'
  echo "   Action: Review and kill if needed with 'kill <PID>'"
else
  echo "✅ No git processes running"
fi
echo ""

# 4. Check Git Repository Health
echo "4️⃣  Git Repository Health"
echo "-------------------------"
if git rev-parse --git-dir > /dev/null 2>&1; then
  echo "✅ Valid git repository"
  
  # Check for corruption
  if git fsck --no-progress > /dev/null 2>&1; then
    echo "✅ Repository integrity OK"
  else
    echo "❌ Repository corruption detected - run 'git fsck' for details"
  fi
  
  # Check remote connectivity
  REMOTE=$(git remote get-url origin 2>/dev/null || echo "none")
  echo "   Remote: $REMOTE"
else
  echo "❌ Not a valid git repository"
fi
echo ""

# 5. Check File System Permissions
echo "5️⃣  File System Permissions"
echo "---------------------------"
if [ -w .git ]; then
  echo "✅ .git directory is writable"
else
  echo "❌ .git directory is NOT writable"
fi

if [ -w .git/index ]; then
  echo "✅ .git/index is writable"
else
  echo "❌ .git/index is NOT writable"
fi
echo ""

# 6. Check Git Configuration
echo "6️⃣  Git Configuration"
echo "---------------------"
GIT_USER=$(git config user.name 2>/dev/null || echo "NOT SET")
GIT_EMAIL=$(git config user.email 2>/dev/null || echo "NOT SET")
echo "   User: $GIT_USER"
echo "   Email: $GIT_EMAIL"

if [ "$GIT_USER" = "NOT SET" ] || [ "$GIT_EMAIL" = "NOT SET" ]; then
  echo "⚠️  Git user/email not configured - may cause commit issues"
fi
echo ""

# 7. Check Pending Changes
echo "7️⃣  Pending Changes"
echo "------------------"
if git diff --quiet && git diff --cached --quiet; then
  echo "✅ No uncommitted changes"
else
  echo "📝 Uncommitted changes detected:"
  git status --short | head -10
  if [ $(git status --short | wc -l) -gt 10 ]; then
    echo "   ... and more"
  fi
fi
echo ""

# 8. Check Network Connectivity (for push)
echo "8️⃣  Network Connectivity"
echo "------------------------"
REMOTE_URL=$(git remote get-url origin 2>/dev/null)
if [ -n "$REMOTE_URL" ]; then
  if [[ "$REMOTE_URL" == *"github.com"* ]]; then
    if ping -c 1 github.com > /dev/null 2>&1; then
      echo "✅ Can reach github.com"
    else
      echo "❌ Cannot reach github.com - network issue"
    fi
  elif [[ "$REMOTE_URL" == *"gitlab.com"* ]]; then
    if ping -c 1 gitlab.com > /dev/null 2>&1; then
      echo "✅ Can reach gitlab.com"
    else
      echo "❌ Cannot reach gitlab.com - network issue"
    fi
  fi
else
  echo "⚠️  No remote configured"
fi
echo ""

# 9. Check for Large Files
echo "9️⃣  Large Files Check"
echo "---------------------"
LARGE_FILES=$(find . -type f -size +10M -not -path "./.git/*" -not -path "./node_modules/*" 2>/dev/null | head -5)
if [ -n "$LARGE_FILES" ]; then
  echo "⚠️  Large files found (>10MB):"
  echo "$LARGE_FILES" | while read file; do
    SIZE=$(du -h "$file" | cut -f1)
    echo "   $SIZE - $file"
  done
  echo "   Large files can slow down git operations"
else
  echo "✅ No unusually large files found"
fi
echo ""

# 10. Summary and Recommendations
echo "📋 Summary & Recommendations"
echo "============================="
ISSUES=0

if [ -f .git/index.lock ]; then
  echo "❌ Remove lock file: rm -f .git/index.lock"
  ISSUES=$((ISSUES + 1))
fi

if [ "$GIT_PROCESSES" -gt 0 ]; then
  echo "⚠️  Review running git processes"
  ISSUES=$((ISSUES + 1))
fi

if (( $(echo "$AVAILABLE_SPACE < 1" | bc -l 2>/dev/null || echo 0) )); then
  echo "❌ Free up disk space (need >1GB)"
  ISSUES=$((ISSUES + 1))
fi

if [ "$ISSUES" -eq 0 ]; then
  echo "✅ All checks passed - safe to deploy!"
  echo ""
  echo "Quick deploy command:"
  echo "  git add . && git commit -m 'your message' && git push origin main"
else
  echo "⚠️  Found $ISSUES potential issue(s) - resolve before deploying"
fi
echo ""

