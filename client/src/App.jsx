import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Header from "./components/Header";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CountryNews from './components/CountryNews';
import News from './components/Topheadlines';
import TopHeadlines from './components/Topheadlines';
import RecommendedNews from './components/RecommendedNews';
// Import tracking service
import { initializeTracking } from './services/trackingService';

export function App() {
  const [count, setCount] = useState(0);
  
  // Initialize tracking system when app loads
  useEffect(() => {
    initializeTracking();
    console.log("Recommendation tracking system initialized");
  }, []);

  return (
    <>
      <div className='w-full'>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<News/>} />
            <Route path="/top-headlines/:category" element={<TopHeadlines/>} />
            <Route path="/recommended" element={<RecommendedNews/>} />
            <Route path="/country/:ios" element={<CountryNews/>} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;