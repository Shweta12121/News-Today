import React, { useState, useEffect } from 'react';
import { getRecommendations, getReadHistory, getPreferredCategories } from '../services/recommendationService';

const RecommendedNews = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        
        // Get user read history
        const readHistory = getReadHistory();
        
        // Get user preferred categories
        const preferredCategories = getPreferredCategories();
        
        // Get recommendations based on user data
        const results = await getRecommendations({
          userId: 'anonymous', // In a real app, use actual user ID if available
          readArticles: readHistory,
          preferredCategories: preferredCategories
        });
        
        setRecommendations(results);
        setError(null);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="recommendations-container">
        <h2 className="section-title">Recommended For You</h2>
        <div className="loading">Loading recommendations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendations-container">
        <h2 className="section-title">Recommended For You</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="recommendations-container">
        <h2 className="section-title">Recommended For You</h2>
        <p>No recommendations available yet. Try reading some articles first!</p>
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      <h2 className="section-title">Recommended For You</h2>
      <div className="recommendations-grid">
        {recommendations.map((article) => (
          <div className="card" key={article.id}>
            {article.urlToImage && (
              <img 
                src={article.urlToImage} 
                alt={article.title} 
                className="card-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/100x70?text=News';
                }}
              />
            )}
            <div className="card-content">
              <h3 className="card-title">
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  {article.title}
                </a>
              </h3>
              <div className="card-source">
                {article.category && (
                  <span className="card-category">{article.category}</span>
                )}
                {article.score && (
                  <span className="relevance-score">
                    Relevance: {Math.round(article.score * 100)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedNews;