const database = require("./../util/database.js")

let data = database.read();

module.exports = {
	name: "game",
	description: 'remove yourself from the list of people for specific game queues',
	execute(message, args) {
    data[args[2]] = {stackSize: args[1], players: [], stack: [], name: args[0]}
	}
};