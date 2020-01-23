// Imports & Defines created at the end ();
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Debug and Logging
const morgan = require('morgan');

// Functions
const rn = require('./functions/randNick');
const { ConsoleLogOnlineUsers, RLRead, ElevatePrompt } = require('./functions/commandLogic'); 

// Routes
const {customDisconnect, changeNick, global_message} = require('./routes');

// Socket.io Actions
// Refactor the Commands for Socket.io into REDUX format and have them in separate "types" file [Done]
// Refactored Action Types into Routes
const {socketAction, channelRoom} = require('./types');

// Socket Actions
const { CONNECTION, DISCONNECTING, CHANGE_NICK, SEND_NICK, CHAT_MSG, SEND_ROOM, JOIN_ROOM } = socketAction;
const { CHANNELS } = channelRoom;

const defaultChannel = 'lobby';

let quickUserList = {};

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
    socket.on(CHAT_MSG, (msg) => {global_message(socket, io, CHAT_MSG, msg, quickUserList[socket.id].shard)});
    // Changing Nickname
    socket.on(CHANGE_NICK, (newNick) => {changeNick(socket, io, newNick, quickUserList)});
    // Join Room
    socket.on(JOIN_ROOM, (info) => {AssignUserRoom(socket, "", info.room, info.switchRoom)})

    // Disconnection from Server will display a Msg
    socket.on(DISCONNECTING, () => {customDisconnect(socket, io, CHAT_MSG, quickUserList, channelList)});
});


//! Very important, it needs to use http cause socket.io wont work with app.listen
//! Change Port to process.env.port
server.listen(4000, () => {
    console.log("Server is up and running!\n");

    // ConsoleLogs Online Users
    ConsoleLogOnlineUsers(quickUserList);

    console.log();

    // readLine Prompt
    ElevatePrompt();
});

// TODO: Refactor This to another File
const InitializeUser = (socket, io) => {
    // Initializing Nickname for User
    InitializeNickname(socket, io);

    // ConsoleLogs Online Users
    ConsoleLogOnlineUsers(quickUserList);

    // readLine Prompt
    ElevatePrompt();
}

// TODO: Refactor This to another File
const InitializeNickname = (socket, io) => {
    // Initializing Nickname
    let tempNick = rn.retNick();

    // Sending the Randomly Assigned Nickname to the Client
    socket.emit(SEND_NICK, tempNick);

    // Initializing Nickname to a Local DB [with Rooms]
    // Instead of Initializing this push with the Nickname, we might want to look into generating our own uid to save in an actual DB
    AssignUserRoom(socket, tempNick, defaultChannel, "", false);
}

// TODO: Refactor This to another File
const AssignUserRoom = (socket, tempNick, channelName, switchChannel) => {

    channelName = channelName.toLowerCase();
    
    if(tempNick !== ""){
        // Adding the User into the List
        // Refactor into SQL in the future
        quickUserList[socket.id] = {name: tempNick, shard: channelName};
    }
    
    if(CHANNELS[channelName.toUpperCase()]){
        //console.log(socket.id);

        // Leave Shard to stop receiving text from that Shard
        if(switchChannel){
            socket.leave(CHANNELS[quickUserList[socket.id].shard.toUpperCase()]);

            quickUserList[socket.id].shard = channelName;
        }

        // Joins Shard [Default] Channel
        // TODO: Rename Channels to Shard
        socket.join(CHANNELS[channelName.toUpperCase()]);

        // Sends the user the information on which Shard they are in
        socket.emit(SEND_ROOM, CHANNELS[channelName]);
    
        // Msg to the user to which Shard they are in
        socket.emit(CHAT_MSG, "Joined Shard: " + channelName.charAt(0).toUpperCase() + channelName.slice(1)); 


    } else {
        const errorMsg = "The shard you are attempting to join does NOT exist.";
        socket.emit(CHAT_MSG, "SYSTEM: " + errorMsg); 
    }
}

RLRead(quickUserList);