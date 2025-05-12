import { ProductPrices, Country, PriceData } from '../types';
import { SOURCES } from '../utils/constants';
import { simulateBrowserSearch } from './browserScraper';

// Generate realistic source URLs based on the source and country
const generateSourceUrl = (source: string, countryCode: string, productName: string): string => {
  const encodedProduct = encodeURIComponent(productName);
  
  // Special handling for Tunisia
  if (countryCode === 'TN') {
    switch (source.toLowerCase()) {
      case 'jumia':
        return `https://www.jumia.com.tn/catalog/?q=${encodedProduct}`;
      case 'tunisianet':
        return `https://www.tunisianet.com.tn/recherche?controller=search&s=${encodedProduct}`;
      case 'mytek':
        return `https://www.mytek.tn/recherche?controller=search&s=${encodedProduct}`;
      case 'wiki':
        return `https://www.wiki.tn/recherche?controller=search&s=${encodedProduct}`;
      case 'mega':
        return `https://www.mega.tn/search/${encodedProduct}`;
      case 'technopro':
        return `https://www.technopro-online.com/recherche?controller=search&s=${encodedProduct}`;
      case 'tayara':
        return `https://www.tayara.tn/search/?q=${encodedProduct}`;
      default:
        return `https://www.google.com/search?q=${encodedProduct}+price+tunisia`;
    }
  }
  
  // URLs for other countries
  switch (source.toLowerCase()) {
    case 'amazon':
      return `https://www.amazon.${getAmazonDomain(countryCode)}/s?k=${encodedProduct}`;
    case 'ebay':
      return `https://www.ebay.${getEbayDomain(countryCode)}/sch/i.html?_nkw=${encodedProduct}`;
    case 'walmart':
      return `https://www.walmart.com/search/?query=${encodedProduct}`;
    case 'bestbuy':
      return `https://www.bestbuy.com/site/searchpage.jsp?st=${encodedProduct}`;
    case 'target':
      return `https://www.target.com/s?searchTerm=${encodedProduct}`;
    case 'newegg':
      return `https://www.newegg.com/p/pl?d=${encodedProduct}`;
    default:
      return `https://www.google.com/search?q=${encodedProduct}+price+${country(countryCode)}`;
  }
};

// Helper function to get Amazon domain based on country code
const getAmazonDomain = (countryCode: string): string => {
  switch (countryCode) {
    case 'US': return 'com';
    case 'UK': return 'co.uk';
    case 'CA': return 'ca';
    case 'DE': return 'de';
    case 'FR': return 'fr';
    case 'JP': return 'co.jp';
    case 'IT': return 'it';
    case 'ES': return 'es';
    default: return 'com';
  }
};

// Helper function to get eBay domain based on country code
const getEbayDomain = (countryCode: string): string => {
  switch (countryCode) {
    case 'US': return 'com';
    case 'UK': return 'co.uk';
    case 'CA': return 'ca';
    case 'DE': return 'de';
    case 'FR': return 'fr';
    case 'AU': return 'com.au';
    case 'IT': return 'it';
    default: return 'com';
  }
};

// Helper function to get country name from code
const country = (countryCode: string): string => {
  switch (countryCode) {
    case 'US': return 'usa';
    case 'UK': return 'uk';
    case 'CA': return 'canada';
    case 'DE': return 'germany';
    case 'FR': return 'france';
    case 'JP': return 'japan';
    case 'IT': return 'italy';
    case 'ES': return 'spain';
    case 'AU': return 'australia';
    default: return countryCode.toLowerCase();
  }
};

