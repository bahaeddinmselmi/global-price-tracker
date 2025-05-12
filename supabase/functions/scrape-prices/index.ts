import { load } from "npm:cheerio@1.0.0-rc.12";
import { DOMParser } from "npm:linkedom@0.16.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface ScrapeRequest {
  productName: string;
  country: {
    code: string;
    currencyCode: string;
  };
}

interface PriceResult {
  price: number;
  source: string;
  sourceUrl: string;
  inStock: boolean;
  productName: string;
  productImage?: string;
}

// Define marketplace URLs and their regional variants
const MARKETPLACE_URLS = {
  amazon: {
    US: "amazon.com",
    GB: "amazon.co.uk",
    DE: "amazon.de",
    FR: "amazon.fr",
    JP: "amazon.co.jp",
    AU: "amazon.com.au",
    CA: "amazon.ca",
    IN: "amazon.in",
    TN: "amazon.fr"
  },
  ebay: {
    US: "ebay.com",
    GB: "ebay.co.uk",
    DE: "ebay.de",
    FR: "ebay.fr",
    AU: "ebay.com.au",
    CA: "ebay.ca",
    IN: "ebay.in",
    TN: "ebay.fr"
  },
  jumia: {
    TN: "jumia.com.tn"
  },
  aliexpress: {
    US: "aliexpress.com",
    GB: "aliexpress.com",
    DE: "aliexpress.com",
    FR: "aliexpress.com",
    JP: "aliexpress.com",
    AU: "aliexpress.com",
    CA: "aliexpress.com",
    IN: "aliexpress.com",
    TN: "aliexpress.com"
  }
};

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
];

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'User-Agent': getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        }
      });
      
      if (response.ok) return response;
      
      console.log(`Attempt ${i + 1} failed for ${url}: ${response.status}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    } catch (error) {
      console.error(`Attempt ${i + 1} failed for ${url}:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
}

async function scrapeAmazon(domain: string, productName: string): Promise<PriceResult | null> {
  try {
    console.log(`Scraping Amazon ${domain} for ${productName}...`);
    const searchUrl = `https://www.${domain}/s?k=${encodeURIComponent(productName)}`;
    const response = await fetchWithRetry(searchUrl, {});
    const html = await response.text();
    const $ = load(html);
    
    const firstResult = $('.s-result-item[data-component-type="s-search-result"]').first();
    if (!firstResult.length) {
      console.log(`No results found on Amazon ${domain}`);
      return null;
    }
    
    const priceText = firstResult.find('.a-price-whole').first().text().trim();
    const priceDecimal = firstResult.find('.a-price-fraction').first().text().trim();
    const productUrl = firstResult.find('a.a-link-normal').attr('href');
    const productTitle = firstResult.find('h2 span').text().trim();
    const productImage = firstResult.find('img.s-image').attr('src');
    
    if (!priceText) {
      console.log(`No price found on Amazon ${domain}`);
      return null;
    }
    
    const price = parseFloat(`${priceText.replace(/[^0-9]/g, '')}.${priceDecimal || '00'}`);
    
    return {
      price,
      source: 'Amazon',
      sourceUrl: productUrl?.startsWith('http') ? productUrl : `https://www.${domain}${productUrl}`,
      inStock: firstResult.find('.a-color-price').text().toLowerCase().includes('out of stock') === false,
      productName: productTitle,
      productImage
    };
  } catch (error) {
    console.error(`Error scraping Amazon ${domain}:`, error);
    return null;
  }
}

async function scrapeEbay(domain: string, productName: string): Promise<PriceResult | null> {
  try {
    console.log(`Scraping eBay ${domain} for ${productName}...`);
    const searchUrl = `https://www.${domain}/sch/i.html?_nkw=${encodeURIComponent(productName)}&_sop=12`;
    const response = await fetchWithRetry(searchUrl, {});
    const html = await response.text();
    const $ = load(html);
    
    const firstResult = $('.s-item__wrapper').first();
    if (!firstResult.length) {
      console.log(`No results found on eBay ${domain}`);
      return null;
    }
    
    const priceText = firstResult.find('.s-item__price').first().text().trim();
    const productUrl = firstResult.find('.s-item__link').attr('href');
    const productTitle = firstResult.find('.s-item__title').text().trim();
    const productImage = firstResult.find('.s-item__image-img').attr('src');
    
    if (!priceText) {
      console.log(`No price found on eBay ${domain}`);
      return null;
    }
    
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    
    return {
      price,
      source: 'eBay',
      sourceUrl: productUrl || `https://www.${domain}`,
      inStock: true,
      productName: productTitle,
      productImage
    };
  } catch (error) {
    console.error(`Error scraping eBay ${domain}:`, error);
    return null;
  }
}

