const express = require('express');
const bodyParser = require('body-parser')//add this

const https = require("https");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json())


// Creating object of key and certificate
// for SSL
const options = {
    key: fs.readFileSync("localhost-key.pem"),
    cert: fs.readFileSync("localhost.pem"),
};

// app.post('/...', (req, res) => {
//   res.status(200).end();
// });

// app.get('/...', (req, res) => {
//   res.status(200).end();
// });


// Creating https server by passing
// options and app object
https.createServer(options, app).listen(3001, function (req, res) {
    console.log("Server started at port 3001");
});





