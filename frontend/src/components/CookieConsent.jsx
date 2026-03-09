import React, { useState, useEffect } from 'react';
import { X, Cookie, Shield, Settings } from 'lucide-react';
import { Button } from './ui/button';

const CONSENT_KEY = 'docportal_cookie_consent';
const CONSENT_VERSION = '1.0';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, cannot be disabled
    functional: false,
    analytics: false
  });

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent) {
      try {
        const parsed = JSON.parse(consent);
        // Check if consent version matches
        if (parsed.version === CONSENT_VERSION) {
          setPreferences(parsed.preferences);
          return; // Don't show banner
        }
      } catch (e) {
        // Invalid consent data, show banner
      }
    }
    
    // Small delay before showing banner for better UX
    const timer = setTimeout(() => setShowBanner(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const saveConsent = (prefs) => {
    const consentData = {
      version: CONSENT_VERSION,
      preferences: prefs,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));
    setPreferences(prefs);
    setShowBanner(false);
    
    // Dispatch event for other components to react
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { 
      detail: prefs 
    }));
  };

  const acceptAll = () => {
    saveConsent({
      essential: true,
      functional: true,
      analytics: true
    });
  };

  const acceptEssentialOnly = () => {
    saveConsent({
      essential: true,
      functional: false,
      analytics: false
    });
  };

  const savePreferences = () => {
    saveConsent(preferences);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-[9998]" />
      
      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          
          {/* Main Banner */}
          {!showDetails ? (
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Cookie className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    🍪 We value your privacy
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    We use cookies to enhance your experience. Essential cookies are necessary for the site to function. 
                    You can choose to accept all cookies or customize your preferences.
                  </p>
                  
                  {/* GDPR Notice */}
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <Shield className="h-3 w-3 mr-1" />
                    <span>🇪🇺 GDPR & ePrivacy Compliant</span>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={acceptAll}
                      className="bg-blue-600 hover:bg-blue-700"
                      data-testid="cookie-accept-all"
                    >
                      Accept All
                    </Button>
                    <Button
                      onClick={acceptEssentialOnly}
                      variant="outline"
                      className="dark:border-gray-600 dark:text-gray-300"
                      data-testid="cookie-essential-only"
                    >
                      Essential Only
                    </Button>
                    <Button
                      onClick={() => setShowDetails(true)}
                      variant="ghost"
                      className="text-gray-600 dark:text-gray-400"
                      data-testid="cookie-customize"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Customize
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Detailed Preferences */
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Cookie Preferences
                </h3>
                <button 
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Essential Cookies */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">Essential Cookies</span>
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                        Always Active
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Required for the website to function. Includes authentication, session management, and security features.
                  </p>
                </div>

                {/* Functional Cookies */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">Functional Cookies</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={(e) => setPreferences({...preferences, functional: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Remember your preferences like language, country, and theme settings across sessions.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">Analytics Cookies</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Help us understand how you use our service to improve your experience. Data is anonymized.
                  </p>
                </div>
              </div>

              {/* Info Links */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <a href="/privacy" className="hover:text-blue-600 underline">Privacy Policy</a>
                  {' • '}
                  <a href="/cookies" className="hover:text-blue-600 underline">Cookie Policy</a>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={acceptEssentialOnly}
                    variant="outline"
                    size="sm"
                    className="dark:border-gray-600"
                  >
                    Reject All
                  </Button>
                  <Button
                    onClick={savePreferences}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    data-testid="cookie-save-preferences"
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Hook to check cookie consent
export const useCookieConsent = () => {
  const [consent, setConsent] = useState({
    essential: true,
    functional: false,
    analytics: false
  });

  useEffect(() => {
    const loadConsent = () => {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setConsent(parsed.preferences);
        } catch (e) {
          // Invalid data
        }
      }
    };

    loadConsent();

    // Listen for consent updates
    const handleConsentUpdate = (e) => {
      setConsent(e.detail);
    };
    
    window.addEventListener('cookieConsentUpdated', handleConsentUpdate);
    return () => window.removeEventListener('cookieConsentUpdated', handleConsentUpdate);
  }, []);

  return consent;
};

// Check if specific cookie type is allowed
export const isCookieAllowed = (type) => {
  const stored = localStorage.getItem(CONSENT_KEY);
  if (!stored) return type === 'essential';
  
  try {
    const parsed = JSON.parse(stored);
    return parsed.preferences[type] || false;
  } catch (e) {
    return type === 'essential';
  }
};

export default CookieConsent;
