const checkLFG = (message, data, game) => {
        if (message.channel.id === data[message.guild.id][game]["lfg"]) {
            console.log("<#" + message.channel.id + ">", data[message.guild.id]["lfg"])
            return true
        }
    
        message.reply(`You are not in the LFG channel. Please enter commands into <#${data[message.guild.id][game]["lfg"]}>  or set the lfg channel with the ${"`qset lfg <game code>`"} into a game channel.`)
        return false
    
        
        
}

const checkAllLFG = (message, data) => {
   
        if (data[message.guild.id]["lfgs"].includes(message.channel.id)) {
            console.log("<#" + message.channel.id + ">", data[message.guild.id]["lfg"])
            return true
        }
        
        lfgString = ""

        for (let lfgChannel of data[message.guild.id]["lfgs"]) {
            lfgChannel += `<#${lfgChannel}>`
        }
   
        message.reply(`You are not in the LFG channel. Please enter commands into ANY LFG channel or set the lfg channel with the ${"`qset lfg <game code>`"} into a game channel.`)
        return false
   
        
}

const checkManager = message => {
    if (message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.some(role => role.name == "Game Manager")) {
        return true
    }
    message.reply("You don't have admin perms. Ask server owner and/or mods to give you admin perms.")
}

module.exports = { checkLFG, checkAllLFG, checkManager }
