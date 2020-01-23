// Imports & Defines created at the end ();
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Debug and Logging
const morgan = require('morgan');

// Functions
const rn = require('./functions/randNick');
const { logOnlineUsers, rlRead, elevatePrompt } = require('./functions/commandLogic'); 

// Routes
const {customDisconnect, changeNick, global_message} = require('./routes');

// Socket.io Actions
// Refactor the Commands for Socket.io into REDUX format and have them in separate "types" file [Done]
// Refactored Action Types into Routes
const {socketAction, channelRoom} = require('./types');

// Socket Actions
const { CONNECTION, DISCONNECTING, CHANGE_NICK, SEND_NICK, CHAT_MSG, SEND_ROOM } = socketAction;
const { CHANNELS, CHANNEL_ENUMS } = channelRoom;

let userList = [];
let channelList = Object.getOwnPropertyNames(CHANNELS);

app.use(morgan('tiny'));

// Just serves the HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

//On a client socket connecting with HTML js it will do this.
io.on(CONNECTION, (socket) => {
    // Getting IP Address
    // socket.conn.remoteAddress

    //Initialize User {Nickname, Rooms};
    InitializeUser(socket, io);
    
    // Relay for Chat Msgs
    socket.on(CHAT_MSG, (msg) => {global_message(socket, io, CHAT_MSG, msg)});
    // Changing Nickname
    socket.on(CHANGE_NICK, (newNick) => {changeNick(socket, io, newNick, userList, channelList)});

    // Disconnection from Server will display a Msg
    socket.on(DISCONNECTING, () => {customDisconnect(socket, io, CHAT_MSG, userList, channelList, CHANNEL_ENUMS)});
});


//! Very important, it needs to use http cause socket.io wont work with app.listen
//! Change Port to process.env.port
server.listen(4000, () => {
    console.log("Server is up and running!\n");
    
    InitializeUserList();

    logOnlineUsers(userList);

    console.log();

    elevatePrompt();
});

const InitializeUser = (socket, io) => {
    //Initializing Nickname for User
    InitializeNickname(socket);
    InitializeUserRoom(socket, io);

    logOnlineUsers(userList);

    elevatePrompt();
}

const InitializeNickname = (socket) => {
    // Initializing Nickname
    let tempNick = rn.retNick();

    // console.log("Client " + socket.id + " Connected!");
    socket.emit(SEND_NICK, tempNick);
    
    // Initializing Nickname to a Local DB [with Rooms]
    userList[channelList[CHANNEL_ENUMS["LOBBY"]]].push({id: socket.id, name: tempNick});
}

const InitializeUserRoom = (socket) => {
    
    // Poggers this works!
    // console.log(CHANNELS[channelList[0]]);

    // Joins Lobby [Default] Channel
    socket.join(CHANNELS["LOBBY"]);

    // Sends the user the information on which Lobby they are in
    socket.emit(SEND_ROOM, CHANNELS["LOBBY"])
    
    // Msg to the user to which Lobby they are in
    socket.emit(CHAT_MSG, "Joined Channel: Lobby");
}

const InitializeUserList = () => {
    for(let i = 0; i < channelList.length; i++){
        userList[channelList[i]] = [];
    }
}

rlRead(userList);