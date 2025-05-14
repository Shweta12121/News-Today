// src/components/Topheadlines.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Loader from "./Loader";

// Define the API base URL - fixed to use production URL
const API_BASE_URL = 'https://news-aggregator-dusky.vercel.app';

const Topheadlines = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 6;
    const navigate = useNavigate();

    const fetchHeadlines = async (currentPage) => {
        try {
            setLoading(true);
            // Add timestamp to prevent caching
            const timestamp = new Date().getTime();
            const category = 'general'; // or any category you prefer
            
            const response = await fetch(`${API_BASE_URL}/top-headlines?category=${category}&page=${currentPage}&pageSize=${pageSize}&_t=${timestamp}`);
            
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            
            const result = await response.json();
            
            // Check if we have our custom response format or direct NewsAPI format
            let newsData;
            if (result.success && result.data) {
                // Our custom API wrapper format
                newsData = result.data;
            } else {
                // Direct format
                newsData = result;
            }
            
            if (newsData.articles && newsData.articles.length > 0) {
                if (currentPage === 1) {
                    setArticles(newsData.articles);
                } else {
                    setArticles(prev => [...prev, ...newsData.articles]);
                }
                
                // Track if we have more articles
                setHasMore(newsData.articles.length === pageSize);
            } else {
                setHasMore(false);
            }
            setError(null);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(`Failed to load headlines: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHeadlines(1);
    }, []);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchHeadlines(nextPage);
    };

    // Fixed to use direct URL instead of navigating to a separate route
    const handleArticleClick = (article) => {
        window.open(article.url, "_blank", "noopener,noreferrer");
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (error && !articles.length) {
        return (
            <div className="error-container text-center my-5">
                <h3>Error</h3>
                <p>{error}</p>
                <button onClick={() => fetchHeadlines(1)} className="btn">Try Again</button>
            </div>
        );
    }

    return (
        <div className="headlines-container container mx-auto px-4 py-8">
            <h2 className="section-title text-2xl font-bold mb-6">Top Headlines</h2>
            {articles.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article, idx) => (
                            <div 
                                key={`${article.url}-${idx}`} 
                                className="news-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="card-img-container">
                                    {article.urlToImage ? (
                                        <img 
                                            className="w-full h-48 object-cover"
                                            src={article.urlToImage} 
                                            alt={article.title}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/640x360?text=No+Image';
                                            }}
                                        />
                                    ) : (
                                        <img 
                                            className="w-full h-48 object-cover" 
                                            src="https://via.placeholder.com/640x360?text=No+Image" 
                                            alt="Placeholder" 
                                        />
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="article-meta flex justify-between text-sm text-gray-500 mb-2">
                                        <span className="article-source">{article.source?.name || 'Unknown'}</span>
                                        <span className="article-date">{formatDate(article.publishedAt)}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 cursor-pointer hover:text-blue-600" onClick={() => handleArticleClick(article)}>
                                        {article.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.description}</p>
                                    <div className="mt-2 text-right">
                                        <button 
                                            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                            onClick={() => handleArticleClick(article)}
                                        >
                                            Read More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {hasMore && (
                        <div className="text-center mt-8">
                            <button 
                                onClick={loadMore} 
                                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </>
            ) : loading ? (
                <Loader />
            ) : (
                <div className="text-center py-10">
                    <p className="text-xl text-gray-600">No headlines available at the moment.</p>
                    <button 
                        onClick={() => fetchHeadlines(1)} 
                        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default Topheadlines;