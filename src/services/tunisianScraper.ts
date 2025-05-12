import { PriceData } from '../types';
import * as cheerio from 'cheerio';

// List of Tunisian e-commerce websites to scrape with their actual search mechanisms
const TUNISIAN_WEBSITES = [
  // Popular Tunisian e-commerce sites with verified search URLs
  {
    name: 'Jumia',
    url: 'https://www.jumia.com.tn',
    // Direct search URL that works on the actual site
    searchUrl: (query: string) => `https://www.jumia.com.tn/catalog/?q=${encodeURIComponent(query)}`,
    searchMethod: 'GET',
    mainDomain: true
  },
  {
    name: 'Tunisianet',
    url: 'https://www.tunisianet.com.tn',
    // Verified working search URL
    searchUrl: (query: string) => `https://www.tunisianet.com.tn/module/ambjolisearch/jolisearch?search_query=${encodeURIComponent(query)}`,
    searchMethod: 'GET',
    mainDomain: true
  },
  {
    name: 'Mytek',
    url: 'https://www.mytek.tn',
    // Updated search URL based on actual site implementation
    searchUrl: (query: string) => `https://www.mytek.tn/module/ambjolisearch/jolisearch?search_query=${encodeURIComponent(query)}`,
    searchMethod: 'GET',
    mainDomain: true
  },
  {
    name: 'Wiki',
    url: 'https://www.wiki.tn',
    // Updated search URL based on actual site implementation
    searchUrl: (query: string) => `https://www.wiki.tn/module/ambjolisearch/jolisearch?search_query=${encodeURIComponent(query)}`,
    searchMethod: 'GET',
    mainDomain: true
  },
  {
    name: 'Tayara',
    url: 'https://www.tayara.tn',
    // Direct search URL for marketplace
    searchUrl: (query: string) => `https://www.tayara.tn/search/?q=${encodeURIComponent(query)}`,
    searchMethod: 'GET',
    mainDomain: true
  },
  {
    name: 'Mega',
    url: 'https://www.mega.tn',
    // Verified working search URL
    searchUrl: (query: string) => `https://www.mega.tn/search/?q=${encodeURIComponent(query)}`,
    searchMethod: 'GET',
    mainDomain: true
  },
  {
    name: 'Technopro',
    url: 'https://www.technopro.tn',
    // Verified working search URL
    searchUrl: (query: string) => `https://www.technopro.tn/catalogsearch/result/?q=${encodeURIComponent(query)}`,
    searchMethod: 'GET',
    mainDomain: true
  },
  {
    name: 'Affariyet',
    url: 'https://www.affariyet.tn',
    // Verified working search URL
    searchUrl: (query: string) => `https://www.affariyet.tn/search?q=${encodeURIComponent(query)}`,
    searchMethod: 'GET',
    mainDomain: true
  }
];

// Helper function to extract number from price string
const extractPrice = (priceText: string): number => {
  // Remove non-numeric characters except decimal point
  // Handle both comma and period as decimal separators
  const numericString = priceText.replace(/[^0-9.,]/g, '')
    .replace(/,/g, '.'); // Replace all commas with periods for consistent parsing
  
  // Sometimes prices have multiple decimal points after cleanup, keep only the last one
  const parts = numericString.split('.');
  if (parts.length > 2) {
    const lastPart = parts.pop() || '';
    return parseFloat(parts.join('') + '.' + lastPart);
  }
  
  return parseFloat(numericString);
};

// Common price-related CSS selectors to try
const COMMON_PRICE_SELECTORS = [
  '.price', '.prc', '.product-price', '.price-new', '.current-price', '.price-box', 
  '[class*="price"]', '[itemprop="price"]', '.product_price', '.regular-price',
  '.our-price', '.sale-price', '.special-price', '.now-price'
];

// Common product title selectors
const COMMON_TITLE_SELECTORS = [
  '.product-title', '.product-name', '.name', '.title', 'h1', 'h2.product-name',
  '[class*="product-title"]', '[class*="product-name"]', '[itemprop="name"]',
  '.product_title', '.product-item-link', '.product-card-title'
];

// Common link selectors
const COMMON_LINK_SELECTORS = [
  '.product a', '.product-item a', '.product-card a', '.product-title a', '.name a',
  'a.product-item-link', 'a[href*="product"]', '.product-image a', '.card a',
  'a.product-card', 'a.card'
];

// Common image selectors
const COMMON_IMAGE_SELECTORS = [
  '.product-image img', '.product img', '.card-img', 'img.product-image',
  '[class*="product"] img', '[class*="card"] img', 'img[src*="product"]',
  '[itemprop="image"]', 'img.img', '.thumbnail img'
];

