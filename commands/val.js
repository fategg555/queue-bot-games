let stack = require('/util/data.js')

console.log(stack)

module.exports = {
	name: "val",
	description: 'looking for game command',
	execute(message, args) {
		message.channel.send('A Valorant queue request has started. React to the msg above to secure a spot');
    message.react("✅")
    
    const filter = (reaction, user) => {
	    return ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    
    const collector = message.createReactionCollector(filter, {max: 3});

collector.on('collect', (reaction, user) => {
	message.reply(`Collected ${reaction.emoji.name} from <@${user.id}>`);
  console.log(message.author.bot)
});

collector.on('end', collected => {
	console.log(`Collected ${collected.size} items`);
});
    

	},
};