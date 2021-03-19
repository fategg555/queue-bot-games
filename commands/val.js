module.exports = {
	name: "val",
	description: 'looking for game command',
	execute(message, args) {
		message.channel.send('Pong.');
    message.react("✅")
	},
};