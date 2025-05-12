import React, { useState } from 'react';
import SearchResults from './SearchResults';

function Search() {
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 3) {
      setShowResults(true);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === '') {
      setShowResults(false);
    }
  };

  return (
    <>
      <form className='search-bar my-8 text-center px-2 xs:mb-10 md:mb-16' onSubmit={handleSearch}>
        <input 
          type="text" 
          name='search' 
          value={searchQuery}
          onChange={handleInputChange}
          className="search-box md:w-2/4 sm:p-4 xs:px-2" 
          placeholder='Search News' 
        />
        <button type='submit' className='btn'>Search</button>
      </form>
      
      {showResults && <SearchResults initialSearchTerm={searchQuery} />}
    </>
  );
}

export default Search;