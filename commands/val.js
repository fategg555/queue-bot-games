module.exports = {
	name: "val",
	description: 'looking for game command',
	execute(message, args) {
		message.channel.send('Pong.');
    message.react("✅")
    
    const filter = (reaction, user) => {
	    return ['✅'].includes(reaction.emoji.name);
    };
    
    const collector = message.createReactionCollector(filter, {max: 3});

collector.on('collect', (reaction, user) => {
	message.reply(`Collected ${reaction.emoji.name} from ${user.tag}`);
});

collector.on('end', collected => {
	console.log(`Collected ${collected.size} items`);
});
    

	},
};