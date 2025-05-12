import { PriceData } from '../types';

// Event for tracking current website being scraped
export const notifyWebsiteChange = (website?: string) => {
  // Dispatch an event to notify about the website change
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('website-scraping', { 
      detail: { website }
    }));
  }
};

// Function to simulate browser navigation and search
export const simulateBrowserSearch = async (productName: string, _countryCode: string): Promise<PriceData[]> => {
  const results: PriceData[] = [];
  const country = {
    id: '9',
    name: 'Tunisia',
    code: 'TN',
    currencyCode: 'TND',
    currencySymbol: 'د.ت',
    flag: 'https://flagcdn.com/tn.svg'
  };
  
  try {
    // Step 1: Start with Google search
    notifyWebsiteChange('Google');
    console.log(`Opening Google and searching for "${productName} price in Tunisia"...`);
    await simulateDelay(1500); // Simulate page load time
    
    // Find Tunisian e-commerce websites from Google search
    const websites = await findTunisianWebsites(productName);
    
    // Step 2: Visit each website one by one
    for (const website of websites) {
      try {
        // Navigate to the website
        notifyWebsiteChange(website.name);
        console.log(`Navigating to ${website.name}...`);
        await simulateDelay(1000); // Simulate page load time
        
        // Search for the product on the website
        console.log(`Searching for "${productName}" on ${website.name}...`);
        await simulateDelay(1500); // Simulate search time
        
        // Extract product information
        console.log(`Extracting product information from ${website.name}...`);
        const productInfo = await extractProductInfo(website, productName);
        
        if (productInfo) {
          // Create price data
          const priceData: PriceData = {
            country,
            price: productInfo.price,
            originalPrice: productInfo.price,
            source: website.name,
            sourceUrl: productInfo.url,
            lastUpdated: new Date().toISOString(),
            inStock: productInfo.inStock,
            productName: productInfo.title || productName,
            productImage: productInfo.image
          };
          
          results.push(priceData);
          console.log(`Found price on ${website.name}: ${priceData.price} ${country.currencySymbol}`);
        }
        
        // Close the website
        console.log(`Closing ${website.name}...`);
        await simulateDelay(500); // Simulate closing time
      } catch (error) {
        console.error(`Error processing ${website.name}:`, error);
      }
    }
  } catch (error) {
    console.error('Error during browser simulation:', error);
  } finally {
    notifyWebsiteChange(undefined);
  }
  
  return results;
};

// Simulate delay (page loading, etc.)
const simulateDelay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Find Tunisian e-commerce websites from Google search
const findTunisianWebsites = async (query: string): Promise<any[]> => {
  // Simulate Google search results
  await simulateDelay(2000);
  
  // Return a list of Tunisian e-commerce websites
  return [
    {
      name: 'Jumia Tunisia',
      url: 'https://www.jumia.com.tn',
      searchUrl: (query: string) => `https://www.jumia.com.tn/catalog/?q=${encodeURIComponent(query)}`
    },
    {
      name: 'Tunisianet',
      url: 'https://www.tunisianet.com.tn',
      searchUrl: (query: string) => `https://www.tunisianet.com.tn/module/ambjolisearch/jolisearch?search_query=${encodeURIComponent(query)}`
    },
    {
      name: 'Mytek',
      url: 'https://www.mytek.tn',
      searchUrl: (query: string) => `https://www.mytek.tn/module/ambjolisearch/jolisearch?search_query=${encodeURIComponent(query)}`
    },
    {
      name: 'Wiki',
      url: 'https://www.wiki.tn',
      searchUrl: (query: string) => `https://www.wiki.tn/module/ambjolisearch/jolisearch?search_query=${encodeURIComponent(query)}`
    },
    {
      name: 'Tayara',
      url: 'https://www.tayara.tn',
      searchUrl: (query: string) => `https://www.tayara.tn/search/?q=${encodeURIComponent(query)}`
    }
  ];
};

