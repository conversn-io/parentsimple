# Article Revalidation Setup

## Problem

When articles are published in Publishare CMS, they return 404 errors because Next.js hasn't regenerated the route. This happens because:

1. Next.js may cache routes statically
2. No on-demand revalidation is triggered when articles are published
3. The route needs to be regenerated after publishing

## Solution

Two approaches:

### Option 1: Force Dynamic Rendering (Recommended)

**File**: `src/app/articles/[slug]/page.tsx`

Added:
```typescript
export const dynamic = 'force-dynamic'
export const revalidate = 0
```

This forces Next.js to fetch from the database on every request, so no rebuild is needed.

**Pros:**
- ✅ No rebuild required
- ✅ Always shows latest content
- ✅ Simple solution

**Cons:**
- ⚠️ Slightly slower (fetches from DB on each request)
- ⚠️ No static caching benefits

### Option 2: On-Demand Revalidation

**Files Created:**
1. `src/app/api/revalidate/route.ts` - Revalidation endpoint
2. `src/app/api/articles/publish/route.ts` - Publish webhook

**Setup:**

1. **Add environment variable:**
```bash
REVALIDATION_SECRET=your-secret-key-here
```

2. **Trigger revalidation when publishing:**

In your CMS publish function, call:
```typescript
await fetch('/api/articles/publish', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    article_id: articleId,
    slug: articleSlug,
    secret: process.env.REVALIDATION_SECRET,
  }),
})
```

Or directly call revalidate:
```typescript
await fetch('/api/revalidate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    path: `/articles/${slug}`,
    secret: process.env.REVALIDATION_SECRET,
  }),
})
```

**Pros:**
- ✅ Static caching benefits
- ✅ On-demand updates
- ✅ Better performance

**Cons:**
- ⚠️ Requires webhook setup
- ⚠️ More complex

## Current Implementation

**Option 1 is implemented** - Articles now use dynamic rendering, so no rebuild is needed.

## Testing

1. Publish an article in CMS
2. Visit `/articles/[slug]` immediately
3. Should work without rebuild

## Next Steps

If you want to use Option 2 (on-demand revalidation) for better performance:

1. Remove `export const dynamic = 'force-dynamic'` from article page
2. Set up webhook in CMS to call `/api/articles/publish` when articles are published
3. Add `REVALIDATION_SECRET` to environment variables

---

**Status**: ✅ Option 1 implemented - No rebuild needed!

