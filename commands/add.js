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

    // const database = require("./../util/database.js")
    // let data = database.read();
    data = await getGuildData(message.guild.name)

    let game  = data[message.guild.id][args[2]]
    let gameObj = game
    // if (!checkAllLFG(message, data)) {
    //   message.channel.send(`You are not in a LFG channel. Please enter commands into LFG or set the lfg channel with the ${"`qset lfg <game code>`"} command into a game channel`)
    //   return
    // }
    if (!checkManager(message)) {
      message.channel.send("You do not have the *Game Manager* role. Either request to get the role or request someone with the role to add games.")
      return
    }

    if (args.length !== 3) {
      message.channel.send("you don't have the right number of arguments. Make sure there are 3 arguments and they are in the order of string, integer, string.")
      return
    }
    if (!parseInt(args[1])) {
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
    gameObj = {lfg: "", stackSize: args[1], players: [], stack: {}, name: args[0]}
    await writeToGuild(message.guild, args[2], gameObj)
    message.reply(`The game ${args[0]} has been added with a maximum stack of ${args[1]}. You can request a queue/group for this game with the **qq ${args[2]}** command ✅.`)
    
     
	}
};
