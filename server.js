const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const ejs = require("ejs");

// Scraping tools
const axios = require("axios");
const cheerio = require("cheerio");


// Require models
let db = require("./models");

let PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", ejs);

// connect to mongoose
mongoose.connect("mongodb://localhost/news-scrape", {
    useNewUrlParser: true
});
let mongooseCheck = mongoose.connection;

// check mongoose connection
mongooseCheck.on("error", console.error.bind(console, "connection error: "));
mongooseCheck.once("open", () => {
    console.log("connected to mongoose");
});

// routes
app.get("/scrape", (req, res) => {

    axios.get("https://old.reddit.com/").then((response) => {
        let $ = cheerio.load(response.data);

        $("p.title").each((i, element) => {
            let dataObj = {};

            dataObj.title = $(this)
                .children("a")
                .text();

            dataObj.link = $(this)
                .children("a")
                .text();

            dataObj.summary = $(this)
                .children("a")
                .text();


            db.Articles.create(dataObj)
                .then((dbArticles) => {
                    console.log(dbArticles);
                })
                .catch((err) => {
                    console.log(err);
                });
        });
        res.send("scrape complete");
    });
});

app.get("/articles", (req, res) => {
    db.Articles.find({})
    .then((dbArticles) => {
        res.json(dbArticles);
    })
    .catch((err) => {
        res.json(err)
    });
});

// listen for port
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`)
})