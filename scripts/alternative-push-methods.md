# Alternative Git Push Methods

When `git push` fails with signal 10 (bus error), try these alternatives:

## Method 1: GitHub CLI (Recommended)
```bash
# Install GitHub CLI if not installed
brew install gh

# Authenticate
gh auth login

# Push using GitHub CLI
gh repo sync
# OR
git push origin main --verbose
```

## Method 2: Create Patch and Apply via Web
```bash
# Create a patch file
git format-patch origin/main..HEAD

# Upload the .patch file via GitHub web interface
# Go to: https://github.com/conversn-io/parentsimple/compare
# Or use GitHub Desktop app
```

## Method 3: Force Garbage Collection
```bash
# Clean up repository
git gc --aggressive --prune=now

# Try push again
git push origin main
```

## Method 4: Push via SSH Instead of HTTPS
```bash
# Change remote to SSH
git remote set-url origin git@github.com:conversn-io/parentsimple.git

# Push
git push origin main
```

## Method 5: Use Vercel CLI to Deploy
```bash
# Deploy directly to Vercel (bypasses git push)
vercel --prod

# Or create a preview deployment
vercel
```

## Method 6: Manual File Upload
If all else fails:
1. Create a new branch on GitHub web interface
2. Upload the changed files directly via GitHub web UI
3. Create a pull request

## Current Issue: Signal 10 (Bus Error)
This typically indicates:
- Memory corruption
- Filesystem issues
- Corrupted git objects

**Recommended Fix:**
1. Try Method 3 (garbage collection) first
2. If that fails, use Method 1 (GitHub CLI)
3. Last resort: Method 5 (Vercel CLI direct deploy)









