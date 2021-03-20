const database = require("./../util/database.js")

let data = database.read();

module.exports = {
	name: "add",
	description: 'add yourself to list of people for specific game queues',
	execute(message, args) {
    if("<#"+message.channel.id+">" !== data[message.guild.id]["lfg"]) {
      console.log("<#"+message.channel.id+">", data[message.guild.id]["lfg"])
      message.reply("You are not in the LFG channel. Please enter commands into LFG or set the lfg channel with the qset <channel> command")
      return
    }
    let game  = args[0] 
    if(data[message.guild.id][game].players.includes(message.author.id)) {
      message.reply(`You've already joined the ping list for the **${data[message.guild.id][args[0]].name}** queue.`)
      return;
    }
    data[message.guild.id][game].players.push(message.author.id)
    console.log(game)
    database.write(data)
    message.reply(`You've added yourself to the ${data[message.guild.id][args[0]].name} queue list. You will be pinged if there is an opportunity to queue.`)
	}
};