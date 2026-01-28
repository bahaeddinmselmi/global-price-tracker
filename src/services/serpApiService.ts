import { ProductPrices, Country, PriceData } from '../types';
import { CURRENCIES } from '../utils/constants';

const API_KEY = "86450d04060d34b74870d45b99c20261e70ce1a3bcb2b91f1b3c020f1fe5a32e";

// Simple currency detection map
const SYMBOL_MAP: Record<string, string> = {
    '$': 'USD',
    '£': 'GBP',
    '€': 'EUR',
    '¥': 'JPY',
    '₹': 'INR',
    'د.ت': 'TND',
    'TND': 'TND',
    'DT': 'TND'
};

const detectCurrency = (priceStr: string): string => {
    if (!priceStr) return 'USD';
    for (const [symbol, code] of Object.entries(SYMBOL_MAP)) {
        if (priceStr.includes(symbol)) return code;
    }
    // Fallback: assume USD if usually international, or just return null to fallback to country default
    return 'USD';
};

const convertToCountryCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;

    // Convert to USD first
    const fromRate = CURRENCIES[fromCurrency as keyof typeof CURRENCIES]?.rate || 1;
    const toRate = CURRENCIES[toCurrency as keyof typeof CURRENCIES]?.rate || 1;

    const inUSD = amount / fromRate;
    return inUSD * toRate;
};

export const fetchSerpApiPrices = async (
    productName: string,
    countries: Country[]
): Promise<ProductPrices> => {
    const allPrices: PriceData[] = [];

    const promises = countries.map(async (country) => {
        try {
            const response = await fetch(
                `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(productName)}&gl=${country.code.toLowerCase()}&hl=en&num=10&api_key=${API_KEY}`
            );

            const data = await response.json();

            if (data.shopping_results) {
                const countryPrices: PriceData[] = data.shopping_results.map((item: any) => {
                    const rawPrice = item.extract_price || item.price || 0;
                    const priceStr = item.price || ""; // e.g. "$10.00" or "TND 50.00"

                    // 1. Detect currency of the result
                    const detectedCurrency = detectCurrency(priceStr);
                    const targetCurrency = country.currencyCode;

                    // 2. Normalize price to the country's currency if different
                    // e.g. item is $10 (USD), country is Tunisia (TND). We want 31 TND.
                    let finalPrice = rawPrice;
                    if (detectedCurrency !== targetCurrency) {
                        finalPrice = convertToCountryCurrency(rawPrice, detectedCurrency, targetCurrency);
                    }

                    return {
                        country: country,
                        price: finalPrice,
                        originalPrice: finalPrice,
                        source: item.source || item.merchant || "Google Shopping",
                        sourceUrl: item.product_link || item.link, // Prefer direct product link
                        lastUpdated: new Date().toISOString(),
                        inStock: true,
                        productName: item.title,
                        productImage: item.thumbnail
                    };
                });
                return countryPrices;
            }
            return [];
        } catch (error) {
            console.error(`Error fetching for ${country.name}:`, error);
            return [];
        }
    });

    const results = await Promise.all(promises);
    results.forEach(prices => allPrices.push(...prices));

    return {
        productName,
        productId: `serp-${Date.now()}`,
        prices: allPrices,
        searchDate: new Date().toISOString(),
        productImage: allPrices[0]?.productImage
    };
};
