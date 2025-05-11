import React from 'react';
import { trackArticleRead } from '../services/trackingService';

// This component wraps your existing article components or links
// to track when users click on articles

const ArticleTracker = ({ article, children, className }) => {
  const handleClick = (e) => {
    // Track the article click
    trackArticleRead(article);
    
    // Log for debugging
    console.log(`Tracked click on article: ${article.title}`);
  };

  return (
    <div 
      className={className || ''}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export default ArticleTracker;