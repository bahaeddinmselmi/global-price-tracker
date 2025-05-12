export interface Country {
  id: string;
  name: string;
  code: string;
  currencyCode: string;
  currencySymbol: string;
  flag: string;
}

export interface PriceData {
  country: Country;
  price: number;
  originalPrice: number;
  source: string;
  sourceUrl: string;
  lastUpdated: string;
  inStock: boolean;
  productName: string;
  productImage?: string;
}

export interface ProductPrices {
  productName: string;
  productId: string;
  productImage?: string;
  prices: PriceData[];
  searchDate: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}