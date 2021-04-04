const {checkLFG, checkManager} = require("./../util/util.js")
const { writeToGuild, getGuildData, deleteFromGuild } = require("../util/mongo.js");

module.exports = {
        name: "rem",
        description: 'removes games',
		params: "<game shortcut>",
        async execute(message, args, client) {
	let data = await getGuildData(message.guild.name)
	let game = data[message.guild.id][args[0]]
	//console.log(message.member.roles.cache.some(role => role.name === "Game Manager"))
	if (!checkLFG(message, data, args[0])) {
		message.channel.send(`You are not in the LFG channel. Please enter commands into LFG or set the lfg channel with the ${"`qset <channel>`"} command`)
		return
	  }
	  if (!checkManager(message)) {
		message.author.send("You do not have the *Game Manager* role. Either request to get the role or request someone with the role to add games.")
		return
	  }
	if(!game) {
	    message.author.send(`This game does not exist. Refer to ${"`qview`"} to view the list of games`)
	    return
	}
	let confirmation =`Are you sure you want to delete ${game.name}? This will clear the sub list.`
	message.channel.send(confirmation)
	message.react("✅").then(() => {message.react("❌")})

	const filter = (reaction, user) => {
		return reaction.emoji.name && (user.tag !== "Queuey Boi#6717" && user.id === message.author.id);
	}
	let collector = message.createReactionCollector(filter);
		collector.on("collect", async (reaction, user) => {
			data = await getGuildData(message.guild.name)
			let tempData = data
			// if(!data[message.guild.id][args[0]]) {
			// 	message.reply("This game does not exist. It has been previously deleted and cannot be further deleted, or pulled from the grave.")
			// 	return
			// }
			if(reaction.emoji.name === "✅") {
				delete tempData[message.guild.id][args[0]]
				await deleteFromGuild(message.guild, tempData)
				message.reply("This game has been successfully removed ✅.")
				message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
				return
			}
			if (reaction.emoji.name === "❌") {
				message.reply("This game has *NOT* been removed.")
				message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
				return
			}
		})
    },
};