async function scrapeJumia(domain: string, productName: string): Promise<PriceResult | null> {
  try {
    console.log(`Scraping Jumia ${domain} for ${productName}...`);
    const searchUrl = `https://www.${domain}/catalog/?q=${encodeURIComponent(productName)}`;
    const response = await fetchWithRetry(searchUrl, {});
    const html = await response.text();
    const $ = load(html);
    
    const firstResult = $('.prd._fb.col.c-prd').first();
    if (!firstResult.length) {
      console.log(`No results found on Jumia ${domain}`);
      return null;
    }
    
    const priceText = firstResult.find('.prc').first().text().trim();
    const productUrl = firstResult.find('a').attr('href');
    const productTitle = firstResult.find('.name').text().trim();
    const productImage = firstResult.find('img').attr('data-src');
    
    if (!priceText) {
      console.log(`No price found on Jumia ${domain}`);
      return null;
    }
    
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    
    return {
      price,
      source: 'Jumia',
      sourceUrl: productUrl?.startsWith('http') ? productUrl : `https://www.${domain}${productUrl}`,
      inStock: !firstResult.find('.out-of-stock').length,
      productName: productTitle,
      productImage
    };
  } catch (error) {
    console.error(`Error scraping Jumia ${domain}:`, error);
    return null;
  }
}

async function scrapeAliExpress(domain: string, productName: string): Promise<PriceResult | null> {
  try {
    console.log(`Scraping AliExpress for ${productName}...`);
    const searchUrl = `https://www.${domain}/wholesale?SearchText=${encodeURIComponent(productName)}`;
    const response = await fetchWithRetry(searchUrl, {});
    const html = await response.text();
    const $ = load(html);
    
    const firstResult = $('.list--gallery--C2f2tvm').first();
    if (!firstResult.length) {
      console.log('No results found on AliExpress');
      return null;
    }
    
    const priceText = firstResult.find('.price--currentPrice--Qswx4vv').first().text().trim();
    const productUrl = firstResult.find('a').attr('href');
    const productTitle = firstResult.find('.multi--titleText--nXeOvyr').text().trim();
    const productImage = firstResult.find('img').attr('src');
    
    if (!priceText) {
      console.log('No price found on AliExpress');
      return null;
    }
    
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    
    return {
      price,
      source: 'AliExpress',
      sourceUrl: productUrl?.startsWith('http') ? productUrl : `https://www.${domain}${productUrl}`,
      inStock: true,
      productName: productTitle,
      productImage
    };
  } catch (error) {
    console.error('Error scraping AliExpress:', error);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productName, country }: ScrapeRequest = await req.json();
    
    if (!productName || !country) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing request for ${productName} in ${country.code}`);
    const results: PriceResult[] = [];
    
    // Run all scraping operations in parallel
    const scrapePromises = [];
    
    // Amazon
    if (MARKETPLACE_URLS.amazon[country.code as keyof typeof MARKETPLACE_URLS.amazon]) {
      scrapePromises.push(
        scrapeAmazon(
          MARKETPLACE_URLS.amazon[country.code as keyof typeof MARKETPLACE_URLS.amazon],
          productName
        )
      );
    }
    
    // eBay
    if (MARKETPLACE_URLS.ebay[country.code as keyof typeof MARKETPLACE_URLS.ebay]) {
      scrapePromises.push(
        scrapeEbay(
          MARKETPLACE_URLS.ebay[country.code as keyof typeof MARKETPLACE_URLS.ebay],
          productName
        )
      );
    }
    
    // Jumia (Tunisia)
    if (country.code === 'TN' && MARKETPLACE_URLS.jumia.TN) {
      scrapePromises.push(
        scrapeJumia(
          MARKETPLACE_URLS.jumia.TN,
          productName
        )
      );
    }
    
    // AliExpress
    if (MARKETPLACE_URLS.aliexpress[country.code as keyof typeof MARKETPLACE_URLS.aliexpress]) {
      scrapePromises.push(
        scrapeAliExpress(
          MARKETPLACE_URLS.aliexpress[country.code as keyof typeof MARKETPLACE_URLS.aliexpress],
          productName
        )
      );
    }
    
    // Wait for all scraping operations to complete
    const scrapedResults = await Promise.all(scrapePromises);
    
    // Filter out null results and add valid ones to the results array
    results.push(...scrapedResults.filter((result): result is PriceResult => result !== null));

    console.log(`Found ${results.length} results for ${country.code}`);
    
    if (results.length === 0) {
      return new Response(
        JSON.stringify({ error: "No results found", details: "Could not find prices for the specified product" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Scraping error:', error);
    return new Response(
      JSON.stringify({ error: "Failed to scrape prices", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});