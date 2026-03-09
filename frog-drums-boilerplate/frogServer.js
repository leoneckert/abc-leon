const express = require('express');

const https = require("https");
// to read certificates from the filesystem (fs)
const fs = require("fs");

const app = express(); // the server "app", the server behaviour
const portHTTPS = 4101; // port for https

// returning to the client anything that is
// inside the public folder
app.use(express.static('public'));


// Creating object of key and certificate
// for SSL
const options = {
    key: fs.readFileSync("keys-for-local-https/localhost-key.pem"),
    cert: fs.readFileSync("keys-for-local-https/localhost.pem"),
};

let HTTPSserver = https.createServer(options, app)


const { Server } = require('socket.io'); // include library
const { arrayBuffer } = require('stream/consumers');
const io = new Server(HTTPSserver); // start socket io 


let frogs = [];
let conductor;

io.on('connection', (socket) => {

    // we manage the connection inside here
    console.log('a user connected', socket.id);


    // LISTEN TO
    // client self-reporting role:
    socket.on("my-role", function(data){
        // if frog:
        //     add object with socket id to frog array
        //     inform conductor of new frog
        // if conductor:
        //     store conductor socket id to conductor global variable
    })

    // always comes from conductor
    // listen to frogs being triggered

        // check if frog exists
        // option A: tell taht frog to make sounds
        // option B: chck if the frog currently makes sounds
        //      either tell them to start or stop





    
    // DISCONNECT
    // manage the roles
    socket.on("disconnect", function(){
        console.log("someone disconnected", socket.id)
        console.log(frogs);

        // delete frog from the global array
        // that keeps track of all frogs online
        
        // find index
        let idx = frogs.findIndex(function(f){
            return f.id == socket.id
        });

        // if its a frog
            // delete frog
        // if it's a cnductpr
            // delete conductor


        // if the condiuctr is still online
        // tell them which frg has been deleted

    })

})




// Creating servers and make them listen at their ports:

HTTPSserver.listen(portHTTPS, function (req, res) {
    console.log("HTTPS Server started at port", portHTTPS);
});





