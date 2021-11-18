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
	if(!data[message.guild.id][args[0]]) {
				message.reply("This game does not exist. It has been previously deleted and cannot be further deleted, or pulled from the grave.")
				return
			}
	if (!checkLFG(message, data, args[0])) {
		return
	  }
	  if (!checkManager(message)) {
		return
	  }
	if(!game) {
	    message.author.send(`This game does not exist. Refer to ${"`qview`"} to view the list of games`)
	    return
	}
	let confirmation = await message.channel.send(`Are you sure you want to delete ${game.name}? This will clear the sub list.`)
	confirmation.react("✅").then(() => {confirmation.react("❌")})

	const filter = (reaction, user) => {
		return reaction.emoji.name && (user.id !== process.env.TEST_BOT_ID && user.id === message.author.id);
	}
	let collector = confirmation.createReactionCollector(filter);
		collector.on("collect", async (reaction, user) => {
			data = await getGuildData(message.guild.name)
			let tempData = data
			if(reaction.emoji.name === "✅") {
				let lfgsArray = tempData[message.guild.id]["lfgs"]
				lfgsArray.splice(lfgsArray.indexOf(message.channel.id), 1)
				delete tempData[message.guild.id][args[0]]
				await deleteFromGuild(message.guild, tempData)
				message.reply("This game has been successfully removed ✅.")
				confirmation.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
				return
			}
			if (reaction.emoji.name === "❌") {
				message.reply("This game has *NOT* been removed.")
				confirmation.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
				return
			}
		})
    },
};
