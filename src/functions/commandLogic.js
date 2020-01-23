// readLine for CLI
const readline = require('readline').createInterface({
    input:  process.stdin,
    output: process.stdout,
    prompt: "=> ",
});

// Action Types
const {cliAction} = require('../types');

// CLI Actions
const { ONLINE, EXIT } = cliAction;

const ElevatePrompt = () => {
    readline.prompt(true);
}

// Online Log Command
const ConsoleLogOnlineUsers = (userList) => {
    let str = "Users \x1b[32mOnline\x1b[0m:\n\n";

    
    for(let key in userList) {
        if(userList.hasOwnProperty(key)){
            let randColor = Math.floor(Math.random() * Math.floor(3)) + 31;
            str += "\x1b[4m";
            str += userList[key].name;
            str += "\x1b[0m";
        }
        str += "\n";
    }

    console.log(str);
}

//Reading Line
const RLRead = (userList) => {
    readline.on('line', (cmd) => {
        // console.log("You just typed: " + cmd);
        let command = cmd.split(" ");
        console.log();
        
        if(cmd.trim() !== ''){
            switch(command[0].trim().toLowerCase()){
                case ONLINE:
                    ConsoleLogOnlineUsers(userList);
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
    ConsoleLogOnlineUsers,
    RLRead,
    ElevatePrompt,
};