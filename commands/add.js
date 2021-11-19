const { write } = require("../util/database.js");
const { writeToGuild, getGuildData, deleteFromGuild, createNewServerInfoDoc } = require("../util/mongo.js");
const {checkLFG, checkAllLFG, checkManager} = require("./../util/util.js")

module.exports = {
	name: "add",
	description: 'remove yourself from the list of people for specific game queues',
  params: "<game name> <stack size> <game shortcut>",
	async execute(message, args) {

    let data = await getGuildData(message.guild.name)
    if (!data) {
      await createNewServerInfoDoc(message.guild)
    }

    data = await getGuildData(message.guild.name)

    let game = data[message.guild.id][args[args.length - 1]]
    let gameObj = game
    
    if (!checkManager(message)) {
      return
    }

    if (!parseInt(args[args.length - 2])) {
      message.channel.send("There isn't a number for the maximum queue size. Make sure it is a number.")
      console.log(typeof(args[1]))
      return
    }
    if(!data[message.guild.id]) {
      data[message.guild.id] = {}
    }
    if(!data[message.guild.id]["lfg"]) {
      console.log(data[message.guild.id]["lfg"])
    }
    if (game) {
      message.reply(`The game **${game.name}** exists with the game code ${"`"+args[2]+"`"}! Make sure you use a unique game code for each game.`)
      return
    }
    let gameName = await new Promise((resolve, reject) => {
      let string = ""
      for (let word of args.splice(0, args.length - 2)) {
        string += word + " "
      }
      let gamesString = string.slice(0, string.length -1)
      resolve(gamesString)
    })
    gameObj = {lfg: "", stackSize: args[args.length - 2], players: [], stack: {}, name: gameName, lfg: message.channel.id}
    if(!data["lfgs"]) {
      await writeToGuild(message.guild, "lfgs", [])
      server = await getGuildData(message.guild.name)
      data = server[message.guild.id]
    }
    let lfgs = data["lfgs"]
    lfgs.push(message.channel.id)
    await writeToGuild(message.guild, "lfgs", lfgs)
    await writeToGuild(message.guild, args[args.length - 1], gameObj)
    message.reply(`The game **${gameName}** has been added with a maximum stack of ${args[args.length - 2]}. You can request a queue/group for this game with the ${"`qq "+ args[args.length - 1] +"`"} command ✅.`)
    
     
	}
};
