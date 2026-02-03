#!/bin/bash

set -e

echo "═══════════════════════════════════════════════════════════"
echo "🎯 Deploy: Funnel-Specific Meta Pixel Support"
echo "═══════════════════════════════════════════════════════════"
echo ""

cd "/Users/funkyfortress/Documents/01-ALL DOCUMENTS/05 - Projects/CallReady/02-Expansion-Operations-Planning/02-Publisher-Platforms/04-ParentSimple"

echo "1️⃣  Staging changes..."
git add src/lib/meta-capi-service.ts
git add src/app/api/leads/verify-otp-and-send-to-ghl/route.ts
git add META_CAPI_FUNNEL_CONFIG.md
git add setup-meta-capi-env.sh
git add DEPLOY_FUNNEL_PIXELS.sh

echo "✅ Files staged"
echo ""

echo "2️⃣  Creating commit..."
git commit -m "$(cat <<'EOF'
feat: Add funnel-specific Meta pixel support

- Modified meta-capi-service.ts to support multiple pixel IDs
- Added getPixelIdForFunnel() helper function
- Updated sendLeadEvent() to accept funnelType parameter
- Modified verify-otp route to pass funnelType to CAPI
- Added comprehensive configuration guide (META_CAPI_FUNNEL_CONFIG.md)
- Added setup script for environment variables

Environment variables:
- META_CAPI_TOKEN: Shared access token for all pixels
- META_PIXEL_ID_INSURANCE: Life insurance funnel (1207654221006842)
- META_PIXEL_ID_COLLEGE: College consulting funnel (TBD)
- META_PIXEL_ID: Optional fallback for other funnels

Pixel selection logic:
- Funnel type matching (insurance → META_PIXEL_ID_INSURANCE)
- Automatic fallback to META_PIXEL_ID if specific pixel not set
- Backward compatible with existing code

Closes #meta-capi-funnel-config
EOF
)"

echo "✅ Commit created"
echo ""

echo "3️⃣  Pushing to GitHub..."
git push origin main

echo "✅ Successfully pushed to GitHub!"
echo ""

echo "4️⃣  Deploying to Vercel..."
vercel --prod

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ DEPLOYMENT COMPLETE!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Verify environment variables are set in Vercel:"
echo "   vercel env ls | grep META"
echo ""
echo "2. Expected variables:"
echo "   ✅ META_CAPI_TOKEN"
echo "   ✅ META_PIXEL_ID_INSURANCE = 1207654221006842"
echo "   ⏳ META_PIXEL_ID_COLLEGE = (your college pixel)"
echo ""
echo "3. Run smoke test:"
echo "   node smoke-test-lead-conversion.js https://parentsimple.org"
echo ""
echo "4. Check logs for pixel selection:"
echo "   vercel logs https://parentsimple.org --since 5m | grep 'Meta CAPI'"
echo ""
echo "📖 Full guide: META_CAPI_FUNNEL_CONFIG.md"
echo ""
