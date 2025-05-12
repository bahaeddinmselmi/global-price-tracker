import { Country } from '../types';

export const COUNTRIES: Country[] = [
  {
    id: '1',
    name: 'United States',
    code: 'US',
    currencyCode: 'USD',
    currencySymbol: '$',
    flag: 'https://flagcdn.com/us.svg'
  },
  {
    id: '2',
    name: 'United Kingdom',
    code: 'GB',
    currencyCode: 'GBP',
    currencySymbol: '£',
    flag: 'https://flagcdn.com/gb.svg'
  },
  {
    id: '3',
    name: 'Japan',
    code: 'JP',
    currencyCode: 'JPY',
    currencySymbol: '¥',
    flag: 'https://flagcdn.com/jp.svg'
  },
  {
    id: '4',
    name: 'Germany',
    code: 'DE',
    currencyCode: 'EUR',
    currencySymbol: '€',
    flag: 'https://flagcdn.com/de.svg'
  },
  {
    id: '5',
    name: 'Australia',
    code: 'AU',
    currencyCode: 'AUD',
    currencySymbol: 'A$',
    flag: 'https://flagcdn.com/au.svg'
  },
  {
    id: '6',
    name: 'Canada',
    code: 'CA',
    currencyCode: 'CAD',
    currencySymbol: 'C$',
    flag: 'https://flagcdn.com/ca.svg'
  },
  {
    id: '7',
    name: 'France',
    code: 'FR',
    currencyCode: 'EUR',
    currencySymbol: '€',
    flag: 'https://flagcdn.com/fr.svg'
  },
  {
    id: '8',
    name: 'India',
    code: 'IN',
    currencyCode: 'INR',
    currencySymbol: '₹',
    flag: 'https://flagcdn.com/in.svg'
  },
  {
    id: '9',
    name: 'Tunisia',
    code: 'TN',
    currencyCode: 'TND',
    currencySymbol: 'د.ت',
    flag: 'https://flagcdn.com/tn.svg'
  }
];

export const SOURCES = [
  'Amazon',
  'eBay',
  'Walmart',
  'Target',
  'BestBuy',
  'Alibaba',
  'Rakuten',
  'Otto',
  'Fnac',
  'Jumia',
  'Tunisianet',
  'Mytek',
  'Aliexpress'
];

export const CHART_COLORS = [
  'rgba(37, 99, 235, 0.8)',   // blue-600
  'rgba(13, 148, 136, 0.8)',  // teal-600
  'rgba(139, 92, 246, 0.8)',  // violet-500
  'rgba(16, 185, 129, 0.8)',  // green-500
  'rgba(245, 158, 11, 0.8)',  // amber-500
  'rgba(239, 68, 68, 0.8)',   // red-500
  'rgba(20, 184, 166, 0.8)',  // teal-500
  'rgba(168, 85, 247, 0.8)'   // purple-500
];

export const CURRENCIES = {
  USD: { rate: 1.0, symbol: '$' },
  GBP: { rate: 0.78, symbol: '£' },
  EUR: { rate: 0.91, symbol: '€' },
  JPY: { rate: 153.5, symbol: '¥' },
  AUD: { rate: 1.51, symbol: 'A$' },
  CAD: { rate: 1.36, symbol: 'C$' },
  INR: { rate: 83.35, symbol: '₹' },
  TND: { rate: 3.12, symbol: 'د.ت' }
};