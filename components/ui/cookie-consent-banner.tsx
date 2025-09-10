"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import { Card } from "./card";
import { Badge } from "./badge";
import {
  getCookieConsent,
  setCookieConsent,
  hasGivenConsent,
  clearDisallowedCookies,
  DEFAULT_CONSENT,
  type CookieConsent,
} from "@/lib/cookie-consent";

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>(DEFAULT_CONSENT);

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = hasGivenConsent();
    setShowBanner(!hasConsent);

    if (hasConsent) {
      const savedConsent = getCookieConsent();
      if (savedConsent) {
        setConsent(savedConsent);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const fullConsent: CookieConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };

    setCookieConsent(fullConsent);
    setShowBanner(false);
  };

  const handleAcceptNecessary = () => {
    setCookieConsent(DEFAULT_CONSENT);
    clearDisallowedCookies(DEFAULT_CONSENT);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    setCookieConsent(consent);
    clearDisallowedCookies(consent);
    setShowBanner(false);
  };

  const updateConsent = (type: keyof CookieConsent, value: boolean) => {
    setConsent((prev) => ({
      ...prev,
      [type]: type === "necessary" ? true : value, // Necessary cookies always true
    }));
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
      >
        <Card className="max-w-4xl mx-auto p-6 bg-background/95 backdrop-blur-md border shadow-2xl">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2">
              <span className="text-lg">🍪</span>
              <h3 className="text-lg font-semibold select-none">
                Cookie Preferences
              </h3>
            </div>

            {/* Main message */}
            <p className="text-sm text-muted-foreground select-none">
              We use cookies to enhance your browsing experience, serve
              personalized content, and analyze our traffic. By clicking
              &quot;Accept All&quot;, you consent to our use of cookies.
            </p>

            {/* Cookie details (expandable) */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3 overflow-hidden"
                >
                  {/* Necessary Cookies */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm select-none">
                          Necessary Cookies
                        </h4>
                        <Badge
                          variant="secondary"
                          className="text-xs select-none"
                        >
                          Required
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground select-none">
                        Essential for the website to function properly.
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled
                        aria-label="Necessary cookies (required)"
                        className="w-4 h-4 text-primary bg-background border-2 rounded focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <label htmlFor="analytics-consent" className="space-y-1 flex-1 cursor-pointer">
                      <h4 className="font-medium text-sm select-none">
                        Analytics Cookies
                      </h4>
                      <p className="text-xs text-muted-foreground select-none">
                        Help us understand how visitors interact with our
                        website.
                      </p>
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="analytics-consent"
                        checked={consent.analytics}
                        onChange={(e) =>
                          updateConsent("analytics", e.target.checked)
                        }
                        className="w-4 h-4 text-primary bg-background border-2 rounded focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <label htmlFor="marketing-consent" className="space-y-1 flex-1 cursor-pointer">
                      <h4 className="font-medium text-sm select-none">
                        Marketing Cookies
                      </h4>
                      <p className="text-xs text-muted-foreground select-none">
                        Used to deliver relevant advertisements and track ad
                        performance.
                      </p>
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="marketing-consent"
                        checked={consent.marketing}
                        onChange={(e) =>
                          updateConsent("marketing", e.target.checked)
                        }
                        className="w-4 h-4 text-primary bg-background border-2 rounded focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Preferences Cookies */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <label htmlFor="preferences-consent" className="space-y-1 flex-1 cursor-pointer">
                      <h4 className="font-medium text-sm select-none">
                        Preference Cookies
                      </h4>
                      <p className="text-xs text-muted-foreground select-none">
                        Remember your preferences and settings for a better
                        experience.
                      </p>
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="preferences-consent"
                        checked={consent.preferences}
                        onChange={(e) =>
                          updateConsent("preferences", e.target.checked)
                        }
                        className="w-4 h-4 text-primary bg-background border-2 rounded focus:ring-primary"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="select-none"
              >
                {showDetails ? "Hide Details" : "Cookie Settings"}
              </Button>

              <div className="flex gap-2 sm:ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAcceptNecessary}
                  className="select-none"
                >
                  Necessary Only
                </Button>

                {showDetails ? (
                  <Button
                    size="sm"
                    onClick={handleSavePreferences}
                    className="select-none"
                  >
                    Save Preferences
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleAcceptAll}
                    className="select-none"
                  >
                    Accept All
                  </Button>
                )}
              </div>
            </div>

            {/* Privacy policy link */}
            <p className="text-xs text-muted-foreground select-none">
              For more information, see our{" "}
              <a
                href="/privacy-policy"
                className="underline hover:text-foreground transition-colors"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
