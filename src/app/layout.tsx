import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "@/components/navigation/ConditionalHeader";
import ConditionalFooter from "@/components/ConditionalFooter";
import { LayoutProvider } from "@/contexts/FooterContext";
import { UTMTracker } from "@/components/analytics/UTMTracker";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "ParentSimple - Parenting with Purpose. Planning with Power.",
    template: "%s | ParentSimple"
  },
  description: "Expert guidance for parents on college planning, education savings, financial security, and family financial planning. Tools, calculators, and resources to help you prepare for your children's future.",
  keywords: ["college planning", "529 plans", "education savings", "college admissions", "financial planning for parents", "life insurance for parents", "estate planning", "education funding", "college prep", "parenting finances"],
  authors: [{ name: "ParentSimple Team" }],
  creator: "ParentSimple",
  publisher: "ParentSimple",
  icons: {
    icon: [
      { url: '/images/logos/parentsimple-favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' }
    ],
    shortcut: '/images/logos/parentsimple-favicon.png',
    apple: '/images/logos/parentsimple-favicon.png',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://parentsimple.org'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://parentsimple.org',
    siteName: 'ParentSimple',
    title: 'ParentSimple - Parenting with Purpose. Planning with Power.',
    description: 'Expert guidance for parents on college planning, education savings, financial security, and family financial planning.',
    images: [
      {
        url: '/images/webp/hero/parents-planning-education.webp',
        width: 1200,
        height: 630,
        alt: 'Parents planning for their children\'s education and future',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ParentSimple',
    creator: '@ParentSimple',
    title: 'ParentSimple - Parenting with Purpose. Planning with Power.',
    description: 'Expert guidance for parents on college planning, education savings, financial security, and family financial planning.',
    images: ['/images/webp/hero/parents-planning-education.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon links for better browser compatibility */}
        <link rel="icon" type="image/png" sizes="32x32" href="/images/logos/parentsimple-favicon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/logos/parentsimple-favicon.png" />
        
        {/* ✅ DIRECT TRACKING: GA4 Base Code (Synchronous Loading) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZC29XQ0W2J');
            `
          }}
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-ZC29XQ0W2J"
        />
        
        {/* ✅ DIRECT TRACKING: Meta Pixel Base Code (with bot detection) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              
              // Bot detection - only track if not a bot
              (function() {
                var isBot = false;
                if (typeof navigator !== 'undefined') {
                  var ua = navigator.userAgent || '';
                  isBot = /bot|crawler|spider|crawling|facebookexternalhit|Googlebot|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Sogou|Exabot|facebot|ia_archiver/i.test(ua);
                }
                
                if (!isBot) {
                  fbq('init', '799755069642014');
                  fbq('track', 'PageView');
                } else {
                  // Still initialize but don't track PageView for bots
                  fbq('init', '799755069642014');
                }
              })();
            `
          }}
        />
        <noscript>
          <img height="1" width="1" style={{display:'none'}} 
               src="https://www.facebook.com/tr?id=799755069642014&ev=PageView&noscript=1" />
        </noscript>
      </head>
          <body
            className={`${playfairDisplay.variable} ${inter.variable} antialiased`}
          >
            <UTMTracker />
            <LayoutProvider>
              <ConditionalHeader />
              <main>{children}</main>
              <ConditionalFooter />
            </LayoutProvider>
          </body>
    </html>
  );
}
