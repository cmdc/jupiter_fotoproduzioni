"use client";

import { useState, useEffect } from 'react';
import { 
  getCookieConsent, 
  setCookieConsent, 
  hasGivenConsent, 
  isCookieAllowed,
  type CookieConsent 
} from '@/lib/cookie-consent';

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    // Initial load
    const currentConsent = getCookieConsent();
    const hasGiven = hasGivenConsent();
    
    setConsent(currentConsent);
    setHasConsented(hasGiven);

    // Listen for consent changes
    const handleConsentChange = (event: CustomEvent) => {
      setConsent(event.detail);
      setHasConsented(true);
    };

    const handleConsentReset = () => {
      setConsent(null);
      setHasConsented(false);
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange as EventListener);
    window.addEventListener('cookieConsentReset', handleConsentReset);

    return () => {
      window.removeEventListener('cookieConsentChanged', handleConsentChange as EventListener);
      window.removeEventListener('cookieConsentReset', handleConsentReset);
    };
  }, []);

  const updateConsent = (newConsent: CookieConsent) => {
    setCookieConsent(newConsent);
    setConsent(newConsent);
    setHasConsented(true);
  };

  const isAllowed = (type: keyof CookieConsent) => {
    return isCookieAllowed(type);
  };

  return {
    consent,
    hasConsented,
    updateConsent,
    isAllowed,
  };
}