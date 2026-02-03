#!/bin/bash
# Deploy results page updates with professional advisor image

cd "/Users/funkyfortress/Documents/01-ALL DOCUMENTS/05 - Projects/CallReady/02-Expansion-Operations-Planning/02-Publisher-Platforms/04-ParentSimple"

echo "🔄 Adding files to git..."
git add public/images/team/professional-advisor.jpg src/components/quiz/AgentAssignmentPage.tsx

echo "💾 Committing changes..."
git commit -m "design: Update results page with professional advisor image and consistent widths

Visual Improvements:
- Replace SVG icon with professional advisor photo (professional-advisor.jpg)
- Update all containers to max-w-2xl for consistent site-wide width
- Reduce notification bar size to match yellow landing page bar (text-sm, py-3)
- Remove non-standard padding styles that created inconsistent layouts
- Ensure 'What Happens Next' section uses full standard width

Width Changes:
- Hero section: max-w-4xl → max-w-2xl
- Agent section: max-w-6xl → max-w-2xl (removed custom padding calc)
- What Happens Next: max-w-md → full width within max-w-2xl parent
- Responses Summary: added max-w-2xl constraint

Notification Bar:
- Changed from h1 text-2xl to p text-sm to match landing page
- Wrapped in max-w-2xl container with standard px-6 py-3 padding

This ensures all pages in the site maintain consistent 672px max-width."

echo "🚀 Pushing to origin/main..."
git push origin main

echo "✅ Deployment complete!"
