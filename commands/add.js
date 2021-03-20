const database = require("./../util/database.js")

let data = database.read();

module.exports = {
	name: "add",
	description: 'add yourself to list of people for specific game queues',
	execute(message, args) {
    let game  = args[0]
    if(data[game].players.includes(message.author.id)) {
      message.reply(`You've already joined the ping list for the ${game} queue.`)
      return;
    }
    data[game].players.push(message.author.id)
    database.write(data)
    message.reply(`You've added yourself to the ${data[args[0]].name} queue list. You will be pinged if there is an opportunity to queue.`)
	}
};