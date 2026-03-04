import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  COUNTRY_CONFIGS, 
  detectCountryFromLocale, 
  getCountryConfig,
  formatPrice as formatPriceUtil 
} from '../config/countryConfig';

const LocalizationContext = createContext(null);

export const LocalizationProvider = ({ children }) => {
  const { i18n } = useTranslation();
  
  // Initialize country from localStorage or detect from browser
  const [countryCode, setCountryCode] = useState(() => {
    const stored = localStorage.getItem('userCountry');
    if (stored && COUNTRY_CONFIGS[stored]) {
      return stored;
    }
    return detectCountryFromLocale();
  });

  // Get current country configuration
  const countryConfig = getCountryConfig(countryCode);

  // Update country and sync language/currency
  const updateCountry = useCallback((newCountryCode) => {
    if (!COUNTRY_CONFIGS[newCountryCode]) return;
    
    const config = COUNTRY_CONFIGS[newCountryCode];
    
    // Update state
    setCountryCode(newCountryCode);
    
    // Persist to localStorage
    localStorage.setItem('userCountry', newCountryCode);
    localStorage.setItem('currency', config.currency);
    
    // Update i18n language
    i18n.changeLanguage(config.language);
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('countryChange', { 
      detail: { 
        countryCode: newCountryCode,
        currency: config.currency,
        language: config.language 
      } 
    }));
  }, [i18n]);

  // Sync language when country changes
  useEffect(() => {
    const config = getCountryConfig(countryCode);
    if (i18n.language !== config.language) {
      i18n.changeLanguage(config.language);
    }
  }, [countryCode, i18n]);

  // Format price with current country's currency
  const formatPrice = useCallback((amount) => {
    return formatPriceUtil(amount, countryCode);
  }, [countryCode]);

  // Get currency symbol
  const getCurrencySymbol = useCallback(() => {
    return countryConfig.currencySymbol;
  }, [countryConfig]);

  // Get VAT rate
  const getVatRate = useCallback(() => {
    return countryConfig.vatRate;
  }, [countryConfig]);

  // Calculate price with VAT
  const calculateWithVat = useCallback((netAmount) => {
    const vatAmount = netAmount * (countryConfig.vatRate / 100);
    return {
      net: netAmount,
      vat: vatAmount,
      vatRate: countryConfig.vatRate,
      gross: netAmount + vatAmount
    };
  }, [countryConfig]);

  const value = {
    // Current state
    countryCode,
    countryConfig,
    currency: countryConfig.currency,
    currencySymbol: countryConfig.currencySymbol,
    language: countryConfig.language,
    vatRate: countryConfig.vatRate,
    
    // All countries
    allCountries: COUNTRY_CONFIGS,
    
    // Methods
    updateCountry,
    formatPrice,
    getCurrencySymbol,
    getVatRate,
    calculateWithVat,
    getCountryConfig
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

export default LocalizationContext;
