const database = require("./../util/database.js")

let stack = database.read();

module.exports = {
	name: "val",
	description: 'looking for game command',
	execute(message, args) {
    stack.val.stack = []
		message.channel.send('A Valorant queue request has started. React to the msg above to secure a spot');
    let people = ""
    for (let personID of stack.val.players) {
      people += `<@${personID}>\n`
    }
    message.channel.send(people)
    message.react("✅")
    
    const filter = (reaction, user) => {
	    return ['✅'].includes(reaction.emoji.name);
    };
    
    const collector = message.createReactionCollector(filter, {max: stack.val.stackSize + 1});

collector.on('collect', (reaction, user) => {
	message.channel.send(`Collected response from ${user.tag}`);
  stack.val.stack.push(user.id)
  if (stack.val.stackSize - stack.val.stack.length + 1 > 0) {
    message.channel.send(`There are ${stack.val.stackSize - stack.val.stack.length + 1} spots remaining`)
  } else {
    let string = ""
    message.channel.send("There are no more spots remaining!")
    for (let id of stack.stack) {
      string += `<@${id}> \n`
    }
    message.channel.send(`The final q for the stack is \n${string} \nThere will be more opportunities to queue in the future or you can start your own queue`)
  }
});
    
	},
};