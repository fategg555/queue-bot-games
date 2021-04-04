const { writeToGuild, getGuildData } = require("../util/mongo.js");

const {checkLFG} = require("./../util/util.js")

module.exports = {
	name: "sub",
	description: 'add yourself to list of people for specific game queues',
  params: "<game shortcut>",
	async execute(message, args) {

let data = await getGuildData(message.guild.name)
 
if(!data[message.guild.id][args[0]]) {
	message.reply(`This game doesnt exist. Use ${"`qview`"} to find out game codes.`)
	return
}
   if(!checkLFG(message, data, args[0])) {
      message.channel.send("You are not in the LFG channel. Please enter commands into this games' LFG.")
      return
    }
    let game  = data[message.guild.id][args[0]] 
    let players = game.players
    if(!game) {
      message.author.send(`This game does not currently exist on this server. Run ${"`"}qadd <name> <stack size> <game shortcut>${"`"} to create the game.`)
      return  
    }
    if(game.players.includes(message.author.id)) {
      message.author.send(`You've already joined the ping list for the **${game.name}** queue.`)
      return;
    }
    players.push(message.author.id)
    await writeToGuild(message.guild, `${args[0]}.players`, players)
    message.reply(`You've added yourself to the ${game.name} queue list. You will be pinged if there is an opportunity to queue ✅.`)
	}
};
