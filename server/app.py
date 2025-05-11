
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import json
import numpy as np
import pandas as pd
from utils import preprocess_text, extract_features
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load model and related components
MODEL_PATH = os.path.join('model', 'news_recommender.pkl')
VECTORIZER_PATH = os.path.join('model', 'tfidf_vectorizer.pkl')
CATEGORY_ENCODER_PATH = os.path.join('model', 'category_encoder.pkl')

try:
    # Load model and preprocessing components
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    category_encoder = joblib.load(CATEGORY_ENCODER_PATH)
    print("Model and components loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    # Initialize with None if models don't exist yet
    model = None
    vectorizer = None
    category_encoder = None

# Sample news data for testing if no read history
SAMPLE_NEWS = [
    {"id": 1, "title": "Global Economic Summit Addresses Climate Change", "category": "business"},
    {"id": 2, "title": "New Breakthrough in Quantum Computing", "category": "technology"},
    {"id": 3, "title": "Regional Elections Show Surprising Results", "category": "politics"},
    # Add more sample articles
]

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None
    })

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    try:
        data = request.json
        user_id = data.get('userId', 'anonymous')
        read_articles = data.get('readArticles', [])
        preferred_categories = data.get('preferredCategories', [])
        
        # For testing when model isn't available
        if model is None:
            print("Model not available, returning sample recommendations")
            return jsonify({
                "success": True,
                "recommendations": SAMPLE_NEWS[:5]
            })
        
        # Get article data
        # In production, you'd fetch this from your database or API
        # For now, we're using sample data
        all_articles = SAMPLE_NEWS
        
        # If we have read history, use model to make recommendations
        if read_articles:
            # Process the read articles to create user profile
            # This is simplified - your actual implementation will depend on your model
            user_features = extract_features(read_articles, vectorizer, category_encoder)
            
            # Get recommendations
            # Assuming your model returns article IDs with scores
            recommendations = model.predict(user_features)
            
            # Filter out already read articles
            read_ids = [article['id'] for article in read_articles]
            recommendations = [rec for rec in recommendations if rec['id'] not in read_ids]
            
            return jsonify({
                "success": True,
                "recommendations": recommendations[:5]  # Return top 5
            })
        else:
            # If no read history, return top articles from preferred categories
            if preferred_categories:
                filtered_articles = [article for article in all_articles 
                                    if article['category'] in preferred_categories]
            else:
                filtered_articles = all_articles
                
            return jsonify({
                "success": True,
                "recommendations": filtered_articles[:5]  # Return top 5
            })
            
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# Add additional routes as needed for your specific implementation

if __name__ == '__main__':
    app.run(debug=True, port=5000)