import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecommendations, clearTrackingData, trackArticleRead } from '../services/recommendationService';
import Loader from './Loader';
import CategoryPreferences from './CategoryPreferences';

const RecommendedNews = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasReadHistory, setHasReadHistory] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = () => {
    setLoading(true);
    try {
      // Get recommendations from recommendation service
      const recommendedArticles = getRecommendations(10);
      setRecommendations(recommendedArticles);
      
      // Check if user has any reading history
      const readHistory = JSON.parse(localStorage.getItem('readArticles')) || [];
      setHasReadHistory(readHistory.length > 0);
    } catch (error) {
      console.error("Error getting recommendations:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Format the date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    try {
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
      };
      
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return 'Unknown date';
    }
  };
  
  // Handle tracking reset (for testing purposes)
  const handleResetTracking = () => {
    if (window.confirm('This will clear your reading history and recommendations. Continue?')) {
      clearTrackingData();
      setRecommendations([]);
      setHasReadHistory(false);
    }
  };

  // Handle article clicks
  const handleArticleClick = (article) => {
    // Track the click
    trackArticleRead("anonymous", article, "click");
    
    // Navigate to article detail
    navigate(`/article/${encodeURIComponent(article.url)}`, { 
      state: { article } 
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Recommended For You</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowPreferences(!showPreferences)}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            {showPreferences ? 'Hide Preferences' : 'Customize'}
          </button>
          <button 
            onClick={handleResetTracking}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Reset History
          </button>
        </div>
      </div>
      
      {showPreferences && <CategoryPreferences refreshRecommendations={fetchRecommendations} />}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : (
        <>
          {!hasReadHistory ? (
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <h2 className="text-xl font-semibold mb-3">No Recommendations Yet</h2>
              <p className="text-gray-600 mb-4">
                Start reading articles across the site to get personalized recommendations based on your interests.
              </p>
              <p className="text-sm text-gray-500">
                Our recommendation system tracks the topics and sources you read to suggest similar content.
              </p>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="bg-yellow-50 p-6 rounded-lg text-center">
              <h2 className="text-xl font-semibold mb-3">Building Your Recommendations</h2>
              <p className="text-gray-600">
                We're analyzing your reading history. Check back soon for personalized recommendations!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((article, index) => (
                <div 
                  key={`${article.url}-${index}`} 
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  {article.urlToImage && (
                    <img 
                      src={article.urlToImage} 
                      alt={article.title} 
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() => handleArticleClick(article)}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/640x360?text=No+Image';
                      }}
                    />
                  )}
                  
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2 cursor-pointer hover:text-blue-600"
                        onClick={() => handleArticleClick(article)}>
                      {article.title}
                    </h2>
                    
                    {article.description && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.description}
                      </p>
                    )}
                    
                    {article.recommendationReason && (
                      <p className="text-sm text-blue-500 italic mb-3">
                        {article.recommendationReason}
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-gray-500">
                        {article.source?.name || 'Unknown source'}
                      </div>
                      
                      <div className="text-gray-500">
                        {formatDate(article.publishedAt)}
                      </div>
                    </div>
                    
                    {article.category && (
                      <div className="mt-3">
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {article.category}
                        </span>
                      </div>
                    )}
                    
                    <div className="mt-4 text-right">
                      <button 
                        onClick={() => handleArticleClick(article)}
                        className="inline-block px-4 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecommendedNews;