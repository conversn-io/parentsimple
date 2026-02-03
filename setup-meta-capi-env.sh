#!/bin/bash

echo "═══════════════════════════════════════════════════════════"
echo "🎯 Meta CAPI Funnel-Specific Configuration Setup"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "This script will help you add the required environment variables"
echo "to Vercel for funnel-specific Meta pixel tracking."
echo ""
echo "You will need:"
echo "  1. META_CAPI_TOKEN (shared across all funnels)"
echo "  2. META_PIXEL_ID_INSURANCE (for life insurance funnel)"
echo "  3. META_PIXEL_ID_COLLEGE (for college consulting funnel)"
echo ""
read -p "Press Enter to continue..."

echo ""
echo "📋 Current Status Check"
echo "─────────────────────────────────────────────────────────"
vercel env ls 2>/dev/null | grep -E "META_CAPI|META_PIXEL" || echo "No Meta variables found"
echo ""

# Check if META_CAPI_TOKEN exists
if vercel env ls 2>/dev/null | grep -q "META_CAPI_TOKEN"; then
  echo "✅ META_CAPI_TOKEN already exists"
else
  echo ""
  echo "❌ META_CAPI_TOKEN not found"
  read -p "Do you want to add META_CAPI_TOKEN now? (y/n): " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Adding META_CAPI_TOKEN..."
    vercel env add META_CAPI_TOKEN production
  fi
fi

# Check if META_PIXEL_ID_INSURANCE exists
echo ""
if vercel env ls 2>/dev/null | grep -q "META_PIXEL_ID_INSURANCE"; then
  echo "✅ META_PIXEL_ID_INSURANCE already exists"
else
  echo "❌ META_PIXEL_ID_INSURANCE not found"
  read -p "Do you want to add META_PIXEL_ID_INSURANCE (1207654221006842) now? (y/n): " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Adding META_PIXEL_ID_INSURANCE..."
    echo "1207654221006842" | vercel env add META_PIXEL_ID_INSURANCE production
  fi
fi

# Check if META_PIXEL_ID_COLLEGE exists
echo ""
if vercel env ls 2>/dev/null | grep -q "META_PIXEL_ID_COLLEGE"; then
  echo "✅ META_PIXEL_ID_COLLEGE already exists"
else
  echo "❌ META_PIXEL_ID_COLLEGE not found"
  read -p "Do you have a College Pixel ID to add? (y/n): " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Adding META_PIXEL_ID_COLLEGE..."
    vercel env add META_PIXEL_ID_COLLEGE production
  else
    echo "⏭️  Skipping META_PIXEL_ID_COLLEGE (you can add it later)"
  fi
fi

# Optional: META_PIXEL_ID fallback
echo ""
if vercel env ls 2>/dev/null | grep -q "^META_PIXEL_ID "; then
  echo "✅ META_PIXEL_ID (fallback) already exists"
else
  echo "ℹ️  META_PIXEL_ID (fallback) not found"
  read -p "Do you want to add a fallback META_PIXEL_ID? (y/n): " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Adding META_PIXEL_ID..."
    vercel env add META_PIXEL_ID production
  else
    echo "⏭️  Skipping fallback pixel (not required)"
  fi
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ Configuration Complete"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📋 Final Status:"
vercel env ls 2>/dev/null | grep -E "META_CAPI|META_PIXEL" || echo "No Meta variables found"
echo ""
echo "🚀 Next Steps:"
echo "  1. Deploy to production: vercel --prod"
echo "  2. Run smoke test: node smoke-test-lead-conversion.js https://parentsimple.org"
echo "  3. Check logs: vercel logs https://parentsimple.org --since 5m | grep 'Meta CAPI'"
echo ""
echo "📖 For more info, see: META_CAPI_FUNNEL_CONFIG.md"
echo ""
