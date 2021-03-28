const checkLFG = (message, data) => {
    if(message.channel.id === data[message.guild.id]["lfg"]) {
        //console.log("<#"+message.channel.id+">", data[message.guild.id]["lfg"])
         return true
       }
} 

const checkManager = message => {
    if (message.member.roles.cache.some(role => role.name === "Game Manager")) {
	    return true
	}
}

module.exports = {checkLFG, checkManager}