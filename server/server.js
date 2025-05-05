require("dotenv").config();

const express =require("express");
const axios = require("axios");
const cors = require("cors");
const { parse } = require("dotenv");

const app =express();
app.use(express.urlencoded({extended:true}));

const API_KEY = process.env.API_KEY;

function fetchNews(url,res){
    axios.get(url)
    .then(response =>{
        if(response.data.totalResults>0){
            res.json({
                status:200,
                success:true,
                message:"Successfully featched the data.",
                data:response.data
            })
        }
        else{
            res.json({
                status:200,
                success :true,
                message : "No more result to show"
            });
        }
    })
    .catch(error =>{
        res.json({
            status :500,
            success:false,
            message:"Failed to featch data from API",
            error:error.message
        });
    });
}


//rout to get all news.

app.get("/all-news", (req,res)=>{
    let pageSize= parseInt(req.query.pageize) ||40;
    let page = parseInt(req.query.page) || 1;
    let url=`https://newsapi.org/v2/everything?q=page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    fetchNews(url,res);
});

// top-headlines
app.options("/top-headlines",cors());
app.get("/top-headlines", (req,res)=>{
    let pageSize =parseInt(req.query.pageSize) ||80;
    let page = parseInt(req.query.page) || 1;
    let  category= req.query.category ||"business";
    let url=`https://newsapi.org/v2/top-headlines?category=${category}&language=en&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    fetchNews(url,res);
})

//country
app.options("/country/:ios", cors());
app.get("/country/:ios",(req,res)=>{
    let pageSize = parseInt(req.query.pageSize) || 80;
    let page = parseInt(req.query.page) || 1;
    const country =req.params.ios;
    let url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${API_KEY}&page=${page}&pageSize=${pageSize}`;
    fetchNews(url,res);
})

//port

const PORT =process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`);
});