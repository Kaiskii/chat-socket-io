module.exports = (socket, io, newNick, userList) => {

    userList[socket.id].name = newNick;

    // let tempUIndex = -1;

    // for(let i = 0; i < channelList.length; i++){
    //     if(tempUIndex != -1){
    //         continue;
    //     }

    //     userList[channelList[i]].find((m, index) => {
    //         const {id, name} = m;

    //         if(id === socket.id){
    //             tempUIndex = index;
    //             channelIndex = i;
    //             return m;
    //         }
    //     });
    // }

    // userList[channelList[channelIndex]][tempUIndex].name = newNick;
};