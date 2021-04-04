const {checkLFG} = require("./../util/util.js")
const { writeToGuild, getGuildData } = require("../util/mongo.js");

module.exports = {
        name: "unsub",
        description: 'set various properties',
        params: "<game shortcut>",
        async execute(message, args) {
try{
        let data = await getGuildData(message.guild.name)
        let game = data[message.guild.id][args[0]]
        let players = game.players
} catch (e) {
message.channel.send(`This game does not exist. Use ${"`qview`"} to find a list of games on the server.`)
return
}

let data = await getGuildData(message.guild.name)
let game = data[message.guild.id][args[0]]
let players = game.players

	if(!game) {
		message.reply(`This game does not exist. Do ${"`qview`"} to find a list of game codes.`)
		return
	}
        if (!checkLFG(message, data, args[0])) {
          message.author.send(`You are not in the LFG channel. Please enter commands into ${data["lfg"]} or set the lfg channel with the ${"`qset <channel>`"} command`)
          return
        }
	if(!game) {
    message.author.send(`This game does not exist. Try again or use ${"`qview`"} to view games from which you can unsub`)
	    return
	}
	players.splice(players.indexOf(game.players), 1)
  await writeToGuild(message.guild, `${args[0]}.players`, players)
	message.reply(`You've been unsubscribed from the ping list of **${game.name}**. You can always resub with the ${"`"}qsub <game code>${"`"} command ✅.`)

  },
};
