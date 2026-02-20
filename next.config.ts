import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/canada-life',
        destination:
          'http://parentsimple.org/quiz/life-insurance-ca?utm_source=meta&utm_medium=cpc&utm_campaign=LIFE-Term-CAN-ABO-P2',
        permanent: true,
      },
      {
        source: '/elite-ready',
        destination:
          'https://www.parentsimple.org/quiz/elite-university-readiness?utm_source=meta&utm_medium=cpc&utm_campaign=EUQ-CBO-GamePlan&utm_content=Ad-Link',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vpysqshhafthuxvokwqj.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Exclude Supabase Edge Functions from Next.js build
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/supabase/functions/**'],
    };
    return config;
  },
};

export default nextConfig;