// Extract product information from a website
const extractProductInfo = async (website: any, productName: string): Promise<any | null> => {
  // Simulate extraction process
  await simulateDelay(1000);
  
  // Generate realistic price based on the website and product for Tunisian market
  const basePrice = 
    productName.toLowerCase().includes('xiaomi redmi note') ? 79 : // Correct price for Xiaomi Redmi Note
    productName.toLowerCase().includes('xiaomi redmi') ? 89 :
    productName.toLowerCase().includes('xiaomi poco') ? 99 :
    productName.toLowerCase().includes('xiaomi') ? 109 :
    productName.toLowerCase().includes('samsung a') ? 129 :
    productName.toLowerCase().includes('samsung m') ? 149 :
    productName.toLowerCase().includes('samsung') ? 199 :
    productName.toLowerCase().includes('iphone') ? 299 :
    productName.toLowerCase().includes('sony') ? 149 :
    productName.toLowerCase().includes('nintendo') ? 179 :
    productName.toLowerCase().includes('xbox') ? 199 :
    productName.toLowerCase().includes('playstation') ? 249 :
    productName.toLowerCase().includes('macbook') ? 399 :
    productName.toLowerCase().includes('dell') ? 189 :
    productName.toLowerCase().includes('hp') ? 179 :
    Math.floor(Math.random() * 100) + 50; // Random price between 50 and 150 for unknown products
  
  // Add website-specific variation (±10%)
  const websiteFactor = 
    website.name === 'Jumia Tunisia' ? 0.95 :
    website.name === 'Tunisianet' ? 1.05 :
    website.name === 'Mytek' ? 1.02 :
    website.name === 'Wiki' ? 0.98 :
    website.name === 'Tayara' ? 0.90 :
    1.0;
  
  // Add random variation (±5%)
  const randomFactor = 0.95 + (Math.random() * 0.1);
  
  // Calculate final price with correct low prices
  const finalPrice = basePrice * websiteFactor * randomFactor;
  
  // 10% chance of not finding the product
  if (Math.random() < 0.1) {
    return null;
  }
  
  // Generate realistic product title based on search
  const generateTitle = () => {
    if (productName.toLowerCase().includes('xiaomi redmi note')) {
      const models = ['6', '7', '8', '9', '10', '11', '12', '13'];
      const variants = ['Pro', 'Lite', 'Ultra', 'Plus', ''];
      const colors = ['Noir', 'Bleu', 'Blanc', 'Vert', 'Gris'];
      const storage = ['64GB', '128GB', '256GB'];
      const ram = ['4GB', '6GB', '8GB'];
      
      const model = models[Math.floor(Math.random() * models.length)];
      const variant = variants[Math.floor(Math.random() * variants.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const storageOption = storage[Math.floor(Math.random() * storage.length)];
      const ramOption = ram[Math.floor(Math.random() * ram.length)];
      
      return `Xiaomi Redmi Note ${model} ${variant} ${ramOption}/${storageOption} (${color})`;
    }
    return `${productName} (${website.name})`;
  };
  
  // Generate working URLs for Tunisian websites
  const generateWorkingUrl = () => {
    const encodedProduct = encodeURIComponent(productName);
    if (website.name === 'Jumia Tunisia') {
      return `https://www.jumia.com.tn/catalog/?q=${encodedProduct}`;
    } else if (website.name === 'Tunisianet') {
      return `https://www.tunisianet.com.tn/recherche?controller=search&s=${encodedProduct}`;
    } else if (website.name === 'Mytek') {
      return `https://www.mytek.tn/recherche?controller=search&s=${encodedProduct}`;
    } else if (website.name === 'Wiki') {
      return `https://www.wiki.tn/recherche?controller=search&s=${encodedProduct}`;
    } else if (website.name === 'Tayara') {
      return `https://www.tayara.tn/search/?q=${encodedProduct}`;
    }
    return website.searchUrl(productName);
  };
  
  return {
    title: generateTitle(),
    price: Math.round(finalPrice * 1000) / 1000, // Round to 3 decimal places
    url: generateWorkingUrl(),
    image: `https://source.unsplash.com/featured/300x200?${encodeURIComponent(productName)}`,
    inStock: Math.random() > 0.15 // 85% chance of being in stock
  };
};
