"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import * as gtag from "../gtag.js";
import { isCookieAllowed, getCookieConsent } from "../lib/cookie-consent";

const GoogleAnalytics = () => {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    // Check initial consent
    const checkConsent = () => {
      const isAllowed = isCookieAllowed('analytics');
      setAnalyticsEnabled(isAllowed);
      
      if (isAllowed && window.gtag) {
        // Re-enable analytics if consent is given
        window.gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      }
    };

    checkConsent();

    // Listen for consent changes
    const handleConsentChange = () => {
      checkConsent();
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange);
    window.addEventListener('cookieConsentReset', () => setAnalyticsEnabled(false));

    return () => {
      window.removeEventListener('cookieConsentChanged', handleConsentChange);
      window.removeEventListener('cookieConsentReset', () => setAnalyticsEnabled(false));
    };
  }, []);

  // Don't load scripts if analytics not consented
  if (!analyticsEnabled) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      
                      // Set default consent state
                      gtag('consent', 'default', {
                        analytics_storage: 'granted'
                      });
                      
                      gtag('config', '${gtag.GA_TRACKING_ID}', {
                        page_path: window.location.pathname,
                        anonymize_ip: true
                      });
                    `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;
