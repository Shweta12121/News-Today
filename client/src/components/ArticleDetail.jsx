import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { trackArticleRead } from "../services/recommendationService";

const ArticleDetail = () => {
  const { url } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state?.article;

  // If we don't have the article data in location state, redirect to the actual URL
  React.useEffect(() => {
    if (!article && url) {
      try {
        const decodedUrl = decodeURIComponent(url);
        window.open(decodedUrl, "_blank");
        navigate(-1); // Go back after opening the article in a new tab
      } catch (e) {
        console.error("Error opening article URL:", e);
      }
    } else if (article) {
      // Track this article view
      trackArticleRead("anonymous", article, "detail_view");
    }
  }, [article, url, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    try {
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
      };
      
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return 'Unknown date';
    }
  };

  // If no article data, show loading while redirect happens
  if (!article) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Opening article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Article Header */}
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          <div className="flex flex-wrap justify-between text-gray-600 mb-2">
            <div className="mb-2 mr-4">
              <span className="font-semibold">Source:</span> {article.source?.name || 'Unknown'}
            </div>
            <div className="mb-2 mr-4">
              <span className="font-semibold">Author:</span> {article.author || 'Unknown'}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Published:</span> {formatDate(article.publishedAt)}
            </div>
          </div>
        </div>

        {/* Article Image */}
        {article.urlToImage && (
          <div className="article-image">
            <img 
              src={article.urlToImage} 
              alt={article.title}
              className="w-full h-auto max-h-96 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/1200x600?text=No+Image";
              }}
            />
          </div>
        )}

        {/* Article Content */}
        <div className="p-6">
          <div className="article-content mb-8">
            <p className="text-lg leading-relaxed mb-4">
              {article.description || 'No description available.'}
            </p>
            <p className="text-gray-600">
              This is a preview of the article. To read the full content, please visit the original source.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button 
              onClick={() => navigate(-1)} 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              ← Back
            </button>
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={() => trackArticleRead("anonymous", article, "external_click")}
            >
              Read Full Article
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;