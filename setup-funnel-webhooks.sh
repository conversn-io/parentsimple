#!/bin/bash

# ParentSimple Funnel-Specific Webhook Setup
# Run this script to configure funnel-specific Zapier webhooks in Vercel

set -e

echo "🔧 ParentSimple Funnel-Specific Webhook Setup"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found. Please install it first:${NC}"
    echo "   npm install -g vercel"
    exit 1
fi

echo -e "${GREEN}✅ Vercel CLI found${NC}"
echo ""

# Step 1: Remove old generic webhook variable
echo "📝 Step 1: Removing old generic webhook variable..."
echo ""
echo "Attempting to remove: PARENTSIMPLE_ZAPIER_WEBHOOK"

if vercel env rm PARENTSIMPLE_ZAPIER_WEBHOOK production 2>/dev/null; then
    echo -e "${GREEN}✅ Removed from Production${NC}"
else
    echo -e "${YELLOW}⚠️  Variable not found in Production (may already be removed)${NC}"
fi

if vercel env rm PARENTSIMPLE_ZAPIER_WEBHOOK preview 2>/dev/null; then
    echo -e "${GREEN}✅ Removed from Preview${NC}"
else
    echo -e "${YELLOW}⚠️  Variable not found in Preview${NC}"
fi

if vercel env rm PARENTSIMPLE_ZAPIER_WEBHOOK development 2>/dev/null; then
    echo -e "${GREEN}✅ Removed from Development${NC}"
else
    echo -e "${YELLOW}⚠️  Variable not found in Development${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 2: Add Life Insurance CA Zapier webhook
echo "📝 Step 2: Adding Life Insurance CA Zapier webhook..."
echo ""
echo "Variable: PARENTSIMPLE_LIFE_INSURANCE_ZAPIER_WEBHOOK"
echo "Default: https://services.leadconnectorhq.com/hooks/rqTRxGq1yRvvDT6axp0M/webhook-trigger/ghPPPrV6ET9lzJ20bSlx"
echo ""

read -p "Enter Life Insurance CA Zapier webhook URL (or press Enter for default): " LIFE_INS_WEBHOOK

if [ -z "$LIFE_INS_WEBHOOK" ]; then
    LIFE_INS_WEBHOOK="https://services.leadconnectorhq.com/hooks/rqTRxGq1yRvvDT6axp0M/webhook-trigger/ghPPPrV6ET9lzJ20bSlx"
    echo -e "${YELLOW}Using default webhook URL${NC}"
fi

echo ""
echo "Adding to Vercel environments..."

# Add to all environments
echo "$LIFE_INS_WEBHOOK" | vercel env add PARENTSIMPLE_LIFE_INSURANCE_ZAPIER_WEBHOOK production
echo "$LIFE_INS_WEBHOOK" | vercel env add PARENTSIMPLE_LIFE_INSURANCE_ZAPIER_WEBHOOK preview
echo "$LIFE_INS_WEBHOOK" | vercel env add PARENTSIMPLE_LIFE_INSURANCE_ZAPIER_WEBHOOK development

echo -e "${GREEN}✅ Life Insurance CA webhook configured${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 3: Add Elite University Zapier webhook (optional)
echo "📝 Step 3: Adding Elite University Zapier webhook (optional)..."
echo ""
echo "Variable: PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK"
echo ""
echo "Leave empty to skip Elite University webhook for now."
echo "You can add it later when you have an endpoint ready."
echo ""

read -p "Enter Elite University Zapier webhook URL (or press Enter to skip): " ELITE_WEBHOOK

if [ -z "$ELITE_WEBHOOK" ]; then
    echo -e "${YELLOW}⚠️  Skipping Elite University webhook (can add later)${NC}"
    echo ""
    echo "To add later, run:"
    echo "  vercel env add PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK"
else
    echo ""
    echo "Adding to Vercel environments..."
    
    echo "$ELITE_WEBHOOK" | vercel env add PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK production
    echo "$ELITE_WEBHOOK" | vercel env add PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK preview
    echo "$ELITE_WEBHOOK" | vercel env add PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK development
    
    echo -e "${GREEN}✅ Elite University webhook configured${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 4: Verify configuration
echo "📝 Step 4: Verifying configuration..."
echo ""

echo "Current webhook configuration:"
vercel env ls | grep -E "(PARENTSIMPLE.*WEBHOOK|PARENT_SIMPLE.*WEBHOOK)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 5: Deploy
echo "📝 Step 5: Deployment"
echo ""
echo "The code has already been deployed to production."
echo "The new environment variables will be used on the next deployment."
echo ""
echo "To trigger a new deployment with the updated variables:"
echo "  vercel --prod --yes"
echo ""

read -p "Would you like to trigger a deployment now? (y/n): " DEPLOY_NOW

if [ "$DEPLOY_NOW" = "y" ] || [ "$DEPLOY_NOW" = "Y" ]; then
    echo ""
    echo "🚀 Deploying to production..."
    vercel --prod --yes
    echo ""
    echo -e "${GREEN}✅ Deployment complete!${NC}"
else
    echo ""
    echo -e "${YELLOW}⚠️  Skipping deployment. Run 'vercel --prod --yes' when ready.${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "📋 Summary:"
echo "  • Removed: PARENTSIMPLE_ZAPIER_WEBHOOK (deprecated)"
echo "  • Added: PARENTSIMPLE_LIFE_INSURANCE_ZAPIER_WEBHOOK"
if [ ! -z "$ELITE_WEBHOOK" ]; then
    echo "  • Added: PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK"
fi
echo ""
echo "🧪 Test the routing:"
echo "  1. Take Life Insurance CA quiz: https://parentsimple.org/quiz/life-insurance-ca"
echo "  2. Verify OTP and submit"
echo "  3. Check Vercel logs for: '📍 Using Life Insurance Zapier webhook'"
echo "  4. Verify lead appears in your Zapier dashboard"
echo ""
echo "📖 Full documentation: FUNNEL_SPECIFIC_WEBHOOKS_MIGRATION.md"
echo ""
