const express = require("express");
const mongoose  = require("mongoose");
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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", ejs);

// connect to mongoose
mongoose.connect("mongodb://localhost/news-scrape", { useNewUrlParser: true });
let mongooseCheck = mongoose.connection;

// check mongoose connection
mongooseCheck.on("error", console.error.bind(console, "connection error: "));
mongooseCheck.once("open", () => {
    console.log("connected to mongoose");
});

// routes
app.get("/scrape", (req, res) => {
    axios.get("https://www.nytimes.com/section/technology").then((response) => {
        var $ = cheerio.load(response.data);

        $("article div").each((i, element) => {
            var result = {};

            result.title = $(this)
            .children("h3", "h2", )
        })
    })
})

// listen for port
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`)
})