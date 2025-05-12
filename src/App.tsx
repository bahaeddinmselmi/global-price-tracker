import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductSearchForm from './components/ProductSearchForm';
import SearchResults from './components/SearchResults';
import BrowserSimulationIndicator from './components/DirectScrapingIndicator';
import AISearchInterface from './components/AISearchInterface';
import { Country, ProductPrices } from './types';
import { fetchProductPrices, saveSearchToHistory } from './services/priceService';
import { aiSearch } from './services/aiSearchService';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [productPrices, setProductPrices] = useState<ProductPrices | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBrowserSimulating, setIsBrowserSimulating] = useState(false);
  const [currentWebsite, setCurrentWebsite] = useState<string | undefined>();
  const [isAiSearchActive, setIsAiSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string | undefined>();
  const [searchMethod, setSearchMethod] = useState<'standard' | 'browser' | 'ai'>('standard');
  
  // Listen for website updates from the scraping process
  useEffect(() => {
    const handleWebsiteUpdate = (event: Event) => {
      if (event instanceof CustomEvent && 'detail' in event) {
        const website = event.detail?.website;
        setCurrentWebsite(website);
      }
    };
    
    window.addEventListener('update-current-website', handleWebsiteUpdate);
    
    return () => {
      window.removeEventListener('update-current-website', handleWebsiteUpdate);
    };
  }, []);

  const handleSearch = async (productName: string, countries: Country[]) => {
    setIsLoading(true);
    setError(null);
    setProductPrices(null);
    setSearchTerm(productName);
    
    // Check if Tunisia is selected
    const tunisiaSelected = countries.some(country => country.code === 'TN');
    
    // Determine search method - AI is default for Tunisia
    if (tunisiaSelected) {
      setSearchMethod('ai');
      setIsAiSearchActive(true);
    } else {
      setSearchMethod('standard');
    }
    
    try {
      let data: ProductPrices;
      
      if (searchMethod === 'ai' && tunisiaSelected) {
        // Use AI search for Tunisia
        const tunisianPrices = await aiSearch(productName, 'TN');
        
        // If AI search found results, use them
        if (tunisianPrices.length > 0) {
          // Create product prices object with AI results
          data = {
            productName,
            productId: `${productName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
            prices: tunisianPrices,
            searchDate: new Date().toISOString()
          };
        } else {
          // Fall back to standard search if AI search didn't find anything
          data = await fetchProductPrices(productName, countries);
        }
      } else {
        // Use standard search for other countries
        data = await fetchProductPrices(productName, countries);
      }
      
      setProductPrices(data);
      
      // Save search to history
      await saveSearchToHistory(data);
    } catch (err) {
      setError('Failed to fetch product prices. Please try again.');
      console.error('Error fetching prices:', err);
    } finally {
      setIsLoading(false);
      setIsBrowserSimulating(false);
      setCurrentWebsite(undefined);
      setTimeout(() => {
        setIsAiSearchActive(false);
      }, 1000); // Keep AI interface visible a bit longer
    }
  };

  const handleNewSearch = () => {
    setProductPrices(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              International Product Price Tracker
            </h1>
            <p className="text-gray-600 text-lg">
              Compare prices across global marketplaces and save money on your purchases
            </p>
          </div>
          
          {!productPrices ? (
            <div className="my-8">
              <ProductSearchForm onSearch={handleSearch} isLoading={isLoading} />
              
              {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-blue-600 text-xl font-bold">1</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Enter Product</h3>
                  <p className="text-gray-600">
                    Type in the name of any product you want to compare prices for
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-teal-600 text-xl font-bold">2</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Select Countries</h3>
                  <p className="text-gray-600">
                    Choose which countries you want to compare prices from
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-purple-600 text-xl font-bold">3</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Get Results</h3>
                  <p className="text-gray-600">
                    View price comparisons and export to Excel for deeper analysis
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <SearchResults
              productPrices={productPrices}
              onNewSearch={handleNewSearch}
            />
          )}
        </div>
      </main>
      
      <Footer />
      
      {/* Search Visualization Interfaces */}
      {searchMethod === 'browser' && (
        <BrowserSimulationIndicator isActive={isBrowserSimulating} website={currentWebsite} />
      )}
      
      {searchMethod === 'ai' && (
        <AISearchInterface isActive={isAiSearchActive} searchTerm={searchTerm} />
      )}
    </div>
  );
}

export default App;