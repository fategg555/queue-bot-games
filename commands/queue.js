const database = require("./../util/database.js");

let stack = database.read();

module.exports = {
  name: "q",
  description: "looking for game command",
  execute(message, args) {
    // if("<#"+message.channel.id+">" !== stack["guild-lfg"]) {
    //   message.reply("You are not in the LFG channel. Please enter commands into LFG or set the lfg channel with the qset <channel> command")
    //   return
    // }
    stack[args[0]].stack = [];
    // console.log(message.channel)
    message.channel.send(
      `A ${stack[args[0]].name} queue request has started. React to the msg above to secure a spot`
    );
    let people = "";
    for (let personID of stack[args[0]].players) {
      // console.log(personID)
      
      people += `<@${personID}>\n`;
    }
    // console.log(people)
    message.channel.send(people);
    stack[args[0]].stack.push(message.author.id);
    message.react("✅");

    const filter = (reaction, user) => {
      return ["✅"].includes(reaction.emoji.name);
    };

    const collector = message.createReactionCollector(filter, {
      max: stack[args[0]].stackSize
    });

    collector.on("collect", (reaction, user) => {
      if(user.id == message.author.id) {
        message.reply("Since you requested to queue, you've already been included in the q count")
        return
      }
      if (stack[args[0]].stack.includes(user.id)) {
        message.channel.send(`<@${user.id}>, you've already secured your spot!`)
        return
      }
      message.channel.send(`Collected response from ${user.tag}`);
      stack[args[0]].stack.push(user.id);
      
      if (stack[args[0]].stackSize - stack[args[0]].stack.length + 1 > 0) {
        message.channel.send(`There are ${stack[args[0]].stackSize - stack[args[0]].stack.length + 1} spots remaining`);
      } else {
        let string = "";
        message.channel.send("There are no more spots remaining!");
        for (let id of stack[args[0]].stack) {
          string += `<@${id}> \n`;
        }
        message.channel.send(
          `The final q for the stack is \n${string} \nThere will be more opportunities to queue in the future or you can start your own queue`
        );
      }
    });
  }
};