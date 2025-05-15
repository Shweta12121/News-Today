import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { trackArticleRead } from "../services/recommendationService";

function EverythingCard(props) {
  const navigate = useNavigate();

  // Early return if no props
  if (!props || !props.title) {
    return null;
  }

  // Track article impression when component mounts
  useEffect(() => {
    if (props && props.title) {
      const articleData = {
        title: props.title,
        url: props.url,
        source: props.source ? { name: props.source } : { name: "Unknown" },
        author: props.author,
        publishedAt: props.publishedAt,
        urlToImage: props.imgUrl,
        description: props.description
      };
      
      // Track as impression
      trackArticleRead("anonymous", articleData, "impression");
    }
  }, [props]);

  // Handle article click
  const handleArticleClick = () => {
    if (props && props.title) {
      const articleData = {
        title: props.title,
        url: props.url,
        source: props.source ? { name: props.source } : { name: "Unknown" },
        author: props.author,
        publishedAt: props.publishedAt,
        urlToImage: props.imgUrl,
        description: props.description
      };
      
      // Navigate to article detail page with article state
      navigate(`/article/${encodeURIComponent(props.url)}`, { 
        state: { article: articleData } 
      });
      
      // Track as click
      trackArticleRead("anonymous", articleData, "click");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    try {
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      };
      
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="everything-card mt-10 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="everything-card flex flex-col p-5 gap-3">
        <h3 className="title text-lg font-bold mb-2">{props.title}</h3>
        
        {props.imgUrl && (
          <div className="everything-card-img mx-auto">
            <img 
              className="w-full h-48 object-cover rounded-md" 
              src={props.imgUrl} 
              alt={props.title} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
              }}
            />
          </div>
        )}
        
        <div className="description">
          <p className="description-text leading-7 text-gray-600">
            {props.description ? props.description.substring(0, 200) : 'No description available'}
            {props.description && props.description.length > 200 ? '...' : ''}
          </p>
        </div>
        
        <div className="info mt-2">
          <div className="source-info flex items-center gap-2 text-sm text-gray-500">
            <span className="font-semibold">Source:</span>
            <span className="break-words">
              {props.source ? props.source.substring(0, 70) : 'Unknown source'}
              {props.source && props.source.length > 70 ? '...' : ''}
            </span>
          </div>
          <div className="origin flex flex-col mt-1 text-sm text-gray-500">
            <p className="origin-item">
              <span className="font-semibold">Author:</span> {props.author || 'Unknown'}
            </p>
            <p className="origin-item">
              <span className="font-semibold">Published:</span> {formatDate(props.publishedAt)}
            </p>
          </div>
        </div>
        
        <div className="w-full text-right mt-4">
          <button
            onClick={handleArticleClick}
            className="read-more-btn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
}

export default EverythingCard;