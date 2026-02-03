# Dynamic Rendering Test Plan

## ✅ Implementation Complete

Both article routes have been configured for dynamic rendering:
- `src/app/articles/[slug]/page.tsx` - ✅ Has `dynamic = 'force-dynamic'` and `revalidate = 0`
- `src/app/content/[slug]/page.tsx` - ✅ Has `dynamic = 'force-dynamic'` and `revalidate = 0`

## Test Plan

### 1. Verify Published Articles Display

**Test Published Articles:**
- Visit: `https://parentsimple.org/category/early-years`
- Visit: `https://parentsimple.org/category/middle-school`
- Verify: Articles display with featured images and HTML content

**Test Individual Articles:**
- Pick any published article slug from the database
- Visit: `https://parentsimple.org/articles/{slug}`
- Verify: Article renders with HTML from `html_body` field
- Verify: Featured image displays
- Verify: Meta tags are correct

### 2. Test Dynamic Rendering (New Article)

**Prerequisites:**
- Access to Publishare CMS
- Ability to create/publish a test article

**Steps:**
1. Create a new article in Publishare CMS with:
   - Title: "Test Dynamic Rendering Article"
   - Slug: "test-dynamic-rendering-article"
   - Content: Some test content
   - UX Category: Assign to "early-years" or "middle-school"
   - Status: Set to "published"

2. **Immediately** (without waiting for rebuild):
   - Visit: `https://parentsimple.org/articles/test-dynamic-rendering-article`
   - **Expected**: Article should display immediately
   - **If fails**: Article returns 404 or shows old content

3. Verify on Category Page:
   - Visit: `/category/early-years` or `/category/middle-school`
   - **Expected**: New article appears in the list
   - **If fails**: Article doesn't appear

### 3. Test Content Route

1. Create a test article that uses the `/content/[slug]` route
2. Publish the article
3. Visit: `https://parentsimple.org/content/{slug}`
4. **Expected**: Article displays immediately without rebuild

### 4. Verify No Caching Issues

**Test Cache Bypass:**
1. Publish an article
2. Visit the article page
3. Update the article content in CMS
4. Refresh the page (hard refresh: Cmd+Shift+R)
5. **Expected**: Updated content appears immediately
6. **If fails**: Old content still shows

### 5. Performance Check

**Verify Dynamic Rendering Performance:**
- Articles should load in < 2 seconds
- Database queries should be efficient
- No excessive API calls

## Success Criteria

✅ **All tests pass if:**
- New articles appear immediately after publishing (no rebuild needed)
- Updated articles show new content immediately
- Category pages show new articles immediately
- Both `/articles/[slug]` and `/content/[slug]` routes work
- No 404 errors for published articles
- HTML renders correctly from `html_body` field

## Troubleshooting

### If Articles Don't Appear Immediately:

1. **Check Route Configuration:**
   ```typescript
   // Should be in both files:
   export const dynamic = 'force-dynamic'
   export const revalidate = 0
   ```

2. **Check Database Query:**
   - Verify `getArticle()` filters by `status = 'published'`
   - Verify `getArticlesByCategory()` filters by `status = 'published'`
   - Check Supabase connection is working

3. **Check Vercel Deployment:**
   - Verify deployment is complete
   - Check Vercel logs for errors
   - Verify environment variables are set

4. **Check Article Status:**
   - Verify article is actually `published` in database
   - Verify UX category is assigned
   - Verify `html_body` field is populated

### Common Issues:

- **404 Error**: Article might not be published or slug is wrong
- **Old Content**: Browser cache - try hard refresh
- **No Articles on Category Page**: Check UX category assignment
- **Markdown Showing**: Verify `html_body` field is populated, not just `content`

## Test Results

**Date**: _______________
**Tester**: _______________

- [ ] Published articles display correctly
- [ ] New article appears immediately after publishing
- [ ] Updated article shows new content immediately
- [ ] Category pages show new articles
- [ ] Both routes (`/articles` and `/content`) work
- [ ] HTML renders correctly (not markdown)
- [ ] Performance is acceptable (< 2s load time)

**Notes:**
_________________________________________________
_________________________________________________
_________________________________________________


