/**
 * Country Configuration for Global Localization
 * Maps country codes to currency, language, and tax settings
 */

export const COUNTRY_CONFIGS = {
  SI: {
    code: 'SI',
    name: 'Slovenia',
    nativeName: 'Slovenija',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'sl',
    vatRate: 22.0,
    taxLabel: 'Davčna številka',
    taxExample: '12345678',
    vatLabel: 'ID za DDV',
    vatExample: 'SI12345678',
    ibanExample: 'SI56012345678901234',
    flag: '🇸🇮'
  },
  UK: {
    code: 'UK',
    name: 'United Kingdom',
    nativeName: 'United Kingdom',
    currency: 'GBP',
    currencySymbol: '£',
    language: 'en',
    vatRate: 20.0,
    taxLabel: 'UTR (Unique Taxpayer Reference)',
    taxExample: '1234567890',
    vatLabel: 'VAT Number',
    vatExample: 'GB123456789',
    ibanExample: 'GB29NWBK60161331926819',
    flag: '🇬🇧'
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    nativeName: 'Deutschland',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'de',
    vatRate: 19.0,
    taxLabel: 'Steuernummer',
    taxExample: '12345678901',
    vatLabel: 'USt-IdNr.',
    vatExample: 'DE123456789',
    ibanExample: 'DE89370400440532013000',
    flag: '🇩🇪'
  },
  FR: {
    code: 'FR',
    name: 'France',
    nativeName: 'France',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'fr',
    vatRate: 20.0,
    taxLabel: 'SIRET',
    taxExample: '12345678901234',
    vatLabel: 'N° TVA intracommunautaire',
    vatExample: 'FR12345678901',
    ibanExample: 'FR7630006000011234567890189',
    flag: '🇫🇷'
  },
  ES: {
    code: 'ES',
    name: 'Spain',
    nativeName: 'España',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'es',
    vatRate: 21.0,
    taxLabel: 'NIF/CIF',
    taxExample: 'B12345678',
    vatLabel: 'NIF-IVA',
    vatExample: 'ESB12345678',
    ibanExample: 'ES9121000418450200051332',
    flag: '🇪🇸'
  },
  IT: {
    code: 'IT',
    name: 'Italy',
    nativeName: 'Italia',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'it',
    vatRate: 22.0,
    taxLabel: 'Codice Fiscale / P.IVA',
    taxExample: '12345678901',
    vatLabel: 'Partita IVA',
    vatExample: 'IT12345678901',
    ibanExample: 'IT60X0542811101000000123456',
    flag: '🇮🇹'
  },
  PT: {
    code: 'PT',
    name: 'Portugal',
    nativeName: 'Portugal',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'pt',
    vatRate: 23.0,
    taxLabel: 'NIF (Número de Identificação Fiscal)',
    taxExample: '123456789',
    vatLabel: 'NIF/NIPC',
    vatExample: 'PT123456789',
    ibanExample: 'PT50000201231234567890154',
    flag: '🇵🇹'
  },
  NL: {
    code: 'NL',
    name: 'Netherlands',
    nativeName: 'Nederland',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'nl',
    vatRate: 21.0,
    taxLabel: 'BSN/RSIN',
    taxExample: '123456789',
    vatLabel: 'BTW-nummer',
    vatExample: 'NL123456789B01',
    ibanExample: 'NL91ABNA0417164300',
    flag: '🇳🇱'
  }
};

// Language code to country code mapping
export const LANGUAGE_TO_COUNTRY = {
  en: 'UK',
  sl: 'SI',
  de: 'DE',
  fr: 'FR',
  es: 'ES',
  it: 'IT',
  pt: 'PT',
  nl: 'NL'
};

// Browser locale to country code mapping
export const LOCALE_TO_COUNTRY = {
  'en-GB': 'UK',
  'en-US': 'UK',
  'en': 'UK',
  'sl': 'SI',
  'sl-SI': 'SI',
  'de': 'DE',
  'de-DE': 'DE',
  'de-AT': 'DE',
  'fr': 'FR',
  'fr-FR': 'FR',
  'es': 'ES',
  'es-ES': 'ES',
  'it': 'IT',
  'it-IT': 'IT',
  'pt': 'PT',
  'pt-PT': 'PT',
  'nl': 'NL',
  'nl-NL': 'NL'
};

/**
 * Detect country from browser locale
 */
export const detectCountryFromLocale = () => {
  const browserLocale = navigator.language || navigator.userLanguage;
  
  // Try exact match first
  if (LOCALE_TO_COUNTRY[browserLocale]) {
    return LOCALE_TO_COUNTRY[browserLocale];
  }
  
  // Try language code only
  const langCode = browserLocale.split('-')[0];
  if (LOCALE_TO_COUNTRY[langCode]) {
    return LOCALE_TO_COUNTRY[langCode];
  }
  
  // Default to Slovenia
  return 'SI';
};

/**
 * Get country config by code
 */
export const getCountryConfig = (countryCode) => {
  return COUNTRY_CONFIGS[countryCode] || COUNTRY_CONFIGS.SI;
};

/**
 * Format price with country's currency
 */
export const formatPrice = (amount, countryCode) => {
  const config = getCountryConfig(countryCode);
  return `${config.currencySymbol}${Number(amount).toFixed(2)}`;
};

/**
 * Get all supported countries as array
 */
export const getSupportedCountries = () => {
  return Object.values(COUNTRY_CONFIGS);
};

export default COUNTRY_CONFIGS;
