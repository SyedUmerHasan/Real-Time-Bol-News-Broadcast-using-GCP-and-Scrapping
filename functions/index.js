const functions = require('firebase-functions');
const express = require('express');
const app = express();

const fetch = require('node-fetch');
const convert = require('xml-js');

const cors = require('cors')({ origin: true });
app.use(cors);
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
