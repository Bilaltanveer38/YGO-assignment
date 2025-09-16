/**
 * Third-party API configuration
 * Centralized location for all external API endpoints
 */

export const API_CONFIG = {
  OPENWEATHERMAP: {
    BASE_URL: 'https://api.openweathermap.org',
    ENDPOINTS: {
      CURRENT_WEATHER: '/data/2.5/weather',
      GEOCODING: '/geo/1.0/direct',
      WEATHER_ICONS: 'https://openweathermap.org/img/wn'
    }
  }
} as const;

/**
 * Helper functions to build complete API URLs
 */
export const buildWeatherUrl = (city: string, apiKey: string): string => {
  const params = new URLSearchParams({
    q: city,
    appid: apiKey,
    units: 'metric'
  });
  return `${API_CONFIG.OPENWEATHERMAP.BASE_URL}${API_CONFIG.OPENWEATHERMAP.ENDPOINTS.CURRENT_WEATHER}?${params}`;
};

export const buildGeocodingUrl = (query: string, apiKey: string, limit: number = 5): string => {
  const params = new URLSearchParams({
    q: query,
    appid: apiKey,
    limit: limit.toString()
  });
  return `${API_CONFIG.OPENWEATHERMAP.BASE_URL}${API_CONFIG.OPENWEATHERMAP.ENDPOINTS.GEOCODING}?${params}`;
};

export const buildWeatherIconUrl = (iconCode: string, size: string = '2x'): string => {
  return `${API_CONFIG.OPENWEATHERMAP.ENDPOINTS.WEATHER_ICONS}/${iconCode}@${size}.png`;
};