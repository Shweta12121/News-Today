import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import numpy as np

# Download necessary NLTK data
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')

def preprocess_text(text):
    """
    Preprocess text by removing special characters, lowercasing, 
    and removing stopwords
    
    Parameters:
    text: Input text string
    
    Returns:
    Preprocessed text string
    """
    if not isinstance(text, str):
        return ""
    
    # Convert to lowercase
    text = text.lower()
    
    # Remove special characters and numbers
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    # Tokenize
    tokens = word_tokenize(text)
    
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [word for word in tokens if word not in stop_words]
    
    # Rejoin tokens
    return ' '.join(filtered_tokens)

def extract_features(articles, vectorizer, category_encoder):
    """
    Extract features from a list of articles
    
    Parameters:
    articles: List of article dictionaries
    vectorizer: TF-IDF vectorizer
    category_encoder: One-hot encoder for categories
    
    Returns:
    Combined feature vector
    """
    if not articles:
        # Return a zero vector if no articles
        return np.zeros(vectorizer.get_feature_names_out().shape[0] + 
                       category_encoder.get_feature_names_out().shape[0])
    
    # Extract text content
    texts = [article.get('content', article.get('title', '')) for article in articles]
    preprocessed_texts = [preprocess_text(text) for text in texts]
    
    # Get text features
    if vectorizer:
        text_features = vectorizer.transform(preprocessed_texts).toarray()
        # Average across all articles
        avg_text_features = np.mean(text_features, axis=0)
    else:
        # If no vectorizer, return zeros
        avg_text_features = np.zeros(5000)  # Assuming max_features=5000
    
    # Extract categories
    categories = [[article.get('category', 'general')] for article in articles]
    
    # Get category features
    if category_encoder:
        try:
            category_features = category_encoder.transform(categories)
            avg_category_features = np.mean(category_features, axis=0)
        except Exception:
            # If categories are not in the encoder
            avg_category_features = np.zeros(len(category_encoder.get_feature_names_out()))
    else:
        # If no encoder, return zeros (assuming 5 categories)
        avg_category_features = np.zeros(5)
    
    # Combine features
    return np.concatenate([avg_text_features, avg_category_features])

def calculate_user_profile(read_articles, article_vectors):
    """
    Calculate user profile based on reading history
    
    Parameters:
    read_articles: List of article IDs read by the user
    article_vectors: Dictionary mapping article IDs to feature vectors
    
    Returns:
    User profile vector
    """
    # Get vectors for read articles
    read_vectors = [article_vectors.get(article_id) for article_id in read_articles 
                   if article_id in article_vectors]
    
    if not read_vectors:
        # Return zero vector if no valid articles
        return np.zeros(next(iter(article_vectors.values())).shape)
    
    # Average the vectors (simple approach)
    return np.mean(read_vectors, axis=0)