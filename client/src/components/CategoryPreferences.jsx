import React, { useState, useEffect } from 'react';
import { savePreferredCategories, getPreferredCategories } from '../services/recommendationService';

const CategoryPreferences = () => {
  const categories = [
    'technology', 'business', 'health', 'sports', 
    'entertainment', 'science', 'politics', 'general'
  ];
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [saveStatus, setSaveStatus] = useState('');
  
  // Load existing preferences on mount
  useEffect(() => {
    const preferences = getPreferredCategories();
    setSelectedCategories(preferences);
  }, []);
  
  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };
  
  const handleSave = () => {
    const success = savePreferredCategories(selectedCategories);
    if (success) {
      setSaveStatus('Preferences saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } else {
      setSaveStatus('Error saving preferences. Please try again.');
    }
  };
  
  return (
    <div className="category-preferences">
      <h2>Customize Your News Feed</h2>
      <p>Select categories you're interested in:</p>
      
      <div className="categories-grid">
        {categories.map(category => (
          <div 
            key={category}
            className={`category-item ${selectedCategories.includes(category) ? 'selected' : ''}`}
            onClick={() => handleCategoryToggle(category)}
          >
            <span className="category-name">{category}</span>
          </div>
        ))}
      </div>
      
      <button onClick={handleSave} className="save-button">
        Save Preferences
      </button>
      
      {saveStatus && (
        <div className="save-status">{saveStatus}</div>
      )}
    </div>
  );
};

export default CategoryPreferences;