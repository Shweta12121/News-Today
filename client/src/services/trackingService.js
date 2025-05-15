// src/services/trackingService.js



// Initialize the tracking system
export const initializeTracking = () => {
  // Ensure localStorage is available
  if (typeof localStorage === 'undefined') {
    console.error('localStorage is not available in this browser');
    return false;
  }
  
  // Initialize read articles array if it doesn't exist
  if (!localStorage.getItem('readArticles')) {
    localStorage.setItem('readArticles', JSON.stringify([]));
  }
  
  console.log('Tracking system initialized for recommendations');
  return true;
};

// Track when an article is viewed/clicked
export const trackArticleRead = (article) => {
  try {
    // Create a consistent ID if one doesn't exist
    const articleId = article.id || btoa(article.title || article.url || Math.random().toString())
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 12);
    
    // Add category info if available from the source
    const articleWithCategory = {
      ...article,
      id: articleId,
      category: article.category || getCategoryFromArticle(article)
    };
    
    // Get existing read articles
    const readArticles = JSON.parse(localStorage.getItem('readArticles')) || [];
    
    // Only add if not already in the list
    if (!readArticles.includes(articleId)) {
      readArticles.push(articleId);
      localStorage.setItem('readArticles', JSON.stringify(readArticles));
      
      // Also store full article data for recommendation system
      const allArticles = JSON.parse(localStorage.getItem('allArticles')) || [];
      
      // Check if article already exists in the array
      const existingIndex = allArticles.findIndex(a => a.id === articleId);
      
      if (existingIndex >= 0) {
        // Update existing article
        allArticles[existingIndex] = articleWithCategory;
      } else {
        // Add new article
        allArticles.push(articleWithCategory);
      }
      
      // Keep only the last 100 articles to prevent localStorage from getting too big
      const trimmedArticles = allArticles.slice(-100);
      localStorage.setItem('allArticles', JSON.stringify(trimmedArticles));
      
      console.log(`Tracked read for article: ${articleId}`);
    }
  } catch (error) {
    console.error('Error tracking article read:', error);
  }
};

// Track when multiple articles are loaded (for bulk processing)
export const trackArticlesBatch = (articles) => {
  try {
    if (!Array.isArray(articles) || articles.length === 0) {
      return;
    }
    
    // Process each article to ensure proper format
    const processedArticles = articles.map(article => {
      const articleId = article.id || btoa(article.title || article.url || Math.random().toString())
        .replace(/[^a-zA-Z0-9]/g, '')
        .substring(0, 12);
        
      return {
        ...article,
        id: articleId,
        category: article.category || getCategoryFromArticle(article)
      };
    });
    
    // Store articles for recommendations
    const allArticles = JSON.parse(localStorage.getItem('allArticles')) || [];
    const newAllArticles = [...allArticles];
    
    // Add or update articles in storage
    processedArticles.forEach(article => {
      const existingIndex = newAllArticles.findIndex(a => a.id === article.id);
      if (existingIndex >= 0) {
        newAllArticles[existingIndex] = article;
      } else {
        newAllArticles.push(article);
      }
    });
    
    // Keep only the last 100 articles
    const trimmedArticles = newAllArticles.slice(-100);
    localStorage.setItem('allArticles', JSON.stringify(trimmedArticles));
    
    console.log(`Tracked batch of ${processedArticles.length} articles`);
  } catch (error) {
    console.error('Error tracking articles batch:', error);
  }
};

// Get article recommendations based on user history
export const getRecommendations = (limit = 10) => {
  try {
    // Get user reading history
    const readArticles = JSON.parse(localStorage.getItem('readArticles')) || [];
    const allArticles = JSON.parse(localStorage.getItem('allArticles')) || [];
    
    // If no history or not enough articles to recommend from, return empty array
    if (readArticles.length === 0 || allArticles.length <= 1) {
      return [];
    }
    
    // Count sources and categories from read articles
    const sourceCounts = {};
    const categoryCounts = {};
    
    readArticles.forEach(id => {
      const article = allArticles.find(a => a.id === id);
      if (article) {
        if (article.source && article.source.name) {
          sourceCounts[article.source.name] = (sourceCounts[article.source.name] || 0) + 1;
        }
        if (article.category) {
          categoryCounts[article.category] = (categoryCounts[article.category] || 0) + 1;
        }
      }
    });
    
    // Find unread articles
    const unreadArticles = allArticles.filter(article => !readArticles.includes(article.id));
    
    // Score each unread article based on source and category matches
    const scoredArticles = unreadArticles.map(article => {
      let score = 0;
      
      // Add score based on source matches
      if (article.source && article.source.name && sourceCounts[article.source.name]) {
        score += sourceCounts[article.source.name];
      }
      
      // Add score based on category matches
      if (article.category && categoryCounts[article.category]) {
        score += categoryCounts[article.category] * 2; // Weight categories higher
      }
      
      return { ...article, score };
    });
    
    // Sort by score and return the top recommendations
    return scoredArticles
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
      
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
  }
};

// Helper function to guess category from article content
function getCategoryFromArticle(article) {
  // Try to extract category from URL or content
  const url = article.url || '';
  const title = article.title || '';
  const description = article.description || '';
  
  // Common categories to check for
  const categories = [
    'technology', 'tech', 'business', 'politics', 'sports', 
    'entertainment', 'health', 'science', 'world', 'economy'
  ];
  
  // Check URL first (most reliable)
  for (const category of categories) {
    if (url.toLowerCase().includes(`/${category}/`) || 
        url.toLowerCase().includes(`category=${category}`)) {
      return category;
    }
  }
  
  // Then check content
  const contentText = (title + ' ' + description).toLowerCase();
  for (const category of categories) {
    if (contentText.includes(category)) {
      return category;
    }
  }
  
  // Return undefined if can't determine
  return undefined;
}

// Clear all tracking data (for testing or privacy)
export const clearTrackingData = () => {
  localStorage.removeItem('readArticles');
  localStorage.removeItem('allArticles');
  console.log('All tracking data cleared');
};