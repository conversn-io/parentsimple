#!/bin/bash
# Quick Time Machine Restore

SNAPSHOT="2026-01-31-233753"
TARGET="/Users/funkyfortress/Documents/01-ALL DOCUMENTS/05 - Projects/CallReady/02-Expansion-Operations-Planning/02-Publisher-Platforms/04-ParentSimple/src"

echo "🕐 Restoring from Time Machine snapshot: $SNAPSHOT"
echo ""

# Enter Time Machine and navigate to the snapshot
tmutil restore -v "$TARGET"

echo ""
echo "✅ Restore complete!"
echo ""
echo "Verify files:"
ls -la src/app/quiz/ 2>/dev/null || echo "Quiz directory not found yet"
