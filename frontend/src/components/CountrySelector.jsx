import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { useLocalization } from '../contexts/LocalizationContext';

const CountrySelector = ({ showLabel = true, size = 'default' }) => {
  const { t } = useTranslation();
  const { countryCode, countryConfig, allCountries, updateCountry } = useLocalization();

  const countries = Object.values(allCountries);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size={size === 'sm' ? 'sm' : 'default'}
          className="flex items-center space-x-2"
          data-testid="country-selector-trigger"
        >
          <Globe className="h-4 w-4" />
          {showLabel && (
            <>
              <span className="hidden sm:inline">{countryConfig.flag} {countryConfig.name}</span>
              <span className="sm:hidden">{countryConfig.flag}</span>
            </>
          )}
          {!showLabel && <span>{countryConfig.flag}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" data-testid="country-selector-menu">
        {countries.map((country) => (
          <DropdownMenuItem
            key={country.code}
            onClick={() => updateCountry(country.code)}
            className={`cursor-pointer ${countryCode === country.code ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
            data-testid={`country-option-${country.code}`}
          >
            <span className="mr-2">{country.flag}</span>
            <span className="flex-1">{country.name}</span>
            <span className="text-xs text-gray-500 ml-2">{country.currencySymbol}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CountrySelector;
