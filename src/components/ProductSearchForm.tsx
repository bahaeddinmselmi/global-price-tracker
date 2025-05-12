import React, { useState } from 'react';
import { Search } from 'lucide-react';
import CountrySelector from './CountrySelector';
import { Country } from '../types';
import { COUNTRIES } from '../utils/constants';

interface ProductSearchFormProps {
  onSearch: (productName: string, countries: Country[]) => void;
  isLoading: boolean;
}

const ProductSearchForm: React.FC<ProductSearchFormProps> = ({
  onSearch,
  isLoading
}) => {
  const [productName, setProductName] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!productName.trim()) {
      setError('Please enter a product name');
      return;
    }
    
    if (selectedCountries.length === 0) {
      setError('Please select at least one country');
      return;
    }
    
    setError(null);
    onSearch(productName.trim(), selectedCountries);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Find product prices around the world
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="productName" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Product Name
          </label>
          <div className="relative">
            <input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g., iPhone 15 Pro, Sony WH-1000XM5"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </div>
        
        <div>
          <label 
            htmlFor="countries" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select Countries
          </label>
          <CountrySelector
            countries={COUNTRIES}
            selectedCountries={selectedCountries}
            onChange={setSelectedCountries}
            isDisabled={isLoading}
          />
        </div>
        
        {error && (
          <div className="text-sm text-red-500 font-medium">{error}</div>
        )}
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Searching...
              </>
            ) : (
              <>
                <Search size={18} className="mr-2" />
                Compare Prices
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductSearchForm;