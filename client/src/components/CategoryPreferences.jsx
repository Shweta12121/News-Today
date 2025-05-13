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
    if (preferences && Array.isArray(preferences)) {
      setSelectedCategories(preferences);
    }
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
    <div className="category-preferences p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Customize Your News Feed</h2>
      <p className="mb-4">Select categories you're interested in:</p>
      
      <div className="categories-grid grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map(category => (
          <div 
            key={category}
            className={`category-item p-3 rounded-md cursor-pointer transition-colors ${
              selectedCategories.includes(category) 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => handleCategoryToggle(category)}
          >
            <span className="category-name capitalize">{category}</span>
          </div>
        ))}
      </div>
      
      <button 
        onClick={handleSave} 
        className="save-button mt-6 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
      >
        Save Preferences
      </button>
      
      {saveStatus && (
        <div className={`save-status mt-4 p-2 rounded ${
          saveStatus.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {saveStatus}
        </div>
      )}
    </div>
  );
};

export default CategoryPreferences;