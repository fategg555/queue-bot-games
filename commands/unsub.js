const {checkLFG, checkManager} = require("./../util/util.js")

module.exports = {
        name: "unsub",
        description: 'set various properties',
        params: "<game shortcut>",
        execute(message, args) {

        const database = require("./../util/database.js");
        let data = database.read()
	
        let game = data[message.guild.id][args[0]]
        if (!checkLFG(message, data)) {
          message.author.send(`You are not in the LFG channel. Please enter commands into ${data["lfg"]} or set the lfg channel with the ${"`qset <channel>`"} command`)
          return
        }
	if(!game) {
    message.author.send(`This game does not exist. Try again or use ${"`qview`"} to view games from which you can unsub`)
	    return
	}
	let index = game.players.indexOf(game.players)
	game.players.splice(index, 1)
  database.write(data)
	message.reply(`You've been unsubscribed from the ping list of **${game.name}**. You can always resub with the ${"qsub <game code>"} command ✅.`)

  },
};
