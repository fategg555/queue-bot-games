const {checkManager} = require("./../util/util.js");
const { writeToGuild, getGuildData, createNewServerInfoDoc } = require("../util/mongo.js");
//let data = database.read()

module.exports = {
	name: "set",
	description: 'set various LFG channel',
  params: "<none>",
	async execute(message, args) {
//    if (args.length !== 2) {
  //    message.channel.send("You don\'t have the right number of arguments. Make sure you have 2.")
    //  return
    //}
    let server = await getGuildData(message.guild.name)
    let data = server[message.guild.id]
    if(!data["lfgs"]) {
      await writeToGuild(message.guild, "lfgs", [])
      server = await getGuildData(message.guild.name)
      data = server[message.guild.id]
    }
    
    let lfgs = data["lfgs"]
    
    if (!checkManager(message)) {
      return
    }
    
   /* if (!data[args[1]]) {
      message.reply("This game does not exist. Set an lfg for existing games.")
      return
    }*/

    if (args[0] === "lfg") {
	server = await getGuildData(message.guild.name)
if (args.length !== 2) {message.reply("You need 2 arguments for this command to work"); return}
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

      if (server[message.guild.id][args[1]]["lfg"] === message.channel.id) {
        message.channel.send("This channel has already been set.")
        return
      }
    } else if (args[0] === "expiry") {
if(args.length !== 3) {message.reply("You need 3 args for this command"); return}
      try {
let time = Math.abs(parseInt(args[1]))
        if (typeof(time) !== "number") {
          message.reply("The value for the expiry is not valid. Make it is a WHOLE NUMBER.")
          return
        }
        server = await getGuildData(message.guild.name)
        game = server[message.guild.id][args[2]]
        if (!game) {
          message.reply("This game is invalid. Use `qview` to find the list of game codes.")
          return
        }
        await writeToGuild(message.guild, `${args[2]}.queueTimeoutMins`, time)
        message.channel.send(`The queue expiry time has been changed to **${time}** mins for **${game.name}**.`)

      } catch (e) {
        message.channel.send("An error occurred in setting the expiry time. Make sure your arguments are valid.")
        return
      }
    } else {
      message.channel.send("Hmmmmmm..... either the setting you're using doesn't exist yet or is invalid. Current settings are `qset lfg ` and `qset expiry <time>`.")
      return
    }
	},
};
