import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import { ProductPrices, ChartData } from '../types';
import { CHART_COLORS, CURRENCIES } from './constants';

export const formatCurrency = (
  amount: number,
  currencyCode: string,
  currencySymbol: string
): string => {
  // Special formatting for Tunisian Dinar
  if (currencyCode === 'TND') {
    return `${amount.toLocaleString(undefined, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    })} ${currencySymbol}`;
  }
  
  // Default formatting for other currencies
  return `${currencySymbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  const fromRate = CURRENCIES[fromCurrency as keyof typeof CURRENCIES]?.rate || 1;
  const toRate = CURRENCIES[toCurrency as keyof typeof CURRENCIES]?.rate || 1;
  
  // Convert to USD first, then to target currency
  const amountInUSD = amount / fromRate;
  return amountInUSD * toRate;
};

export const preparePriceChartData = (
  productPrices: ProductPrices,
  baseCurrency: string = 'USD'
): ChartData => {
  // Create more descriptive labels that include currency format
  const labels = productPrices.prices.map((price) => {
    // For Tunisia, use special formatting
    if (price.country.code === 'TN') {
      return `${price.country.name} (${price.country.currencySymbol})`;
    }
    return `${price.country.name} (${price.country.currencySymbol})`;
  });
  
  const data = productPrices.prices.map((price) => {
    if (baseCurrency === 'original') {
      return price.price;
    }
    return convertCurrency(
      price.price,
      price.country.currencyCode,
      baseCurrency
    );
  });
  
  return {
    labels,
    datasets: [
      {
        label: 'Price',
        data,
        backgroundColor: CHART_COLORS.slice(0, data.length),
        borderColor: CHART_COLORS.slice(0, data.length),
        borderWidth: 1
      }
    ]
  };
};

export const generateExcelReport = async (
  productPrices: ProductPrices,
  baseCurrency: string | null = null
): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Price Comparison');
  
  // Add logo and title
  worksheet.mergeCells('A1:G1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = `Price Comparison for: ${productPrices.productName}`;
  titleCell.font = { size: 16, bold: true };
  titleCell.alignment = { horizontal: 'center' };
  
  // Add search date
  worksheet.mergeCells('A2:G2');
  const dateCell = worksheet.getCell('A2');
  dateCell.value = `Search Date: ${formatDate(productPrices.searchDate)}`;
  dateCell.font = { size: 12, italic: true };
  dateCell.alignment = { horizontal: 'center' };
  
  // Add headers
  worksheet.addRow([]);
  const headerRow = worksheet.addRow([
    'Country',
    'Store',
    'Original Price',
    'Currency',
    baseCurrency ? `Price (${baseCurrency})` : '',
    'In Stock',
    'Last Updated'
  ]);
  headerRow.font = { bold: true };
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '2563EB' } // blue-600
    };
    cell.font = { bold: true, color: { argb: 'FFFFFF' } };
  });
  
  // Add data rows
  productPrices.prices.forEach((price) => {
    const row = [
      price.country.name,
      price.source,
      price.price.toFixed(2),
      price.country.currencyCode,
      baseCurrency
        ? convertCurrency(
            price.price,
            price.country.currencyCode,
            baseCurrency
          ).toFixed(2)
        : '',
      price.inStock ? 'Yes' : 'No',
      formatDate(price.lastUpdated)
    ];
    worksheet.addRow(row);
  });
  
  // Format columns
  worksheet.columns.forEach((column) => {
    column.width = 15;
    column.alignment = { horizontal: 'left' };
  });
  
  // Create blob and save file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  
  saveAs(
    blob,
    `${productPrices.productName.replace(/\s+/g, '_')}_price_comparison.xlsx`
  );
};