# Sitemap Troubleshooting Guide

## ✅ Current Status

The sitemap is **live and accessible** at:
- https://parentsimple.org/sitemap.xml
- https://www.parentsimple.org/sitemap.xml

**Sitemap Stats:**
- Total URLs: ~165
- Includes: Static pages, categories, and all articles (both `/articles/[slug]` and root-level `/[slug]`)

## 🔍 If Sitemap "Couldn't Be Fetched"

### Common Causes:

1. **Timeout Issues** (FIXED)
   - Added 10-second timeout protection
   - Added caching (revalidates every hour)
   - Sitemap now fails gracefully if database query times out

2. **www vs non-www Redirect**
   - Both versions work, but use the canonical version in Search Console
   - Recommended: Use `https://parentsimple.org/sitemap.xml` (non-www)

3. **Google Search Console Specific Issues**
   - Sometimes GSC has temporary issues fetching sitemaps
   - Wait a few minutes and try again
   - Check GSC for specific error messages

### How to Submit Sitemap to Google Search Console:

1. **Go to Google Search Console**: https://search.google.com/search-console
2. **Select Property**: parentsimple.org (or www.parentsimple.org)
3. **Navigate to**: Sitemaps (left sidebar)
4. **Enter Sitemap URL**: `sitemap.xml` (just the path, not full URL)
5. **Click Submit**

**Important**: Use the non-www version if that's your preferred domain.

### Verification Steps:

1. **Test Sitemap Access**:
   ```bash
   curl -I https://parentsimple.org/sitemap.xml
   ```
   Should return: `HTTP/2 200`

2. **Validate Sitemap Format**:
   - Use: https://www.xml-sitemaps.com/validate-xml-sitemap.html
   - Or: https://validator.w3.org/

3. **Check Sitemap Content**:
   ```bash
   curl -sL https://parentsimple.org/sitemap.xml | head -50
   ```

### Recent Optimizations:

✅ Added timeout protection (10 seconds)  
✅ Added caching (1 hour revalidation)  
✅ Graceful error handling  
✅ Returns partial sitemap even if articles fail to load  

### If Still Having Issues:

1. **Check Vercel Logs**:
   ```bash
   vercel logs parentsimple.org --follow
   ```

2. **Verify Database Connection**:
   - Ensure Supabase credentials are set in Vercel
   - Check if database queries are timing out

3. **Test Sitemap Generation**:
   - The sitemap generates dynamically on each request
   - First request may be slower, subsequent requests are cached

4. **Check Sitemap Size**:
   - Current: ~165 URLs (well under 50,000 limit)
   - File size: ~35KB (well under 50MB limit)

## 📋 Sitemap Structure

The sitemap includes:
- ✅ Static pages (home, college-planning, consultation, articles, calculators)
- ✅ Category pages (`/category/[slug]`)
- ✅ Article pages (`/articles/[slug]`) - Priority 0.8
- ✅ Root-level article pages (`/[slug]`) - Priority 0.7

All URLs use the canonical domain: `https://parentsimple.org`

