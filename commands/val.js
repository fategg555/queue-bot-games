const database = require("./../util/database.js")

let stack = database.read();

console.log(stack)

module.exports = {
	name: "val",
	description: 'looking for game command',
	execute(message, args) {
		message.channel.send('A Valorant queue request has started. React to the msg above to secure a spot');
    message.react("✅")
    
    const filter = (reaction, user) => {
	    return ['✅'].includes(reaction.emoji.name);
    };
    
    const collector = message.createReactionCollector(filter, {max: 6});

collector.on('collect', (reaction, user) => {
	message.channel.send(`Collected response ${reaction.emoji.name} from ${user.tag}`);
  console.log(user.username)
  console.log(stack)
  console.log(message.author.bot)
});

collector.on('end', collected => {
	console.log(`Collected ${collected.size} items`);
});
    

	},
};