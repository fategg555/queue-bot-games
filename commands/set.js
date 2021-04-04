const {checkManager} = require("./../util/util.js");
const { writeToGuild, getGuildData, createNewServerInfoDoc } = require("../util/mongo.js");
//let data = database.read()

module.exports = {
	name: "set",
	description: 'set various LFG channel',
  params: "<none>",
	async execute(message, args) {
    if (args.length !== 2) {
      message.channel.send("You don\'t have the right number of arguments. Make sure you have 2.")
      return
    }
    let server = await getGuildData(message.guild.name)
    let data = server[message.guild.id]
    if(!data["lfgs"]) {
      await writeToGuild(message.guild, "lfgs", [])
      server = await getGuildData(message.guild.name)
      data = server[message.guild.id]
    }
    
    let lfgs = data["lfgs"]
    
    if (!checkManager(message)) {
      message.channel.send("You do not have the *Game Manager* role. Either request to get the role or request someone with the role to set the LFG.")
      return
      }

    if (args[0] !== "lfg") {
      message.channel.send(`Make sure that you're typing ${"`"}qset lfg <game code>${"`"}.`)
      return
    }
    
    if (!data[args[1]]) {
      message.reply("This game does not exist. Set an lfg for existing games.")
      return
    }
	  if(message.channel.id.length == 18) {
      // console.log("bruh why", await getGuildData(message.guild.name))
      if (server[message.guild.id][args[1]]["lfg"] !== message.channel.id) {
        if (!lfgs.includes(message.channel.id))lfgs.push(message.channel.id)
        await writeToGuild(message.guild, `${args[1]}.lfg`, message.channel.id)
        await writeToGuild(message.guild, "lfgs", lfgs)
        server = await getGuildData(message.guild.name)
        data = server[message.guild.id]
        console.log(data)
        let game = data[args[1]]
        message.channel.send(`The LFG channel for ${game.name} has been set to <#${message.channel.id}> ✅!`)
        return
      }
      if (!server[message.guild.id]) {
        // await createNewServerInfoDoc(message.guild) 
        if (!lfgs.includes(message.channel.id))lfgs.push(message.channel.id)
        lfgs.push(message.channel.id)
        await writeToGuild(message.guild, `${args[1]}.lfg`, message.channel.id)
        await writeToGuild(message.guild, "lfgs", lfgs)
        server = await getGuildData(message.guild.name)
        data = server[message.guild.id]
        let game = data[args[1]]
        message.channel.send(`The LFG channel for ${game.name} has been set to <#${message.channel.id}> ✅!`)
        return
      }

      // let data = await getGuildData(message.guild.name)

      if (server[message.guild.id][args[1]]["lfg"] === message.channel.id) {
        message.channel.send("This channel has already been set.")
        return
      }
      
      // await writeToGuild(message.guild, "lfg", message.channel.id)
     
        

    } else {
      message.channel.send("This is an invalid channel. Try again.")
      return
    }
	},
};