// Function to try multiple selectors until one works
const findWithSelectors = ($: cheerio.CheerioAPI, selectors: string[]): any => {
  for (const selector of selectors) {
    const elements = $(selector);
    if (elements.length > 0) {
      return elements;
    }
  }
  return $(''); // Empty result if nothing found
};

// Function to intelligently extract price from text
const findPriceInText = (text: string): number | null => {
  // Look for patterns like "123.456 DT" or "123,456 TND" or "123.456 د.ت"
  const priceRegex = /\b(\d+[\.,]\d+)\s*(DT|TND|د\.ت|د\.ت\.|dinars?|dt)/i;
  const match = text.match(priceRegex);
  
  if (match && match[1]) {
    return extractPrice(match[1]);
  }
  
  // If no match with currency, try to find any number with 3 decimal places (common in Tunisia)
  const numberRegex = /\b(\d+[\.,]\d{3})\b/;
  const numberMatch = text.match(numberRegex);
  
  if (numberMatch && numberMatch[1]) {
    return extractPrice(numberMatch[1]);
  }
  
  return null;
};

// Function to directly navigate to a website and extract real prices
const scrapeWebsite = async (website: typeof TUNISIAN_WEBSITES[0], productName: string): Promise<PriceData | null> => {
  try {
    console.log(`Directly navigating to ${website.name} to search for ${productName}...`);
    
    // Prepare the search URL
    const searchUrl = website.searchUrl(productName);
    console.log(`Accessing: ${searchUrl}`);
    
    // Fetch the search page with proper headers to mimic a real browser
    const response = await fetch(searchUrl, {
      method: website.searchMethod,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7,ar;q=0.6', // Use French/Arabic for Tunisian sites
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': website.url,
        'Origin': website.url,
        'Connection': 'keep-alive',
      },
      redirect: 'follow',
      credentials: 'omit',
    });
    
    // Log the response status
    console.log(`Response from ${website.name}: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      console.error(`Failed to access ${website.name}: ${response.status} ${response.statusText}`);
      return null;
    }
    
    // Get the HTML content
    const html = await response.text();
    console.log(`Received HTML content from ${website.name} (${html.length} bytes)`);
    
    // Save the HTML for debugging if needed
    try {
      localStorage.setItem(`${website.name}_html`, html.substring(0, 10000)); // Save first 10K for debugging
    } catch (e) {
      // Ignore storage errors
    }
    
    // Load the HTML into cheerio for parsing
    const $ = cheerio.load(html);
    
    // Log the page title to verify we got the right page
    const pageTitle = $('title').text().trim();
    console.log(`Page title: ${pageTitle}`);
    
    // Intelligently find product elements
    const productElements = findWithSelectors($, [
      '.product', '.product-item', '.product-card', '.card', '[class*="product"]',
      '[class*="item"]', '[class*="card"]', '.article', '.item'
    ]);
    
    // If no product elements found, try to find price directly
    if (productElements.length === 0) {
      // Try to find price directly
      const priceElements = findWithSelectors($, COMMON_PRICE_SELECTORS);
      if (priceElements.length === 0) {
        console.log(`No product or price elements found on ${website.name}`);
        return null;
      }
      
      // Extract the first price found
      const priceText = priceElements.first().text().trim();
      const price = extractPrice(priceText);
      
      if (isNaN(price) || price === 0) {
        console.log(`Invalid price found on ${website.name}: ${priceText}`);
        return null;
      }
      
      // Try to find product title
      const titleElements = findWithSelectors($, COMMON_TITLE_SELECTORS);
      const productTitle = titleElements.first().text().trim() || productName;
      
      // Try to find product URL
      const linkElements = findWithSelectors($, COMMON_LINK_SELECTORS);
      let productUrl = linkElements.first().attr('href') || '';
      if (productUrl && !productUrl.startsWith('http')) {
        productUrl = website.url + (productUrl.startsWith('/') ? productUrl : '/' + productUrl);
      }
      
      // Try to find product image
      const imageElements = findWithSelectors($, COMMON_IMAGE_SELECTORS);
      let productImage = imageElements.first().attr('src') || '';
      if (productImage && !productImage.startsWith('http')) {
        productImage = website.url + (productImage.startsWith('/') ? productImage : '/' + productImage);
      }
      
      return {
        country: {
          id: '9',
          name: 'Tunisia',
          code: 'TN',
          currencyCode: 'TND',
          currencySymbol: 'د.ت',
          flag: 'https://flagcdn.com/tn.svg'
        },
        price,
        originalPrice: price,
        source: website.name,
        sourceUrl: productUrl || website.searchUrl(productName),
        lastUpdated: new Date().toISOString(),
        inStock: true, // Assume in stock if we found a price
        productName: productTitle,
        productImage
      };
    }
    
    // Process the first product found
    const firstProduct = productElements.first();
    
    // Extract price using multiple methods
    let price = 0;
    let priceText = '';
    
    // Method 1: Try common price selectors within the product
    for (const selector of COMMON_PRICE_SELECTORS) {
      const priceElement = firstProduct.find(selector).first();
      if (priceElement.length > 0) {
        priceText = priceElement.text().trim();
        price = extractPrice(priceText);
        if (!isNaN(price) && price > 0) break;
      }
    }
    
    // Method 2: If no price found, scan all text in the product for price patterns
    if (isNaN(price) || price === 0) {
      const allText = firstProduct.text();
      const extractedPrice = findPriceInText(allText);
      if (extractedPrice !== null) {
        price = extractedPrice;
        priceText = allText;
      }
    }
    
    // If still no valid price, return null
    if (isNaN(price) || price === 0) {
      console.log(`No valid price found on ${website.name}`);
      return null;
    }
    
    // Extract product title
    let productTitle = '';
    for (const selector of COMMON_TITLE_SELECTORS) {
      const titleElement = firstProduct.find(selector).first();
      if (titleElement.length > 0) {
        productTitle = titleElement.text().trim();
        if (productTitle) break;
      }
    }
    
    // If no title found in the product, try page title
    if (!productTitle) {
      productTitle = $('title').text().trim() || productName;
    }
    
    // Extract product URL
    let productUrl = '';
    for (const selector of COMMON_LINK_SELECTORS) {
      const linkElement = firstProduct.find(selector).first();
      if (linkElement.length > 0) {
        productUrl = linkElement.attr('href') || '';
        if (productUrl) break;
      }
    }
    
    // Fix relative URLs
    if (productUrl && !productUrl.startsWith('http')) {
      productUrl = website.url + (productUrl.startsWith('/') ? productUrl : '/' + productUrl);
    }
    
    // Extract product image
    let productImage = '';
    for (const selector of COMMON_IMAGE_SELECTORS) {
      const imageElement = firstProduct.find(selector).first();
      if (imageElement.length > 0) {
        productImage = imageElement.attr('src') || imageElement.attr('data-src') || '';
        if (productImage) break;
      }
    }
    
    // Fix relative image URLs
    if (productImage && !productImage.startsWith('http')) {
      productImage = website.url + (productImage.startsWith('/') ? productImage : '/' + productImage);
    }
    
    // Check if in stock (look for out-of-stock indicators)
    const outOfStockTexts = ['out of stock', 'rupture', 'épuisé', 'non disponible', 'hors stock'];
    const productText = firstProduct.text().toLowerCase();
    const inStock = !outOfStockTexts.some(text => productText.includes(text));
    
    return {
      country: {
        id: '9',
        name: 'Tunisia',
        code: 'TN',
        currencyCode: 'TND',
        currencySymbol: 'د.ت',
        flag: 'https://flagcdn.com/tn.svg'
      },
      price,
      originalPrice: price,
      source: website.name,
      sourceUrl: productUrl || website.searchUrl(productName),
      lastUpdated: new Date().toISOString(),
      inStock,
      productName: productTitle || productName,
      productImage
    };
  } catch (error) {
    console.error(`Error scraping ${website.name}:`, error);
    return null;
  }
};

// Function to notify about the current website being accessed
const notifyWebsiteChange = (website?: string) => {
  // Dispatch an event to notify about the website change
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('website-scraping', { 
      detail: { website }
    }));
  }
};

// Main function to scrape all Tunisian websites
export const scrapeTunisianWebsites = async (productName: string): Promise<PriceData[]> => {
  console.log(`Starting direct navigation to Tunisian websites for: ${productName}`);
  
  // For better reliability, scrape websites sequentially with a small delay between requests
  const results: (PriceData | null)[] = [];
  
  for (const website of TUNISIAN_WEBSITES) {
    try {
      // Notify about the current website being accessed
      notifyWebsiteChange(website.name);
      
      // Add a small delay between requests to avoid overwhelming the network
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Scrape this website
      const result = await scrapeWebsite(website, productName);
      results.push(result);
      
      // If we got a result, log it
      if (result) {
        console.log(`Successfully found price on ${website.name}: ${result.price} ${result.country.currencySymbol}`);
      }
    } catch (error) {
      console.error(`Error scraping ${website.name}:`, error);
      results.push(null);
    } finally {
      // Clear the current website notification
      notifyWebsiteChange(undefined);
    }
  }
  
  // Filter out null results
  const validResults = results.filter((result): result is PriceData => result !== null);
  
  console.log(`Found ${validResults.length} results from Tunisian websites`);
  return validResults;
};
