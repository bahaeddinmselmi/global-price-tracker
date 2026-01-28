import { fetchSerpApiPrices } from './serpApiService';
import { mockSaveSearchToHistory } from './mockPriceService';

// Redirect to Real API Service
export const fetchProductPrices = fetchSerpApiPrices;

// Keep history mock for now (uses localStorage)
export const saveSearchToHistory = mockSaveSearchToHistory;