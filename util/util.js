const checkLFG = (message, data, game) => {
    try {
        if (message.channel.id === data[message.guild.id][game]["lfg"]) {
            console.log("<#" + message.channel.id + ">", data[message.guild.id]["lfg"])
            return true
        }
    } catch (e) {
        return false
    }
}

const checkAllLFG = (message, data) => {
    try {
        if (data[message.guild.id]["lfgs"].includes(message.channel.id)) {
            console.log("<#" + message.channel.id + ">", data[message.guild.id]["lfg"])
            return true
        }
    } catch (e) {
        return false
    }
}

const checkManager = message => {
    if (message.member.roles.cache.some(role => role.name === "Game Manager")) {
        return true
    }
}

module.exports = { checkLFG, checkAllLFG, checkManager }
