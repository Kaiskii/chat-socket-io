module.exports = customDisconnect = (socket, io, CHAT_MSG, userList) => {
    let usrIndex;
    
    const findUserPromise = new Promise((resolve, reject) => {
        let n = userList.find((m, i) => {
            const {id, name} = m;

            if(id === socket.id){
                // console.log("Promise Search Index: " + i);
                usrIndex = i;
                return m;
            }
        })

        resolve(n);
    });


    findUserPromise.then((value) => {
        if(value.name){
            io.emit(CHAT_MSG, value.name + " has left the chat...");
        }
        if(userList.length <= 1){
            userList.splice(0, userList.length);
            return;
        }

        userList.splice(usrIndex, 1);
        // console.log(userList);
    });

    findUserPromise.catch((error) => {
        console.log(error);
    })
}