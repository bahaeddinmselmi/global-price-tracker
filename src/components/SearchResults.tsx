import React, { useState, useEffect } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import PriceChart from './PriceChart';
import PriceTable from './PriceTable';
import { ProductPrices } from '../types';
import {
  preparePriceChartData,
  generateExcelReport,
  convertCurrency
} from '../utils/helpers';
import { CURRENCIES } from '../utils/constants';

interface SearchResultsProps {
  productPrices: ProductPrices;
  onNewSearch: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  productPrices,
  onNewSearch
}) => {
  const [baseCurrency, setBaseCurrency] = useState<string>('USD');
  const [chartData, setChartData] = useState(
    preparePriceChartData(productPrices, 'USD')
  );
  const [convertedPrices, setConvertedPrices] = useState<number[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    setChartData(preparePriceChartData(productPrices, baseCurrency));
    
    if (baseCurrency === 'original') {
      setConvertedPrices([]);
    } else {
      const converted = productPrices.prices.map((price) =>
        convertCurrency(
          price.price,
          price.country.currencyCode,
          baseCurrency
        )
      );
      setConvertedPrices(converted);
    }
  }, [baseCurrency, productPrices]);

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      await generateExcelReport(
        productPrices,
        baseCurrency === 'original' ? null : baseCurrency
      );
    } catch (error) {
      console.error('Failed to export Excel:', error);
      alert('Failed to export Excel file. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const currencySymbol =
    baseCurrency === 'original'
      ? '$'
      : CURRENCIES[baseCurrency as keyof typeof CURRENCIES]?.symbol || '$';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {productPrices.productName}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Found {productPrices.prices.length} results across {new Set(productPrices.prices.map(p => p.country.name)).size} countries
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onNewSearch}
              className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              <RefreshCw size={16} className="mr-2" />
              New Search
            </button>
            
            <button
              onClick={handleExportExcel}
              disabled={isExporting}
              className={`flex items-center px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium transition-colors ${
                isExporting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isExporting ? (
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
                  Exporting...
                </>
              ) : (
                <>
                  <Download size={16} className="mr-2" />
                  Export Excel
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="mt-4">
          <label
            htmlFor="currency-select"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Display Currency
          </label>
          <select
            id="currency-select"
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
            className="block w-full md:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="original">Original Currencies</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="AUD">AUD (A$)</option>
            <option value="CAD">CAD (C$)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>
      </div>
      
      <div className="p-6 border-b border-gray-200">
        <PriceChart
          chartData={chartData}
          title={`${productPrices.productName} - Price Comparison`}
          currencySymbol={currencySymbol}
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Detailed Price Comparison
        </h3>
        <PriceTable
          prices={productPrices.prices}
          baseCurrency={baseCurrency === 'original' ? null : baseCurrency}
          convertedPrices={convertedPrices.length > 0 ? convertedPrices : undefined}
        />
      </div>
    </div>
  );
}

export default SearchResults