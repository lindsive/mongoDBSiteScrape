const express = require("express");
const mongoose  = require("mongoose");
const logger = require("morgan");

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

