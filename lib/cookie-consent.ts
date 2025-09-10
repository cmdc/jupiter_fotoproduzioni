export type CookieConsent = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
};

export const COOKIE_CONSENT_KEY = 'cookie-consent';
export const COOKIE_CONSENT_DATE_KEY = 'cookie-consent-date';

// Default consent (only necessary cookies)
export const DEFAULT_CONSENT: CookieConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
};

// Get current consent from localStorage
export function getCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) return null;
    
    const parsed = JSON.parse(consent);
    return {
      necessary: true, // Always true
      analytics: parsed.analytics || false,
      marketing: parsed.marketing || false,
      preferences: parsed.preferences || false,
    };
  } catch {
    return null;
  }
}

// Save consent to localStorage
export function setCookieConsent(consent: CookieConsent): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    localStorage.setItem(COOKIE_CONSENT_DATE_KEY, new Date().toISOString());
    
    // Trigger custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
      detail: consent 
    }));
  } catch (error) {
    console.warn('Failed to save cookie consent:', error);
  }
}

// Check if user has given consent
export function hasGivenConsent(): boolean {
  return getCookieConsent() !== null;
}

// Check if specific cookie type is allowed
export function isCookieAllowed(type: keyof CookieConsent): boolean {
  const consent = getCookieConsent();
  if (!consent) return type === 'necessary';
  return consent[type];
}

// Clear all non-necessary cookies based on consent
export function clearDisallowedCookies(consent: CookieConsent): void {
  if (typeof window === 'undefined') return;
  
  // Clear analytics cookies if not allowed
  if (!consent.analytics) {
    // Clear Google Analytics cookies
    const gaCookies = document.cookie.split(';').filter(cookie => 
      cookie.trim().startsWith('_ga') || 
      cookie.trim().startsWith('_gid') ||
      cookie.trim().startsWith('_gat')
    );
    
    gaCookies.forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim();
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
  }
  
  // Clear marketing cookies if not allowed
  if (!consent.marketing) {
    // Add logic to clear marketing cookies here
    // Example: Facebook Pixel, Google Ads, etc.
  }
}

// Reset consent (for testing or user request)
export function resetCookieConsent(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(COOKIE_CONSENT_KEY);
  localStorage.removeItem(COOKIE_CONSENT_DATE_KEY);
  
  window.dispatchEvent(new CustomEvent('cookieConsentReset'));
}