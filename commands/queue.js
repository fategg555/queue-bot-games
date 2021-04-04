//const database = require("./../util/database.js");

//let stack = database.read();

module.exports = {
  name: "q",
  cooldown: 30,
  description: "looking for game command",
  params: "<game shortcut>",
  execute(message, args, client) { 

  const database = require("./../util/database.js")
  let stack = database.read()

   // console.log(stack, message.guild.id)
    if(!stack[message.guild.id]) {
      message.reply(`You've not added any games to this server! Make sure you set the LFG channel and make some games!`)
      return
    }
   console.log("<#"+message.channel.id+">", stack[message.guild.id]["lfg"])  
    if("<#"+message.channel.id+">" !== stack[message.guild.id]["lfg"]) {
     // console.log("<#"+message.channel.id+">", stack[message.guild.id]["lfg"])
      message.reply("You are not in the LFG channel. Please enter commands into LFG or set the lfg channel with the qset <channel> command")
      return
    }
    let game = stack[message.guild.id][args[0]]
    if (!game["queueTimeoutMins"]) {
      game["queueTimeoutMins"] = 5
    }
    let mins = game["queueTimeoutMins"]
    if(!game) {
      message.reply("This game does not currently exist on this server. Run **qadd** <name> <max number> <game shortcut> to create the game.")
      return   
    }
    message.channel.send(
      `A **${game.name}** queue request has started. React to this msg above to secure a spot. This request **expires in ${game["queueTimeoutMins"]} minutes**.`
    );
    message.react("✅").then(() => message.react("❌"));
    let people = "The people being pinged:\n";
    for (let personID of game.players) {
         people += `<@${personID}>\n`;  
    } 
   if(people.length == 25) {
	people += "there is currently nobody subscribed to this game"
   }
    message.channel.send(people);
    const author = message.author.id
    if(!game.stack[author]) {
      game.stack[author] = [author]
    }
    database.write(stack)
//console.log("THIS IS THE CURRENT STACKS OF PEOPLE",game.stack)
    // client.on("message", msg => {
    //         msg.react("✅")
    //         return
    //     })

    const filter = (reaction, user) => {
      return ["✅", "❌"].includes(reaction.emoji.name) && user.tag !== "Queuey Boi#6717"; 
    };

    const collector = message.createReactionCollector(filter, {
      max: game.stackSize + 1,
      time: 1000*60*mins
    });

    collector.on("collect", (reaction, user) => {

      if(reaction.emoji.name === "❌" && !game.stack[author].includes(user.id)) {
        console.log(game.stack, game.stack[author])
        user.send(`${user.tag} cannot queue ${game.name} at this time. They can join back until the queue gets full!`)
        return
      }
      if(reaction.emoji.name === "❌" && game.stack[author].includes(user.id)) {
        game.stack[author].splice(game.stack[author].indexOf(user.id), 1)
        database.write(stack)
        user.send(`You left ${message.author.tag}'s ${game.name} queue ➡️.`);
        let string = "";
      for (let id of game.stack[author]) {
        string += `<@${id}> \n`; 
      }
      user.send(`The queue is currently\n ${string}`)
        user.send(`There are ${game.stackSize - game.stack[author].length } spots remaining.`);
        return
      }
      if(reaction.emoji.name === "✅" && user.id == author && game.stack[author].includes(user.id)) { 
        user.send("Since you requested to queue, you've already been included in the q count.")
        return
     }
      if (reaction.emoji.name === "✅" && game.stack[author].includes(user.id)) {
        // user.send(`<@${user.id}>, you've already secured your spot!`)
        user.send(`You've already secured your spot!`)
        return
      }
      user.send(`${user.tag} joined ${message.author.tag}'s queue ✅.`);
      game.stack[author].push(user.id);
      database.write(stack)
      let string = "";
      for (let id of game.stack[author]) {
        string += `<@${id}> \n`; 
      }
      user.send(`The queue is currently\n ${string}`)
      if (game.stackSize - game.stack[author].length > 0) {
        // message.channel.send(`There are ${game.stackSize - game.stack[author].length } spots remaining.`);
        user.send(`There are ${game.stackSize - game.stack[author].length } spots remaining.`)
      } else {
        let string = "";
        message.channel.send("There are no more spots remaining!");
        message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
        for (let id of game.stack[author]) {
          string += `<@${id}> \n`; 
        }
        message.channel.send(
          `The final q for the stack is:\n \n${string} \nThere will be more opportunities to queue in the future or you can start your own queue.`
        );
	delete game.stack[author]
	database.write(stack)
      }
    });

    collector.on("end", collected => {
      if(!game.stack[author]) {
        console.log("Q is full lmao")
        return
      }
      message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
      await removeStack()
      message.reply(`Your **${game.name}** queue expired. Requeue with the ${"`qq " + args[0] +"`"} command.`)
      return
    })
  }
};
