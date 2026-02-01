# Git Index Repair Instructions

## Problem
Git index file is timing out with `mmap failed: Operation timed out` error.

## Solution Steps

### Step 1: Backup Current Index
```bash
cd '/Users/funkyfortress/Documents/01-ALL DOCUMENTS/05 - Projects/CallReady/02-Expansion-Operations-Planning/02-Publisher-Platforms/04-ParentSimple'
cp .git/index .git/index.backup.$(date +%s)
```

### Step 2: Remove Corrupted Index
```bash
rm -f .git/index
```

### Step 3: Rebuild Index from HEAD
```bash
git reset HEAD
```

### Step 4: Verify Git Works
```bash
git status
```

## Alternative: If Above Doesn't Work

### Option A: Reset to Last Known Good State
```bash
# Remove index
rm -f .git/index

# Reset to last commit
git reset --hard HEAD

# Re-add all files
git add .
```

### Option B: Check Filesystem Health
```bash
# Check disk health (macOS)
diskutil verifyVolume /

# If errors found, repair:
diskutil repairVolume /
```

### Option C: Move Repository (If on Network Drive)
If the repository is on a network drive or external drive with issues:
```bash
# Move to local drive
mv '/Users/funkyfortress/Documents/01-ALL DOCUMENTS/05 - Projects/CallReady/02-Expansion-Operations-Planning/02-Publisher-Platforms/04-ParentSimple' ~/temp-parentsimple

# Then move back after fixing
```

### Option D: Re-clone (Last Resort)
```bash
cd '/Users/funkyfortress/Documents/01-ALL DOCUMENTS/05 - Projects/CallReady/02-Expansion-Operations-Planning/02-Publisher-Platforms'
mv 04-ParentSimple 04-ParentSimple.backup
git clone https://github.com/conversn-io/parentsimple.git 04-ParentSimple
# Then copy over any uncommitted changes from backup
```

## Prevention

1. **Regular Git Maintenance**:
   ```bash
   git gc --aggressive --prune=now
   ```

2. **Monitor Disk Health**:
   - Check disk space regularly
   - Monitor disk I/O errors
   - Use local drives for git repos when possible

3. **Use Git Config**:
   ```bash
   # Increase buffer size (already set)
   git config http.postBuffer 524288000
   
   # Use filesystem cache
   git config core.fscache true
   ```

## Current Status
- Index file: `.git/index` (46KB) - **TIMING OUT**
- Disk space: 94GB available ✅
- No lock files ✅
- Filesystem: Possible I/O issues ⚠️



