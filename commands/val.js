const database = require("./../util/database.js")

let stack = database.read();

console.log(stack)

module.exports = {
	name: "val",
	description: 'looking for game command',
	execute(message, args) {
		message.channel.send('A Valorant queue request has started. React to the msg above to secure a spot');
    let people = ""
    for (let personID of stack.val) {
      people += `<@${personID}>\n`
    }
    console.log(people)
    message.react("✅")
    
    const filter = (reaction, user) => {
	    return ['✅'].includes(reaction.emoji.name);
    };
    
    const collector = message.createReactionCollector(filter, {max: stack.stackSize + 1});

collector.on('collect', (reaction, user) => {
	message.channel.send(`Collected response from ${user.tag}`);
  stack.stack.push(user.id)
  if (stack.stackSize - stack.stack.length + 1 > 0) {
    message.channel.send(`There are ${stack.stackSize - stack.stack.length + 1} spots remaining`)
  } else {
    let string = ""
    message.channel.send("There are no more spots remaining!")
    for (let id of stack.stack) {
      string += `<@${id}> \n`
    }
    message.channel.send(`The final q for the stack is \n${string} \nThere will be more opportunities to queue in the future or you can start your own queue`)
  }
  
});

collector.on('end', collected => {
	console.log(`Collected ${collected.size} items`);
});
    

	},
};