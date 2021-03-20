const database = require("./../util/database.js")

let data = database.read();

module.exports = {
	name: "game",
	description: 'remove yourself from the list of people for specific game queues',
	execute(message, args) {
    if (args.length !== 3) {
      message.reply("you don't have the right number of arguments. Make sure there are 3 arguments and they are in the order of string, integer, string.")
      return
    }
    if (!parseInt(args[1])) {
      message.reply("There isn't a number for the maximum queue size. Make sure it is a number.")
      console.log(typeof(args[1]))
      return
    }
    if(!data[message.guild.id]) {
      data[message.guild.id] = {}
    }
    if(!data[message.guild.id]["lfg"]) {
      console.log(data[message.guild.id]["lfg"])
    }
    data[message.guild.id][args[2]] = {stackSize: args[1], players: [], stack: [], name: args[0]}
    message.reply(`The game ${args[0]} has been added with a maximum stack of ${args[1]}. You can request a queue/group for this game with the **qq ${args[2]}** command`)
    
    database.write(data) 
	}
};