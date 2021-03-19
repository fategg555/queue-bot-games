module.exports = {
	name: "val",
	description: 'looking for game command',
	execute(message, args) {
		message.channel.send('Pong.');
    message.react("✅")
    
    const filter = (reaction, user) => {
	    return ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    
    message.awaitReactions(filter, {max: 1, time: 12000}).then(collected => {
      const reaction = collected.first();
      console.log(reaction.users.cache)
    }).catch(() => {
      message.reply("make another queue request")
    })
	},
};