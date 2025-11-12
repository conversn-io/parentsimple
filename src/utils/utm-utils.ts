export interface UTMParameters {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  utm_id?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
}

export const extractUTMParameters = (): UTMParameters => {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
    utm_term: urlParams.get('utm_term') || undefined,
    utm_content: urlParams.get('utm_content') || undefined,
    utm_id: urlParams.get('utm_id') || undefined,
    gclid: urlParams.get('gclid') || undefined,
    fbclid: urlParams.get('fbclid') || undefined,
    msclkid: urlParams.get('msclkid') || undefined,
  };
};

export const storeUTMParameters = (utmParams: UTMParameters): void => {
  sessionStorage.setItem('utm_parameters', JSON.stringify(utmParams));
  sessionStorage.setItem('utm_timestamp', new Date().toISOString());
};

export const getStoredUTMParameters = (): UTMParameters | null => {
  const stored = sessionStorage.getItem('utm_parameters');
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const hasUTMParameters = (utmParams: UTMParameters): boolean => {
  return Object.values(utmParams).some(value => value !== undefined && value !== null);
};


