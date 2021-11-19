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
        

        let lfgString = ""
        for (let lfgChannel of data[message.guild.id]["lfgs"]) {
            lfgString += `<#${lfgChannel}>`
        }
        if (data[message.guild.id]["lfgs"].length == 0) {
            lfgString += "**yet to exist**"
        }
        console.log(lfgString)
   
        message.reply(`You are not in a LFG channel. Please enter commands into ${lfgString} or set the lfg channel with the ${"`qset lfg <game code>`"} into a game channel.`)
        return false
   
        
}

    const checkManager = message => {
        if (message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.some(role => role.name == "Game Manager")) {
            return true
        }
        message.reply("You don't have admin perms. Ask server owner and/or mods to give you admin perms.")
    }

    const checkIfServerDocExists = (message, data) => {
        if (!data[message.guild.id]) {
            return false
        }

        return true
    }

module.exports = { checkLFG, checkAllLFG, checkManager, checkIfServerDocExists}
