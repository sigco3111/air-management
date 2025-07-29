
import type { Country } from '../types';

const API_BASE_URL = 'https://restcountries.com/v3.1/alpha/';

export const fetchCountryData = async (code: string): Promise<Country | null> => {
  if (!code) return null;

  try {
    const response = await fetch(`${API_BASE_URL}${code}`);
    if (!response.ok) {
      // For codes like 'ATA' (Antarctica) which have no country data
      console.warn(`No country data found for code: ${code}`);
      return null;
    }
    const data = await response.json();
    return data[0] as Country;
  } catch (error) {
    console.error("Failed to fetch country data:", error);
    return null;
  }
};
