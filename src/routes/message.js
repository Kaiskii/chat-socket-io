module.exports = (socket, io, CHAT_MSG, msg) => {
    io.emit(CHAT_MSG, msg);
};