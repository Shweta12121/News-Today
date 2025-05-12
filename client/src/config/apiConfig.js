// src/config/apiConfig.js

// Set the appropriate API URL based on environment
let API_BASE_URL;

// Check if we're in production
if (process.env.NODE_ENV === 'production') {
  // In production: either use a relative URL (if backend and frontend are deployed together)
  // or use the production API URL if they're deployed separately
  API_BASE_URL = ''; // Empty string means relative to current domain
  
  // If your backend is on a different domain, uncomment and use this instead:
  // API_BASE_URL = 'https://your-production-api.com';
} else {
  // In development: use localhost with your backend port
  API_BASE_URL = 'http://localhost:3000';
}

// News API endpoints
const API_ENDPOINTS = {
  TOP_HEADLINES: `${API_BASE_URL}/top-headlines`,
  SEARCH: `${API_BASE_URL}/all-news`,
  COUNTRY: `${API_BASE_URL}/country`,
  HEALTH_CHECK: `${API_BASE_URL}/health`,
};

// Helper function to build a URL with query parameters
export const buildApiUrl = (endpoint, params = {}) => {
  const url = new URL(endpoint, window.location.origin);
  
  // Add timestamp to prevent caching
  params._t = new Date().getTime();
  
  // Add all params to URL
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  
  return url.toString();
};

// API request helper function
export const fetchFromApi = async (endpoint, params = {}) => {
  try {
    const url = buildApiUrl(endpoint, params);
    console.log(`Fetching from: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle our custom API response format
    if (data.success && data.data) {
      return data.data;
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  fetchFromApi,
  buildApiUrl,
};