// API Configuration
// This ensures API calls go to the correct domain regardless of where the quiz is hosted

const getApiBaseUrl = () => {
  // If we're on the main domain, use relative URLs
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return '';
    }
    
    // Main production domain
    if (hostname === 'www.seniorsimple.org' || hostname === 'seniorsimple.org') {
      return '';
    }
    
    // Vercel preview URLs or other domains - use absolute URL to main domain
    return 'https://www.seniorsimple.org';
  }
  
  // Server-side rendering - use main domain
  return 'https://www.seniorsimple.org';
};

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string) => {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${baseUrl}${cleanEndpoint}`;
  
  // Debug logging for each API call
  if (typeof window !== 'undefined') {
    console.log('🔧 API URL Built:', {
      hostname: window.location.hostname,
      baseUrl,
      endpoint: cleanEndpoint,
      fullUrl,
      timestamp: new Date().toISOString()
    });
  }
  
  return fullUrl;
};

