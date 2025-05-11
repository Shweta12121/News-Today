// Create this file at src/services/recommendationService.js

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Fetches personalized news recommendations
 * @param {Object} userPreferences - User preferences for recommendations
 * @param {string} userPreferences.userId - User identifier (or anonymous)
 * @param {Array} userPreferences.readArticles - Articles the user has read
 * @param {Array} userPreferences.preferredCategories - User's preferred categories
 * @returns {Promise} - Promise resolving to recommendation results
 */
export const getRecommendations = async (userPreferences = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userPreferences.userId || 'anonymous',
        readArticles: userPreferences.readArticles || [],
        preferredCategories: userPreferences.preferredCategories || [],
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.recommendations || [];
  } catch (error) {
    console.error('Failed to fetch recommendations:', error);
    return [];
  }
};

/**
 * Tracks when a user reads an article to improve recommendations
 * @param {string} userId - User identifier (or anonymous)
 * @param {Object} article - The article being read
 * @returns {Promise} - Promise resolving to tracking results
 */
export const trackArticleRead = async (userId, article) => {
  // In a real implementation, this would send the data to your backend
  // For now, we'll just store it in localStorage
  
  try {
    // Get existing read history from localStorage
    const readHistoryStr = localStorage.getItem('readArticles') || '[]';
    const readHistory = JSON.parse(readHistoryStr);
    
    // Add the article if it's not already in history
    const isArticleInHistory = readHistory.some(item => item.id === article.id);
    
    if (!isArticleInHistory) {
      readHistory.push({
        id: article.id,
        title: article.title,
        category: article.category,
        timestamp: new Date().toISOString()
      });
      
      // Keep only the last 20 articles
      const updatedHistory = readHistory.slice(-20);
      
      // Save back to localStorage
      localStorage.setItem('readArticles', JSON.stringify(updatedHistory));
    }
    
    return { success: true };
  } catch (error) {
    console.error('Failed to track article read:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Gets the user's read history from localStorage
 * @returns {Array} - Array of read articles
 */
export const getReadHistory = () => {
  try {
    const readHistoryStr = localStorage.getItem('readArticles') || '[]';
    return JSON.parse(readHistoryStr);
  } catch (error) {
    console.error('Failed to get read history:', error);
    return [];
  }
};

/**
 * Saves user category preferences
 * @param {Array} categories - User's preferred categories
 * @returns {boolean} - Success status
 */
export const savePreferredCategories = (categories) => {
  try {
    localStorage.setItem('preferredCategories', JSON.stringify(categories));
    return true;
  } catch (error) {
    console.error('Failed to save preferred categories:', error);
    return false;
  }
};

/**
 * Gets user's preferred categories
 * @returns {Array} - Preferred categories
 */
export const getPreferredCategories = () => {
  try {
    const categoriesStr = localStorage.getItem('preferredCategories') || '[]';
    return JSON.parse(categoriesStr);
  } catch (error) {
    console.error('Failed to get preferred categories:', error);
    return [];
  }
};