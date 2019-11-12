const functions = require('firebase-functions');
const express = require('express');

// Defining Express Servers to Cloud Functions
const app = express();
const scrapper = express();
const cache = express();

// Scrapper Initialization
const cheerio_request = require("request");
const cheerio = require("cheerio");

// Fetching XML from RSS Feed
const fetch = require('node-fetch');
const convert = require('xml-js');

// Disabling CORS Errors
const cors = require('cors')({ origin: true });

// Allowing Cloud Functions from CORS Errors
app.use(cors);
scrapper.use(cors);


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions


// Default Firebase Cloud Functions
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

// Cloud Function that renders RSS feed to JSON
app.get('/', (req, res) => {
    res.send("I am umer");
});

app.get('/api', (req, res) => {
    let dataAsJson = {};

    fetch('https://www.bolnews.com/feed/')
        .then(response => response.text())
        .then(str => {
            dataAsJson = JSON.parse(convert.xml2json(str));
        })
        .then(() => {
            return res.send(dataAsJson);
        })
        .catch((err) => {
            console.log(err);
            return res.send({ "status": "fail", "error": err });

        })

});

exports.app = functions.https.onRequest(app);


// Scrapper Cloud Function
scrapper.get('/', (request, response) => {
    console.log(request.query.imageurl)
    cheerio_request(request.query.imageurl, (err, res, html) => {
        if (!err && res.statusCode == 200) {
            const $ = cheerio.load(html);
            response.send($(".featured-img").children("img").attr("src"))
        }
        else {
            response.send("Error : ");
        }
    })

});
exports.scrapper = functions.https.onRequest(scrapper);


// Cache Cloud Function
cache.get("/", (req, res) => {
    res.send("I am cache");
})

exports.cache = functions.https.onRequest(cache);

