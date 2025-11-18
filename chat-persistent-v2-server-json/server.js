const express = require('express');

const https = require("https");
// to read certificates from the filesystem (fs)
const fs = require("fs");

const app = express(); // the server "app", the server behaviour
const portHTTPS = 4200; // port for https

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
const io = new Server(HTTPSserver); // start socket io 

// socket.id -> { userId, username }
let sockets = {};      
// userId -> socket.id
let users = {};  

const DATA_PATH = 'chat-data.json'; // next to your server file

let messages = [];

try {
  if (fs.existsSync(DATA_PATH)) {
    const file = fs.readFileSync(DATA_PATH, 'utf8');
    messages = JSON.parse(file);
    console.log('Loaded chat history:', messages.length, 'messages');
  }
} catch (err) {
  console.log('Could not load chat history, starting empty');
  messages = [];
}

function saveMessages() {
//   const capped = messages.slice(-100); // keep last 100 only
//   fs.writeFileSync(DATA_PATH, JSON.stringify(capped, null, 2), 'utf8');

    fs.writeFileSync(DATA_PATH, JSON.stringify(messages, null, 2), 'utf8');
}

io.on('connection', (socket) => {

    // we manage the connection inside here
    console.log('a user connected', socket.id);

    socket.on("identify", function(data){
        sockets[socket.id] = { 
            userId: data.userId, 
            username: data.username 
        };

        users[data.userId] = socket.id; 

        console.log("online socket", sockets)
        console.log("online users", users)
        // could update other about who's online
        socket.emit("chat-history", messages)
    })

    socket.on("name-change", function(data){
        console.log(sockets)
        console.log("someone change name", data)
        sockets[socket.id].username = data.newUsername;
        console.log(sockets)
    })

    socket.on("message-from-client", function(data){
        console.log("got a msg from client", data);
        let message = {
            message: data.message,
            sender: sockets[socket.id]
        }
        messages.push(message);
        saveMessages(); 
        io.emit("message-from-server", message);
    })

    socket.on("disconnect", function(){
        console.log("someone disconnected", socket.id)

        const me = sockets[socket.id];
        if (me){
            delete sockets[socket.id];
            // only clear if this socket is still the active one for that user
            if (users[me.userId] === socket.id) delete users[me.userId];
        };
        console.log("online socket", sockets)
        console.log("online users", users)
        
    })

})




// Creating servers and make them listen at their ports:

HTTPSserver.listen(portHTTPS, function (req, res) {
    console.log("HTTPS Server started at port", portHTTPS);
});





