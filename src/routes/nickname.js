module.exports = (socket, io, newNick, userList) => {

    let tempUIndex = 0;

    userList.find((m, i) => {
        const {id, name} = m;

        
        if(id === socket.id){
            tempUIndex = i;
            return m;
        }
    });

    userList[tempUIndex].name = newNick;
};