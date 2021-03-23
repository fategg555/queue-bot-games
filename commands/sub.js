//const database = require("./../util/database.js")

//let data = database.read();

module.exports = {
	name: "sub",
	description: 'add yourself to list of people for specific game queues',
  params: "<game shortcut>",
	execute(message, args) {

const database = require("./../util/database.js")

let data = database.read();
    if("<#"+message.channel.id+">" !== data[message.guild.id]["lfg"]) {
      console.log("<#"+message.channel.id+">", data[message.guild.id]["lfg"])
      message.author.send("You are not in the LFG channel. Please enter commands into LFG or set the lfg channel with the qset <channel> command")
      return
    }
    let game  = data[message.guild.id][args[0]] 
    if(!game) {
      message.author.send("This game does not currently exist on this server. Run **qadd** <name> <stack size> <game shortcut> to create the game.")
      return  
    }
    if(game.players.includes(message.author.id)) {
      message.author.send(`You've already joined the ping list for the **${game.name}** queue.`)
      return;
    }
    game.players.push(message.author.id)
    console.log(game.players)
    database.write(data)
    message.reply(`You've added yourself to the ${game.name} queue list. You will be pinged if there is an opportunity to queue ✅.`)
	}
};
