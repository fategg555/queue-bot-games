const database = require("./../util/database.js")

let data = database.read();

module.exports = {
	name: "add",
	description: 'add yourself to list of people for specific game queues',
	execute(message, args) {
    let game  = args[0]
    data[game].push(message.author.id)
    message.reply(`You've added yourself to the ${args[0]} queue list. You will be pinged if there is an opportunity to queue`)
	}
};