import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import countries from "./countries";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowDown } from '@fortawesome/free-solid-svg-icons';

function Header() {
  const [active, setActive] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to light-theme
    return localStorage.getItem('theme') || "light-theme";
  });

  const category = ["business", "entertainment", "general", "health", "science", "sports", "technology", "politics"];

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (active && !e.target.closest('.nav-ul') && !e.target.closest('.ham-burger')) {
        setActive(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [active]);

  // Apply theme to body and save to localStorage
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light-theme" ? "dark-theme" : "light-theme");
  };

  // Close dropdowns when clicking elsewhere
  useEffect(() => {
    const closeDropdowns = (e) => {
      if (!e.target.closest('.dropdown-li')) {
        setShowCountryDropdown(false);
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('click', closeDropdowns);
    return () => document.removeEventListener('click', closeDropdowns);
  }, []);

  return (
    <header className="">
      <nav className="fixed top-0 left-0 w-full h-auto bg-gray-800 z-10 flex items-center justify-around py-3 px-4 shadow-md">
        <h3 className="relative heading font-bold text-white md:basis-1/6 text-2xl xs:basis-4/12 z-50">News_Aggregator</h3>

        <ul className={active ? "nav-ul flex gap-11 md:gap-14 xs:gap-12 lg:basis-3/6 md:basis-4/6 md:justify-end active" : "nav-ul flex gap-14 lg:basis-3/6 md:basis-4/6 justify-end text-white"}>
          <li><Link className="no-underline font-semibold" to="/" onClick={() => setActive(false)}>All News</Link></li>

          <li className="dropdown-li">
            <Link className="no-underline font-semibold flex items-center gap-2" 
              onClick={(e) => { 
                e.preventDefault();
                setShowCategoryDropdown(!showCategoryDropdown); 
                setShowCountryDropdown(false); 
              }}>
              Top-Headlines <FontAwesomeIcon className={showCategoryDropdown ? "down-arrow-icon down-arrow-icon-active" : "down-arrow-icon"} icon={faCircleArrowDown} />
            </Link>
            <ul className={showCategoryDropdown ? "dropdown p-2 show-dropdown" : "dropdown p-2"}>
              {category.map((element, index) => (
                <li key={index} onClick={() => {
                  setShowCategoryDropdown(false);
                  setActive(false);
                }}>
                  <Link to={`/top-headlines/${element}`} className="flex gap-3 capitalize">
                    {element}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          <li>
            <Link to="/recommended" className="flex items-center gap-1 font-semibold no-underline text-white" onClick={() => setActive(false)}>
              <span>Recommended</span>
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">New</span>
            </Link>
          </li>

          <li className="dropdown-li">
            <Link className="no-underline font-semibold flex items-center gap-2" 
              onClick={(e) => { 
                e.preventDefault();
                setShowCountryDropdown(!showCountryDropdown); 
                setShowCategoryDropdown(false); 
              }}>
              Country <FontAwesomeIcon className={showCountryDropdown ? "down-arrow-icon down-arrow-icon-active" : "down-arrow-icon"} icon={faCircleArrowDown} />
            </Link>
            <ul className={showCountryDropdown ? "dropdown p-2 show-dropdown" : "dropdown p-2"}>
              {countries.map((element, index) => (
                <li key={index} onClick={() => {
                  setShowCountryDropdown(false);
                  setActive(false);
                }}>
                  <Link to={`/country/${element?.iso_2_alpha}`} className="flex gap-3 items-center">
                    <img
                      src={element?.png}
                      srcSet={`https://flagcdn.com/32x24/${element?.iso_2_alpha}.png 2x`}
                      alt={element?.countryName}
                    />
                    <span>{element?.countryName}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          <li>
            {/* Theme toggle button */}
            <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white">
              {theme === "dark-theme" ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </li>
        </ul>

        <div className={active ? "ham-burger z-index-100 ham-open" : "ham-burger z-index-100"} onClick={() => setActive(!active)}>
          <span className="lines line-1"></span>
          <span className="lines line-2"></span>
          <span className="lines line-3"></span>
        </div>
      </nav>
    </header>
  );
}

export default Header;