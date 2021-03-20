const database = require("./../util/database.js")

let data = database.read();

module.exports = {
	name: "game",
	description: 'remove yourself from the list of people for specific game queues',
	execute(message, args) {
    try {
      data[args[2]] = {stackSize: args[1], players: [], stack: [], name: args[0]}
      message.reply(`The game ${args[10]} has been added with a maximum stack of ${args[1]}. You can request a queue/group for this game with the **qq ${args[2]}** command`)
    } catch {
      message.reply("Sorry, this game could not be added. Try again or consult qhelp.")
    }
    
    database.write(data)
	}
};