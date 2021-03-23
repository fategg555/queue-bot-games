const {checkLFG, checkManager} = require("./../util/util.js")

module.exports = {
	name: "add",
	description: 'remove yourself from the list of people for specific game queues',
  params: "<game name> <stack size> <game shortcut>",
	execute(message, args) {

    const database = require("./../util/database.js")
    let data = database.read();

    let game  = data[message.guild.id][args[2]]
    if (!checkLFG(message, data)) {
      message.author.send(`You are not in the LFG channel. Please enter commands into LFG or set the lfg channel with the ${"`qset <channel>`"} command`)
      return
    }
    if (!checkManager(message)) {
      message.author.send("You do not have the *Game Manager* role. Either request to get the role or request someone with the role to add games.")
      return
    }

    if (args.length !== 3) {
      message.author.send("you don't have the right number of arguments. Make sure there are 3 arguments and they are in the order of string, integer, string.")
      return
    }
    if (!parseInt(args[1])) {
      message.author.send("There isn't a number for the maximum queue size. Make sure it is a number.")
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
    data[message.guild.id][args[2]] = {stackSize: args[1], players: [], stack: {}, name: args[0]}
    message.reply(`The game ${args[0]} has been added with a maximum stack of ${args[1]}. You can request a queue/group for this game with the **qq ${args[2]}** command ✅.`)
    
    database.write(data) 
	}
};
