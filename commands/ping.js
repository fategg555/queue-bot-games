module.exports = {
	name: 'ping',
	description: 'looking for game command',
	execute(message, args) {
		message.channel.send('Pong.');
	},
};