// Generate mock price data for a product
const generateMockPrice = (productName: string, country: Country, source: string): PriceData => {
  // Base price depends on the product type
  const basePrice = 
    productName.toLowerCase().includes('iphone') ? 999 :
    productName.toLowerCase().includes('samsung') ? 899 :
    productName.toLowerCase().includes('sony') ? 349 :
    productName.toLowerCase().includes('nintendo') ? 299 :
    productName.toLowerCase().includes('xbox') ? 499 :
    productName.toLowerCase().includes('playstation') ? 499 :
    productName.toLowerCase().includes('macbook') ? 1299 :
    productName.toLowerCase().includes('dell') ? 899 :
    productName.toLowerCase().includes('hp') ? 799 :
    Math.floor(Math.random() * 500) + 100; // Random price between 100 and 600
  
  // Price variation based on country (±30%)
  const countryFactor = 
    country.code === 'US' ? 1.0 :
    country.code === 'UK' ? 1.1 :
    country.code === 'CA' ? 1.05 :
    country.code === 'DE' ? 1.15 :
    country.code === 'FR' ? 1.2 :
    country.code === 'JP' ? 1.1 :
    country.code === 'IT' ? 1.25 :
    country.code === 'ES' ? 1.2 :
    country.code === 'AU' ? 1.3 :
    country.code === 'TN' ? 1.4 : // Tunisia prices are typically higher
    1.0;
  
  // Price variation based on source (±20%)
  const sourceFactor = 
    source.toLowerCase() === 'amazon' ? 1.0 :
    source.toLowerCase() === 'ebay' ? 0.9 :
    source.toLowerCase() === 'walmart' ? 0.95 :
    source.toLowerCase() === 'bestbuy' ? 1.05 :
    source.toLowerCase() === 'target' ? 1.0 :
    source.toLowerCase() === 'newegg' ? 1.02 :
    source.toLowerCase() === 'jumia' ? 1.1 :
    source.toLowerCase() === 'tunisianet' ? 1.05 :
    source.toLowerCase() === 'mytek' ? 1.08 :
    1.0;
  
  // Add random variation (±10%)
  const randomFactor = 0.9 + (Math.random() * 0.2);
  
  // Calculate final price
  const price = basePrice * countryFactor * sourceFactor * randomFactor;
  
  // Convert to the country's currency
  const convertedPrice = convertPrice(price, country.code);
  
  return {
    country,
    price: Math.round(convertedPrice * 100) / 100,
    originalPrice: Math.round(convertedPrice * 100) / 100,
    source,
    sourceUrl: generateSourceUrl(source, country.code, productName),
    lastUpdated: new Date().toISOString(),
    inStock: Math.random() > 0.1, // 90% chance of being in stock
    productName: `${productName} (${source})`,
    productImage: `https://source.unsplash.com/featured/300x200?${encodeURIComponent(productName)}`
  };
};

// Convert price to local currency
const convertPrice = (usdPrice: number, countryCode: string): number => {
  // Exchange rates (approximate)
  const rates: Record<string, number> = {
    'US': 1.0,      // USD
    'UK': 0.78,     // GBP
    'CA': 1.35,     // CAD
    'DE': 0.92,     // EUR
    'FR': 0.92,     // EUR
    'JP': 150.0,    // JPY
    'IT': 0.92,     // EUR
    'ES': 0.92,     // EUR
    'AU': 1.5,      // AUD
    'TN': 3.1       // TND
  };
  
  const rate = rates[countryCode] || 1.0;
  return usdPrice * rate;
};

// Mock function to fetch product prices
export const mockFetchProductPrices = async (
  productName: string,
  countries: Country[]
): Promise<ProductPrices> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const prices: PriceData[] = [];
  
  // Check if Tunisia is included in the countries
  const tunisiaCountry = countries.find(country => country.code === 'TN');
  let tunisianPrices: PriceData[] = [];
  
  if (tunisiaCountry) {
    try {
      // Use our browser simulation approach for Tunisia
      console.log('Starting browser simulation for Tunisian websites...');
      
      // Simulate browser search for Tunisia
      tunisianPrices = await simulateBrowserSearch(productName, 'TN');
      
      if (tunisianPrices.length > 0) {
        // Add the simulated browser prices to our results
        prices.push(...tunisianPrices);
        
        // Remove Tunisia from the countries array to avoid mock data generation
        countries = countries.filter(country => country.code !== 'TN');
      } else {
        console.log('No results from browser simulation, falling back to mock data');
      }
    } catch (error) {
      console.error('Error during browser simulation:', error);
      console.log('Falling back to mock data for Tunisia');
    }
  }
  
  // Generate mock data for other countries
  for (const country of countries) {
    // For each country, generate 1-3 sources
    const numSources = Math.floor(Math.random() * 3) + 1;
    const countrySources = [...SOURCES].sort(() => Math.random() - 0.5).slice(0, numSources);
    
    for (const source of countrySources) {
      prices.push(generateMockPrice(productName, country, source));
    }
  }
  
  return {
    productName,
    prices,
    timestamp: new Date().toISOString()
  };
};

// Mock function to save search history
export const mockSaveSearchToHistory = async (productPrices: ProductPrices): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real implementation, this would save to a database
  console.log('Saving search to history:', productPrices.productName);
  
  // Get existing history from localStorage
  let history: ProductPrices[] = [];
  try {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      history = JSON.parse(savedHistory);
    }
  } catch (error) {
    console.error('Error reading search history:', error);
  }
  
  // Add new search to history
  history.unshift(productPrices);
  
  // Keep only the last 10 searches
  history = history.slice(0, 10);
  
  // Save updated history
  try {
    localStorage.setItem('searchHistory', JSON.stringify(history));
  } catch (error) {
    console.error('Error saving search history:', error);
  }
};
