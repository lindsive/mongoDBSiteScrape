const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const ejs = require("ejs");

// Scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

// Require models
let db = require("./models");

let PORT = 3000;

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static("index.html"));
app.set("view engine", ejs);

// connect to mongoose
// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news-scrape";

// mongoose.connect(MONGODB_URI);
mongoose.connect("mongodb://localhost/news-scrape", {
    useNewUrlParser: true
});
// let mongooseCheck = mongoose.connection;

// check mongoose connection
let mongooseCheck = mongoose.connection;
mongooseCheck.on("error", console.error.bind(console, "connection error: "));
mongooseCheck.once("open", () => {
    console.log("connected to mongoose");
});

mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true })

// routes

// scrape route
app.get("/scrape", (req, res) => {

    axios.get("https://old.reddit.com/").then((response) => {
        let $ = cheerio.load(response.data);

        $("p.title").each((i, element) => {
            let dataObj = {};

            dataObj.title = $(element).text();

            dataObj.link = $(element).children().attr("href");

            db.Articles.create(dataObj)
                .then((dbArticles) => {
                    console.log(dbArticles);
                })
                .catch((err) => {
                    console.log(err);
                });
        });
        res.send("scrape complete");
        console.log(dataObj);
    });
});

// get all articles from db
app.get("/", (req, res) => {
    db.Articles.find({})
        .then((dbArticles) => {
            res.json(dbArticles);
        })
        .catch((err) => {
            res.json(err)
        });
});

// route to get an article by id and populate it with its note
app.get("/:id", (req, res) => {
    db.Articles.findOne({ _id: req.params.id })
        .populate("note")
        .then((dbArticles) => {
            res.json(dbArticles);
        });
});

// route to update/save an article's note
app.post("/:id", (req, res) => {
    db.Note.create(req.body)
        .then((dbNote) => {
            return db.Articles.findOneAndUpdate(
                {
                    _id: req.params.id
                },
                {
                    note: dbNote._id
                },
                {
                    new: true
                }
            );
        })
        .then((dbArticles) => {
            res.json(dbArticles);
        })
        .catch((err) => {
            res.json(err);
        });
});

// listen for port
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`)
})