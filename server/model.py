import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import os
import nltk
from nltk.corpus import stopwords
from utils import preprocess_text
import requests
import json

# Create model directory if it doesn't exist
os.makedirs('model', exist_ok=True)

# Download nltk data
nltk.download('stopwords')
nltk.download('punkt')

class NewsRecommender:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=5000, stop_words='english')
        self.category_encoder = OneHotEncoder(sparse=False, handle_unknown='ignore')
        self.news_df = None
        self.content_matrix = None
        self.category_matrix = None
    
    def fetch_news_data(self):
        """
        Fetch news data from News API or use sample data
        In a real implementation, you would fetch more data or use your own dataset
        """
        # Sample data for demonstration
        # In a real implementation, replace this with your data source
        sample_data = [
            {"id": 1, "title": "Global Economic Summit Addresses Climate Change", 
             "content": "Leaders from around the world gathered to discuss economic policies that address climate concerns.",
             "category": "business"},
            {"id": 2, "title": "New Breakthrough in Quantum Computing", 
             "content": "Scientists have achieved a significant milestone in quantum computing technology.",
             "category": "technology"},
            {"id": 3, "title": "Regional Elections Show Surprising Results", 
             "content": "The latest regional elections have resulted in unexpected outcomes across several districts.",
             "category": "politics"},
            # Add more sample articles
        ]
        
        # Convert to DataFrame
        return pd.DataFrame(sample_data)
    
    def prepare_data(self):
        """Prepare and preprocess the news data"""
        # Fetch data
        self.news_df = self.fetch_news_data()
        
        # Preprocess text
        self.news_df['processed_content'] = self.news_df['content'].apply(preprocess_text)
        
        # Extract features
        self.extract_features()
        
    def extract_features(self):
        """Extract features from news articles"""
        # Text features using TF-IDF
        content_features = self.vectorizer.fit_transform(self.news_df['processed_content'])
        self.content_matrix = content_features.toarray()
        
        # Category features using one-hot encoding
        category_features = self.category_encoder.fit_transform(
            self.news_df[['category']]
        )
        self.category_matrix = category_features
        
    def build_model(self):
        """Build the recommendation model"""
        # This is a content-based recommendation model using cosine similarity
        # In a real implementation, you might use more sophisticated methods
        pass
    
    def get_recommendations(self, user_profile, top_n=5):
        """
        Get recommendations based on user profile
        
        Parameters:
        user_profile: Features representing user preferences
        top_n: Number of recommendations to return
        
        Returns:
        List of recommended article IDs
        """
        # Calculate similarity between user profile and all articles
        # In this simplified model, user_profile is a vector of the same dimensionality
        # as our content and category matrices
        
        # Combine content and category similarities
        # In a real implementation, you might use different weights
        combined_matrix = np.hstack((self.content_matrix, self.category_matrix))
        
        # Calculate similarity
        similarities = cosine_similarity([user_profile], combined_matrix)[0]
        
        # Get top N recommendations
        top_indices = similarities.argsort()[-top_n:][::-1]
        
        # Return recommendations as dictionaries
        recommendations = []
        for idx in top_indices:
            article = self.news_df.iloc[idx]
            recommendations.append({
                'id': int(article['id']),
                'title': article['title'],
                'category': article['category'],
                'score': float(similarities[idx])
            })
        
        return recommendations
    
    def predict(self, user_features):
        """
        Predict recommendations for a user
        
        Parameters:
        user_features: Features representing user preferences
        
        Returns:
        List of recommended articles
        """
        return self.get_recommendations(user_features)
    
    def save_model(self):
        """Save the model and related components"""
        joblib.dump(self, os.path.join('model', 'news_recommender.pkl'))
        joblib.dump(self.vectorizer, os.path.join('model', 'tfidf_vectorizer.pkl'))
        joblib.dump(self.category_encoder, os.path.join('model', 'category_encoder.pkl'))
        print("Model saved successfully!")

def train_model():
    """Train and save the recommendation model"""
    print("Training news recommendation model...")
    recommender = NewsRecommender()
    recommender.prepare_data()
    recommender.build_model()
    recommender.save_model()
    print("Model training completed!")

if __name__ == "__main__":
    train_model()