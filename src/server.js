// Imports & Defines created at the end ();
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout });

// Debug and Logging
const morgan = require('morgan');

// randNick
const rn = require('./randNick');

// Socket.io Actions
// Refactor the Commands for Socket.io into REDUX format and have them in separate "types" file [Done]
const { CONNECTION, DISCONNECTING, CHANGE_NICK, SEND_NICK, CHAT_MSG } = require('./actionTypes');

// Routes
const {customDisconnect, changeNick, message} = require('./routes');

let userList = [];

app.use(morgan('tiny'));

// Just serves the HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

//On a client socket connecting with HTML js it will do this.
io.on(CONNECTION, (socket) => {
    // Getting IP Address
    // socket.conn.remoteAddress

    // Initializing Nickname
    let tempNick = rn.retNick();

    // console.log("Client " + socket.id + " Connected!");
    socket.emit(SEND_NICK, tempNick);

    // Initializing Nickname to a Local DB
    userList.push({id: socket.id, name: tempNick});
    
    // Relay for Chat Msgs
    socket.on(CHAT_MSG, (msg) => {message(socket, io, CHAT_MSG, msg)});
    // Changing Nickname
    socket.on(CHANGE_NICK, (newNick) => {changeNick(socket, io, newNick, userList)})
    // Disconnection from Server will display a Msg
    socket.on(DISCONNECTING, () => {customDisconnect(socket, io, CHAT_MSG, userList)});
});


//! Very important, it needs to use http cause socket.io wont work with app.listen
server.listen(4000, () =>{
    console.log("Server is up and running!");

    console.log("Users Online: \n" + userList);


    readline.setPrompt("> ");
    readline.prompt(true);
    readline.on('line', (cmd) => {
        console.log("You just typed: ", cmd);
        readline.prompt(true);
    })
});
