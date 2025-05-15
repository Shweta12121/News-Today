// src/services/recommendationService.js

/**
 * This service handles article tracking and generates recommendations based on user reading history
 */

// Constants
const LOCAL_STORAGE_KEY = 'readArticles';
const PREFERRED_CATEGORIES_KEY = 'preferredCategories';
const MAX_HISTORY_SIZE = 50;

/**
 * Track when a user reads or interacts with an article
 * @param {string} userId - User identifier (can be anonymous)
 * @param {Object} article - Article data
 * @param {string} interactionType - Type of interaction (impression, click, detail_view, external_click)
 */
export const trackArticleRead = (userId, article, interactionType = 'click') => {
  try {
    if (!article || !article.title) return false;
    
    // Get existing read history
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    let readArticles = storedData ? JSON.parse(storedData) : [];
    
    // Add category if not present
    if (article.source && article.source.name) {
      const sourceLower = article.source.name.toLowerCase();
      // Try to extract category from source name
      if (sourceLower.includes('tech') || sourceLower.includes('digital')) {
        article.category = 'technology';
      } else if (sourceLower.includes('sport')) {
        article.category = 'sports';
      } else if (sourceLower.includes('business') || sourceLower.includes('finance') || sourceLower.includes('economic')) {
        article.category = 'business';
      } else if (sourceLower.includes('health') || sourceLower.includes('medical')) {
        article.category = 'health';
      } else if (sourceLower.includes('entertain') || sourceLower.includes('hollywood')) {
        article.category = 'entertainment';
      } else if (sourceLower.includes('science')) {
        article.category = 'science';
      } else if (sourceLower.includes('politic')) {
        article.category = 'politics';
      }
    }
    
    // Add timestamp to track when the article was read
    const trackingData = {
      ...article,
      userId,
      interactionType,
      timestamp: new Date().toISOString(),
    };
    
    // Check if article already exists in history
    const existingIndex = readArticles.findIndex(item => item.url === article.url);
    
    if (existingIndex !== -1) {
      // Update existing entry with new interaction type
      readArticles[existingIndex] = {
        ...readArticles[existingIndex],
        interactionType, // Update to latest interaction
        timestamp: trackingData.timestamp, // Update timestamp
      };
    } else {
      // Add new article to history
      readArticles.unshift(trackingData);
    }
    
    // Limit the size of the history
    if (readArticles.length > MAX_HISTORY_SIZE) {
      readArticles = readArticles.slice(0, MAX_HISTORY_SIZE);
    }
    
    // Save back to localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(readArticles));
    
    return true;
  } catch (error) {
    console.error('Error tracking article:', error);
    return false;
  }
};

/**
 * Get recommended articles based on user's reading history
 * @param {number} limit - Maximum number of recommendations to return
 * @returns {Array} - List of recommended articles
 */
export const getRecommendations = (limit = 10) => {
  try {
    // Get read history
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedData) return [];
    
    const readArticles = JSON.parse(storedData);
    if (!readArticles || readArticles.length === 0) return [];
    
    // Count category frequencies
    const categoryStats = {};
    const sourceStats = {};
    
    readArticles.forEach(article => {
      // Track categories
      if (article.category) {
        categoryStats[article.category] = (categoryStats[article.category] || 0) + 1;
      }
      
      // Track sources
      if (article.source && article.source.name) {
        sourceStats[article.source.name] = (sourceStats[article.source.name] || 0) + 1;
      }
    });
    
    // Get user's preferred categories (if set)
    const preferredCategories = getPreferredCategories();
    
    // Find most read categories
    const sortedCategories = Object.entries(categoryStats)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
    
    // Find most read sources
    const sortedSources = Object.entries(sourceStats)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
    
    // Create simulated recommendations based on user's history
    // This could be replaced with actual API calls in production
    const recommendations = [];
    
    // Use a combination of already read articles and modify them to simulate recommendations
    for (let i = 0; i < readArticles.length && recommendations.length < limit; i++) {
      const baseArticle = readArticles[i];
      
      // Skip articles already in recommendations
      if (recommendations.some(rec => rec.url === baseArticle.url)) continue;
      
      // Create a modified version to simulate a recommendation
      const similarArticle = {
        ...baseArticle,
        title: `Similar: ${baseArticle.title.split(' ').slice(0, 5).join(' ')}...`,
        description: baseArticle.description || 'Related to your interests',
        recommended: true,
        recommendationReason: getRecommendationReason(baseArticle, sortedCategories, sortedSources, preferredCategories)
      };
      
      recommendations.push(similarArticle);
    }
    
    return recommendations.slice(0, limit);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [];
  }
};

/**
 * Get the reason for recommending an article
 */
function getRecommendationReason(article, topCategories, topSources, preferredCategories) {
  if (preferredCategories && preferredCategories.includes(article.category)) {
    return `Based on your category preference: ${article.category}`;
  }
  
  if (article.category && topCategories.includes(article.category)) {
    return `Based on your interest in ${article.category}`;
  }
  
  if (article.source && article.source.name && topSources.includes(article.source.name)) {
    return `From your trusted source: ${article.source.name}`;
  }
  
  return 'Similar to articles you have read';
}

/**
 * Save user's preferred news categories
 * @param {Array} categories - List of category names
 * @returns {boolean} - Success status
 */
export const savePreferredCategories = (categories) => {
  try {
    localStorage.setItem(PREFERRED_CATEGORIES_KEY, JSON.stringify(categories));
    return true;
  } catch (error) {
    console.error('Error saving preferred categories:', error);
    return false;
  }
};

/**
 * Get user's preferred news categories
 * @returns {Array} - List of category names
 */
export const getPreferredCategories = () => {
  try {
    const stored = localStorage.getItem(PREFERRED_CATEGORIES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error retrieving preferred categories:', error);
    return [];
  }
};

/**
 * Clear all tracking data (for testing)
 */
export const clearTrackingData = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  localStorage.removeItem(PREFERRED_CATEGORIES_KEY);
};