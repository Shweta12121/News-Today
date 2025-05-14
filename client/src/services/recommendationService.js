/**
 * Recommendation Service
 * 
 * This service handles tracking user article interactions and generating recommendations
 * based on reading history. It stores data in localStorage for persistence across sessions.
 */

// Local storage keys
const READ_ARTICLES_KEY = 'readArticles';
const ARTICLE_IMPRESSIONS_KEY = 'articleImpressions';
const USER_PREFERENCES_KEY = 'userPreferences';

/**
 * Track when a user reads/clicks/views an article
 * 
 * @param {string} userId - User identifier (or "anonymous" for non-logged in users)
 * @param {Object} article - Article data object
 * @param {string} interactionType - Type of interaction ("impression", "click", "detail_view")
 */
export const trackArticleRead = (userId, article, interactionType = 'click') => {
  if (!article || !article.title) return;
  
  try {
    // Get existing read history
    const readArticles = JSON.parse(localStorage.getItem(READ_ARTICLES_KEY)) || [];
    const articleImpressions = JSON.parse(localStorage.getItem(ARTICLE_IMPRESSIONS_KEY)) || [];
    
    // Current timestamp
    const timestamp = new Date().toISOString();
    
    // Different handling based on interaction type
    if (interactionType === 'impression') {
      // For impressions, just add to impressions list if not already there
      const existingImpression = articleImpressions.find(item => item.url === article.url);
      if (!existingImpression) {
        articleImpressions.push({
          ...article,
          timestamp,
          userId
        });
        localStorage.setItem(ARTICLE_IMPRESSIONS_KEY, JSON.stringify(articleImpressions));
      }
    } else {
      // For clicks and detailed views, add to read history
      const existingArticle = readArticles.find(item => item.url === article.url);
      
      if (existingArticle) {
        // Update existing entry with new timestamp and increment view count
        existingArticle.lastRead = timestamp;
        existingArticle.viewCount = (existingArticle.viewCount || 1) + 1;
      } else {
        // Add new entry
        readArticles.push({
          ...article, 
          firstRead: timestamp,
          lastRead: timestamp,
          viewCount: 1,
          userId
        });
      }
      
      // Store updated read history
      localStorage.setItem(READ_ARTICLES_KEY, JSON.stringify(readArticles));
      
      // Update user preferences based on this article
      updateUserPreferences(article);
    }
  } catch (error) {
    console.error('Error tracking article read:', error);
  }
};

/**
 * Update user preferences based on articles they read
 * 
 * @param {Object} article - Article data
 */
const updateUserPreferences = (article) => {
  try {
    const userPrefs = JSON.parse(localStorage.getItem(USER_PREFERENCES_KEY)) || {
      sources: {},
      categories: {},
      authors: {}
    };
    
    // Update source preference
    if (article.source && article.source.name) {
      const sourceName = article.source.name;
      userPrefs.sources[sourceName] = (userPrefs.sources[sourceName] || 0) + 1;
    }
    
    // Update author preference
    if (article.author) {
      userPrefs.authors[article.author] = (userPrefs.authors[article.author] || 0) + 1;
    }
    
    // Update category preference if available
    if (article.category) {
      userPrefs.categories[article.category] = (userPrefs.categories[article.category] || 0) + 1;
    }
    
    localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(userPrefs));
  } catch (error) {
    console.error('Error updating user preferences:', error);
  }
};

/**
 * Get recommendations based on user reading history
 * 
 * @param {number} limit - Maximum number of recommendations to return
 * @returns {Array} - Array of recommended articles
 */
export const getRecommendations = (limit = 10) => {
  try {
    const readArticles = JSON.parse(localStorage.getItem(READ_ARTICLES_KEY)) || [];
    const articleImpressions = JSON.parse(localStorage.getItem(ARTICLE_IMPRESSIONS_KEY)) || [];
    const userPrefs = JSON.parse(localStorage.getItem(USER_PREFERENCES_KEY)) || { sources: {}, categories: {}, authors: {} };
    
    // If no read history, return empty recommendations
    if (readArticles.length === 0) {
      return [];
    }
    
    // Combine impressions and remove articles already read
    const readUrls = new Set(readArticles.map(a => a.url));
    const candidateArticles = articleImpressions.filter(article => !readUrls.has(article.url));
    
    // Score each candidate article
    const scoredArticles = candidateArticles.map(article => {
      let score = 0;
      
      // Score based on source preference
      if (article.source && article.source.name && userPrefs.sources[article.source.name]) {
        score += userPrefs.sources[article.source.name] * 2;
      }
      
      // Score based on author preference
      if (article.author && userPrefs.authors[article.author]) {
        score += userPrefs.authors[article.author] * 1.5;
      }
      
      // Score based on category preference
      if (article.category && userPrefs.categories[article.category]) {
        score += userPrefs.categories[article.category] * 3;
      }
      
      return { ...article, score };
    });
    
    // Sort by score and take the top results
    const recommendations = scoredArticles
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((article, index) => ({
        ...article,
        id: `rec-${index}`
      }));
    
    return recommendations;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
  }
};

/**
 * Clear all tracking data from localStorage
 */
export const clearTrackingData = () => {
  try {
    localStorage.removeItem(READ_ARTICLES_KEY);
    localStorage.removeItem(ARTICLE_IMPRESSIONS_KEY);
    localStorage.removeItem(USER_PREFERENCES_KEY);
  } catch (error) {
    console.error('Error clearing tracking data:', error);
  }
};