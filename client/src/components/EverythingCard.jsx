import React, { useEffect } from "react";
import { trackArticleRead } from "../services/recommendationService";

function EverythingCard(props) {
  // Track article impression when component mounts
  useEffect(() => {
    if (props && props.title) {
      const articleData = {
        title: props.title,
        url: props.url,
        source: props.source,
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
        source: props.source,
        author: props.author,
        publishedAt: props.publishedAt,
        urlToImage: props.imgUrl,
        description: props.description
      };
      
      // Track as click
      trackArticleRead("anonymous", articleData, "click");
    }
  };

  // Early return if no props
  if (!props || !props.title) {
    return null;
  }

  return (
    <div className="everything-card mt-10">
      <div className="everything-card flex flex-wrap p-5 gap-1 mb-1">
        <b className="title">{props.title}</b>
        {props.imgUrl && (
          <div className="everything-card-img mx-auto">
            <img 
              className="everything-card-img" 
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
          <p className="description-text leading-7">
            {props.description ? props.description.substring(0, 200) : 'No description available'}
            {props.description && props.description.length > 200 ? '...' : ''}
          </p>
        </div>
        <div className="info">
          <div className="source-info flex items-center gap-2">
            <span className="font-semibold">Source:</span>
            <span className="break-words">
              {props.source ? props.source.substring(0, 70) : 'Unknown source'}
              {props.source && props.source.length > 70 ? '...' : ''}
            </span>
          </div>
          <div className="origin flex flex-col">
            <p className="origin-item">
              <span className="font-semibold">Author:</span> {props.author || 'Unknown'}
            </p>
            <p className="origin-item">
              <span className="font-semibold">Published At:</span> {props.publishedAt || 'Unknown date'}
            </p>
          </div>
        </div>
        <div className="w-full text-right mt-4">
          <a
            href={props.url}
            target="_blank"
            rel="noopener noreferrer"
            className="read-more-btn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={handleArticleClick}
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
}

export default EverythingCard;