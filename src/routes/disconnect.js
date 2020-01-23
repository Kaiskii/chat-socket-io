module.exports = customDisconnect = (socket, io, CHAT_MSG, userList, channelList, cEnums) => {
    
    
    // if(id === socket.id){
        //     // console.log("Promise Search Index: " + i);
        //     usrIndex = i;
        //     return m;
        // }
        
    let channelIndex;
    let usrIndex;
    let n;
        
    const findUserPromise = new Promise((resolve, reject) => {

        for(let i = 0; i < channelList.length; i++){
            if(n){
                continue;
            }

            n = userList[channelList[i]].find((m, index) => {
                const {id, name} = m;

                if(id === socket.id){
                    usrIndex = index;
                    channelIndex = i;
                    return m;
                }
            });
        }

        resolve(n);
    });


    findUserPromise.then((value) => {
        console.log();

        if(value.name){
            io.to('lobby').emit(CHAT_MSG, value.name + " has left the chat...");
        }

        if(userList[channelList[channelIndex]].length <= 1){
            // console.log(userList[channelList[channelIndex]].length);
            userList[channelList[channelIndex]].splice(0, userList[channelList[channelIndex]].length);
            // console.log(userList);
            return;
        }

        userList[channelList[channelIndex]].splice(usrIndex, 1);
        // console.log(userList);
    });

    findUserPromise.catch((error) => {
        console.log(error);
    })
}