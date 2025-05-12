import React from 'react';
import { ExternalLink } from 'lucide-react';
import { PriceData } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';

interface PriceTableProps {
  prices: PriceData[];
  baseCurrency: string | null;
  convertedPrices?: number[];
}

const PriceTable: React.FC<PriceTableProps> = ({
  prices,
  baseCurrency,
  convertedPrices
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white divide-y divide-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider">
              Product
            </th>
            <th className="px-4 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider">
              Country
            </th>
            <th className="px-4 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider">
              Price
            </th>
            {baseCurrency && (
              <th className="px-4 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider">
                Price ({baseCurrency})
              </th>
            )}
            <th className="px-4 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider">
              Source
            </th>
            <th className="px-4 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider">
              Last Updated
            </th>
            <th className="px-4 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {prices.map((price, index) => (
            <tr key={`${price.country.code}-${price.source}-${index}`} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm">
                <div className="flex items-center space-x-3">
                  {price.productImage && (
                    <img
                      src={price.productImage}
                      alt={price.productName}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <span className="font-medium">{price.productName}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm">
                <div className="flex items-center">
                  <img
                    src={price.country.flag}
                    alt={`${price.country.name} flag`}
                    className="w-5 h-4 mr-2 object-cover"
                  />
                  {price.country.name}
                </div>
              </td>
              <td className="px-4 py-3 text-sm font-medium">
                {price.country.code === 'TN' 
                  ? <span className="font-bold text-green-700">
                      {price.price.toLocaleString(undefined, {
                        minimumFractionDigits: 3,
                        maximumFractionDigits: 3
                      })} {price.country.currencySymbol}
                    </span>
                  : formatCurrency(
                      price.price,
                      price.country.currencyCode,
                      price.country.currencySymbol
                    )
                }
              </td>
              {baseCurrency && (
                <td className="px-4 py-3 text-sm font-medium">
                  {convertedPrices ? (
                    <span className="font-medium">
                      {price.country.code === 'TN' && baseCurrency === 'TND'
                        ? `${convertedPrices[index].toLocaleString(undefined, {
                            minimumFractionDigits: 3,
                            maximumFractionDigits: 3
                          })} ${price.country.currencySymbol}`
                        : `${
                            CURRENCIES[baseCurrency as keyof typeof CURRENCIES]?.symbol || '$'
                          }${convertedPrices[index].toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}`
                      }
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
              )}
              <td className="px-4 py-3 text-sm">
                <a
                  href={price.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                  onClick={(e) => {
                    // Prevent default only if the URL is invalid
                    if (!price.sourceUrl.startsWith('http')) {
                      e.preventDefault();
                      console.error('Invalid URL:', price.sourceUrl);
                      alert('Sorry, this link appears to be invalid.');
                    }
                  }}
                >
                  {price.source}
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {formatDate(price.lastUpdated)}
              </td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    price.inStock
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {price.inStock ? 'In stock' : 'Out of stock'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PriceTable;

// Import needed for formatting
import { CURRENCIES } from '../utils/constants';