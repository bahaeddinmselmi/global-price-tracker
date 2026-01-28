import { ProductPrices, Country, PriceData } from '../types';

const API_KEY = "86450d04060d34b74870d45b99c20261e70ce1a3bcb2b91f1b3c020f1fe5a32e";

export const fetchSerpApiPrices = async (
    productName: string,
    countries: Country[]
): Promise<ProductPrices> => {
    const allPrices: PriceData[] = [];

    // Fetch from each country
    const promises = countries.map(async (country) => {
        try {
            // Direct call to SerpAPI (Note: This exposes the key, but is required for client-side demo)
            // In production, this should be proxied via a backend.
            const response = await fetch(
                `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(productName)}&gl=${country.code.toLowerCase()}&hl=en&api_key=${API_KEY}`
            );

            const data = await response.json();

            if (data.shopping_results) {
                const countryPrices: PriceData[] = data.shopping_results.map((item: any) => ({
                    country: country,
                    price: item.extract_price || item.price || 0,
                    originalPrice: item.extract_price || item.price || 0,
                    source: item.source || item.merchant || "Google Shopping",
                    sourceUrl: item.link,
                    lastUpdated: new Date().toISOString(),
                    inStock: true, // Google Shopping usually shows in-stock items
                    productName: item.title,
                    productImage: item.thumbnail
                }));
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

    // If no results found, return empty structure (prevent crashing)
    return {
        productName,
        productId: `serp-${Date.now()}`,
        prices: allPrices,
        searchDate: new Date().toISOString(),
        productImage: allPrices[0]?.productImage // Use first image found
    };
};
