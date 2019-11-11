const functions = require('firebase-functions');
const express = require('express');
const app = express();
const scrapper = express();

const cheerio_request = require("request");
const cheerio = require("cheerio");

const fetch = require('node-fetch');
const convert = require('xml-js');

const cors = require('cors')({ origin: true });
app.use(cors);
scrapper.use(cors);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

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
        return res.send({"status" : "fail", "error"  : err});

    })

});

exports.app = functions.https.onRequest(app);

scrapper.get('/', (request, response) => {
    cheerio_request("https://www.bolnews.com/sports/2019/11/peshawar-to-host-33rd-national-games-after-9-years/",(err, res, html)=>{
        console.log(res.statusCode )
        if(!err && res.statusCode == 200)
        {
            const $ = cheerio.load(html);

            response.send($(".featured-img").children("img").attr("src"))

        }
        else{
            response.send("Error : ");
        }
    })  
    
});
exports.scrapper = functions.https.onRequest(scrapper);
