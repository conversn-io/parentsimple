# ParentSimple

Parental education and financial literacy platform for parents navigating college planning, education savings, and family financial security.

## About

ParentSimple provides expert guidance, tools, calculators, and resources to help parents prepare for their children's educational and financial future. From early childhood through college admissions, we support parents at every stage of their journey.

**Tagline:** "Parenting with Purpose. Planning with Power."

## Tech Stack

- **Framework:** Next.js 15.4.6 (App Router)
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL)
- **CMS:** Publishare CMS
- **Deployment:** Vercel
- **CRM:** CallReady CRM
- **Lead Delivery:** GoHighLevel (GHL) Webhooks

## Content Pillars

1. **Early Years (Ages 0-10)** - Building the foundation
2. **Middle School (Ages 11-14)** - Building momentum
3. **High School (Ages 15-17)** - College readiness
4. **College Planning** - Your path to college success (Primary Revenue Driver)
5. **Financial Planning** - Secure your family's future
6. **Resources** - Tools and guides for parents

## Brand Identity

- **Primary Color:** Oxford Blue (#1A2B49)
- **Accent Color:** Sage Green (#9DB89D)
- **Background:** Ivory (#F9F6EF)
- **Typography:** Playfair Display (headings), Inter (body)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/conversn-io/parentsimple.git
cd parentsimple
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env-template-parentsimple.txt .env.local
# Edit .env.local with your configuration
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

See `env-template-parentsimple.txt` for required environment variables including:
- Supabase configuration
- Google Analytics 4
- Meta Pixel
- GoHighLevel webhooks
- OTP verification settings

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── brand/       # Logo and branding components
│   ├── hero/        # Hero section components
│   ├── navigation/  # Header, footer, menus
│   └── ui/          # Reusable UI components
├── lib/             # Utilities and configurations
└── utils/           # Helper functions
```

## Deployment

This project is configured for deployment on Vercel. Connect your GitHub repository to Vercel for automatic deployments.

## License

Proprietary - All rights reserved

