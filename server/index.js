require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// Apply CORS middleware to all routes
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Get API key from environment variables
const API_KEY = process.env.API_KEY || process.env.NEWS_API_KEY;

// Check if API key is available
if (!API_KEY) {
  console.error("ERROR: News API key is missing. Set the API_KEY environment variable.");
}

function fetchNews(url, res) {
  console.log(`Fetching news from: ${url.replace(API_KEY, 'API_KEY_HIDDEN')}`);
  
  axios.get(url)
    .then(response => {
      if (response.data.totalResults > 0) {
        res.json({
          status: 200,
          success: true,
          message: "Successfully fetched the data.",
          data: response.data
        });
      } else {
        res.json({
          status: 200,
          success: true,
          message: "No more results to show"
        });
      }
    })
    .catch(error => {
      console.error("News API Error:", error.response?.data || error.message);
      
      res.status(500).json({
        status: 500,
        success: false,
        message: "Failed to fetch data from API",
        error: error.response?.data?.message || error.message
      });
    });
}

// Route to get all news
app.get("/all-news", (req, res) => {
  let pageSize = parseInt(req.query.pageSize) || 40;
  let page = parseInt(req.query.page) || 1;
  let q = req.query.q || "news"; // Default search term if none provided
  
  // Fixed URL format - added search term for 'q' parameter
  let url = `https://newsapi.org/v2/everything?q=${q}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
  fetchNews(url, res);
});

// Top headlines route
app.get("/top-headlines", (req, res) => {
  let pageSize = parseInt(req.query.pageSize) || 80;
  let page = parseInt(req.query.page) || 1;
  let category = req.query.category || "general";
  let language = req.query.language || "en";
  
  let url = `https://newsapi.org/v2/top-headlines?category=${category}&language=${language}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
  fetchNews(url, res);
});

// Country specific news
app.get("/country/:iso", (req, res) => {
  let pageSize = parseInt(req.query.pageSize) || 80;
  let page = parseInt(req.query.page) || 1;
  const country = req.params.iso;
  
  let url = `https://newsapi.org/v2/top-headlines?country=${country}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
  fetchNews(url, res);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    apiKeyConfigured: !!API_KEY
  });
});

// Handle 404s
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: "Route not found"
  });
});

// Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
  console.log(`API Key configured: ${!!API_KEY}`);
});