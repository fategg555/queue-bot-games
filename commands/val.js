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
	message.channel.send(`Collected response from ${user.tag}`);
  stack.stack.push(user.id)
  if (stack.stackSize - stack.stack.length + 1 > 0) {
    message.channel.send(`There are ${stack.stackSize - stack.stack.length + 1} spots remaining`)
  } else {
    let string = ""
    message.channel.send("There are no more spots remaining!")
    for (let id in stack.stack) {
      string += `<@${id}> \n`
    }
    console.log(string)
  }
  
});

collector.on('end', collected => {
	console.log(`Collected ${collected.size} items`);
});
    

	},
};