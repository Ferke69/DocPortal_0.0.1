/**
 * Country Configuration for Global Localization
 * Maps country codes to currency, language, and tax settings
 * Includes EU Invoice Compliance Requirements
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
    flag: '🇸🇮',
    invoiceRequirements: {
      mandatoryFields: ['businessName', 'businessAddress', 'taxNumber', 'invoiceNumber', 'invoiceDate', 'clientDetails', 'serviceDescription', 'netAmount', 'vatRate', 'vatAmount', 'grossAmount'],
      optionalFields: ['vatNumber', 'iban', 'bic', 'paymentTerms'],
      reverseCharge: false,
      electronicInvoicing: false,
      notes: [
        'Davčna številka (Tax Number) is mandatory for all invoices',
        'ID za DDV required if VAT registered (threshold: €50,000/year)',
        'Invoice numbering must be sequential',
        'Invoices must be stored for 10 years'
      ]
    }
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
    flag: '🇬🇧',
    invoiceRequirements: {
      mandatoryFields: ['businessName', 'businessAddress', 'invoiceNumber', 'invoiceDate', 'clientDetails', 'serviceDescription', 'totalAmount'],
      optionalFields: ['vatNumber', 'utr', 'iban', 'sortCode', 'accountNumber'],
      reverseCharge: false,
      electronicInvoicing: false,
      notes: [
        'VAT Number required if VAT registered (threshold: £85,000/year)',
        'UTR required for self-employed individuals',
        'Invoice must show VAT breakdown if VAT registered',
        'Invoices must be stored for 6 years'
      ]
    }
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
    flag: '🇩🇪',
    invoiceRequirements: {
      mandatoryFields: ['businessName', 'businessAddress', 'taxNumber', 'invoiceNumber', 'invoiceDate', 'clientDetails', 'serviceDescription', 'netAmount', 'vatRate', 'vatAmount', 'grossAmount', 'deliveryDate'],
      optionalFields: ['vatNumber', 'iban', 'bic'],
      reverseCharge: true,
      electronicInvoicing: false,
      notes: [
        'Steuernummer mandatory on all invoices',
        'USt-IdNr. required for B2B EU transactions',
        'Delivery date or service period mandatory',
        'Invoices must be stored for 10 years',
        'Reverse charge mechanism for certain services'
      ]
    }
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
    flag: '🇫🇷',
    invoiceRequirements: {
      mandatoryFields: ['businessName', 'businessAddress', 'siret', 'invoiceNumber', 'invoiceDate', 'clientDetails', 'serviceDescription', 'netAmount', 'vatRate', 'vatAmount', 'grossAmount', 'paymentTerms', 'latePaymentPenalty'],
      optionalFields: ['vatNumber', 'iban', 'bic', 'rcs'],
      reverseCharge: true,
      electronicInvoicing: true,
      notes: [
        'SIRET number mandatory (14 digits)',
        'Late payment penalties must be stated',
        'Payment terms must be specified (max 60 days)',
        'E-invoicing mandatory for B2B from 2024',
        'Invoices must be stored for 10 years'
      ]
    }
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
    flag: '🇪🇸',
    invoiceRequirements: {
      mandatoryFields: ['businessName', 'businessAddress', 'nif', 'invoiceNumber', 'invoiceDate', 'clientDetails', 'clientNif', 'serviceDescription', 'netAmount', 'vatRate', 'vatAmount', 'grossAmount'],
      optionalFields: ['vatNumber', 'iban', 'bic'],
      reverseCharge: true,
      electronicInvoicing: true,
      notes: [
        'NIF/CIF mandatory on all invoices',
        'Client NIF required for B2B invoices',
        'SII (Immediate Supply of Information) for large businesses',
        'TicketBAI required in Basque Country',
        'Invoices must be stored for 4 years (6 for VAT)'
      ]
    }
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
    flag: '🇮🇹',
    invoiceRequirements: {
      mandatoryFields: ['businessName', 'businessAddress', 'codiceFiscale', 'partitaIva', 'invoiceNumber', 'invoiceDate', 'clientDetails', 'codiceDestinatario', 'serviceDescription', 'netAmount', 'vatRate', 'vatAmount', 'grossAmount'],
      optionalFields: ['iban', 'bic', 'pec'],
      reverseCharge: true,
      electronicInvoicing: true,
      notes: [
        'Electronic invoicing (FatturaPA) mandatory since 2019',
        'Codice Destinatario (7 chars) required for B2B',
        'PEC email for electronic delivery',
        'Split payment for public administration',
        'Invoices must be stored for 10 years'
      ]
    }
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
    flag: '🇵🇹',
    invoiceRequirements: {
      mandatoryFields: ['businessName', 'businessAddress', 'nif', 'invoiceNumber', 'invoiceDate', 'atcud', 'clientDetails', 'serviceDescription', 'netAmount', 'vatRate', 'vatAmount', 'grossAmount', 'qrCode'],
      optionalFields: ['iban', 'bic'],
      reverseCharge: false,
      electronicInvoicing: true,
      notes: [
        'ATCUD (unique document code) mandatory since 2022',
        'QR Code mandatory on invoices',
        'SAF-T (PT) reporting required',
        'Certified billing software mandatory',
        'Invoices must be stored for 12 years'
      ]
    }
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
    flag: '🇳🇱',
    invoiceRequirements: {
      mandatoryFields: ['businessName', 'businessAddress', 'kvkNumber', 'invoiceNumber', 'invoiceDate', 'clientDetails', 'serviceDescription', 'netAmount', 'vatRate', 'vatAmount', 'grossAmount'],
      optionalFields: ['btwNumber', 'iban', 'bic'],
      reverseCharge: true,
      electronicInvoicing: false,
      notes: [
        'KVK (Chamber of Commerce) number required',
        'BTW-nummer required if VAT registered',
        'VAT shifted notice for reverse charge',
        'Invoices must be stored for 7 years',
        'Small business scheme (KOR) available under €20,000'
      ]
    }
  }
};
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
