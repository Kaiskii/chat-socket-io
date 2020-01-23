// readLine for CLI
const readline = require('readline').createInterface({
    input:  process.stdin,
    output: process.stdout,
    prompt: "=> ",
});

// Action Types
const {cliAction} = require('../types');

// CLI Actions
const { ONLINE, EXIT} = cliAction;

const elevatePrompt = () => {
    readline.prompt(true);
}

// Online Log Command
const logOnlineUsers = (userList) => {
    console.log("Users Online: \n", userList);
}

//Reading Line
const rlRead = (userList) => {
    readline.on('line', (cmd) => {
        // console.log("You just typed: " + cmd);
        let command = cmd.split(" ");
        console.log();
        
        if(cmd.trim() !== ''){
            switch(command[0].trim().toLowerCase()){
                case ONLINE:
                    logOnlineUsers(userList);
                    break;
                case EXIT:
                    readline.close();
                    break;
                default:
                    console.log( "Command \"" + command[0].trim() + "\" doesn't exist!");
                    break;
            }
            
            console.log();
        }
        
        readline.prompt(true);
    }).on('close', () => {
        console.log("Nice");
        process.exit(0);
    });
}

module.exports = {
    logOnlineUsers,
    rlRead,
    elevatePrompt,
};