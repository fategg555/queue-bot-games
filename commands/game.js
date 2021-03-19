const database = require("./../util/database.js")

let data = database.read();

module.exports = {
	name: "remove",
	description: 'remove yourself from the list of people for specific game queues',
	execute(message, args) {
    
	}
};