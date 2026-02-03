#!/bin/bash
# Restore ParentSimple Application Files from Time Machine
# Run this in your terminal

set -e

TARGET_DIR="/Users/funkyfortress/Documents/01-ALL DOCUMENTS/05 - Projects/CallReady/02-Expansion-Operations-Planning/02-Publisher-Platforms/04-ParentSimple"

echo "🕐 Time Machine Recovery for ParentSimple"
echo "==========================================="
echo ""
echo "Target directory: $TARGET_DIR"
echo ""

# List available Time Machine snapshots
echo "📅 Available Time Machine snapshots:"
echo ""
tmutil listlocalsnapshotdates | tail -20
echo ""

echo "⚠️  IMPORTANT: We need to restore from BEFORE you ran 'git reset --hard'"
echo "   That was around: $(date '+%Y-%m-%d %H:%M')"
echo ""
echo "   Look for a snapshot from earlier today or yesterday"
echo ""
read -p "Enter the snapshot date/time to restore from (YYYY-MM-DD-HHMMSS): " SNAPSHOT
echo ""

if [ -z "$SNAPSHOT" ]; then
    echo "❌ No snapshot specified. Exiting."
    exit 1
fi

# Create a temporary restore location
RESTORE_TEMP="/tmp/parentsimple_restore_$(date +%s)"
mkdir -p "$RESTORE_TEMP"

echo "📦 Restoring from snapshot: $SNAPSHOT"
echo "   To temporary location: $RESTORE_TEMP"
echo ""

# Restore the src directory from Time Machine
tmutil restore -v "$TARGET_DIR/src" "$RESTORE_TEMP/src"

echo ""
echo "✅ Files restored to: $RESTORE_TEMP/src"
echo ""
echo "📊 Restored files:"
find "$RESTORE_TEMP/src" -type f | head -30
echo ""
echo "   Total files: $(find "$RESTORE_TEMP/src" -type f | wc -l)"
echo ""

# Now copy back to the target
echo "🔄 Copying restored files back to: $TARGET_DIR/src"
echo ""
read -p "   Continue with copy? (y/n): " CONFIRM

if [ "$CONFIRM" = "y" ]; then
    rsync -av --exclude='.DS_Store' "$RESTORE_TEMP/src/" "$TARGET_DIR/src/"
    echo ""
    echo "✅ Files copied successfully!"
    echo ""
    echo "📁 Current src/app structure:"
    ls -la "$TARGET_DIR/src/app/" | head -20
    echo ""
    echo "🎯 Next steps:"
    echo "   1. Verify files are present: ls -la src/app/quiz/"
    echo "   2. Add to git: git add src/"
    echo "   3. Commit: git commit -m 'Add complete application to repository'"
    echo "   4. Push: git push origin main"
    echo ""
else
    echo "❌ Copy cancelled. Files remain in: $RESTORE_TEMP"
    echo "   You can manually inspect them before copying."
fi

echo ""
echo "🧹 To clean up temp files later:"
echo "   rm -rf $RESTORE_TEMP"
