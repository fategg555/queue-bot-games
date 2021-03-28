const {checkLFG} = require("./../util/util.js");
const { writeToServer, getServerData } = require("../util/mongo.js");

//let stack = database.read();

module.exports = {
  name: "q",
  cooldown: 60,
  description: "looking for game command",
  params: "<game shortcut>",
  execute(message, args, client) { 

  const updateQueue = () => {
    let string = "";
        for (let id of game.stack[author]) {
          string += `<@${id}>\n`; 
        }
        viewStackEmbed.fields[0].value = string
        message.edit(viewStackEmbed)
  }




  let data = getServerData(message.guild.name)

   // console.log(stack, message.guild.id)
   if (!checkLFG(message, data)) {
    message.author.send(`You are not in the LFG channel. Please enter commands into the lfg channel or set the lfg channel with the ${"`qset <channel>`"} command`)
      return
  }
    if(Object.keys(data[message.guild.id]).length === 0) {
      message.reply(`You've not added any games to this server! Make sure you set the LFG channel and make some games!`)
      return
    }
   
    

    let game = data[message.guild.id][args[0]]
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
	people += "There is currently nobody subscribed to this game."
   }
    message.channel.send(people);
    const author = message.author.id
    if(!game.stack[author]) {
      game.stack[author] = [author]
    }
    
    writeToServer(message.guild, args[0] + `.stack.${author}`, game.stack[author])
    
    let viewStackEmbed = {
      color: 0x0099ff,
      title: 'Queue Time!',
      author: {
          name: message.author.tag,
      },
      description: 'Active Queue List',
      fields: [
          {
              name: '**People in stack**',
              value: stackString,
              inline: true,
          }
      ],
      timestamp: new Date(),
  }
  message.channel.send({embed: viewStackEmbed})
    updateQueue()

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

      // if(reaction.emoji.name === "❌" && !game.stack[author].includes(user.id)) {
      //   console.log(game.stack, game.stack[author])
      //   user.send(`${user.tag} cannot queue ${game.name} at this time. They can join back until the queue gets full!`)
      //   return
      // }

      if(reaction.emoji.name === "❌" && game.stack[author].includes(user.id)) {
        game.stack[author].splice(game.stack[author].indexOf(user.id), 1)
        writeToServer(message.guild, args[0] + `.stack.${author}`, game.stack[author])
        updateQueue()
        return
      }
      if(reaction.emoji.name === "✅" && user.id == author && game.stack[author].includes(user.id)) { 
        return
     }
      if (reaction.emoji.name === "✅" && game.stack[author].includes(user.id)) {
        // user.send(`<@${user.id}>, you've already secured your spot!`)
        // user.send(`You've already secured your spot!`)
        return
      }
      // user.send(`${user.tag} joined ${message.author.tag}'s queue ✅.`);
      game.stack[author].push(user.id);
      writeToServer(message.guild, args[0] + `.stack.${author}`, game.stack[author])
      updateQueue()

      if (game.stackSize - game.stack[author].length > 0) {
        
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
	writeToServer(message.guild, args[0], game)
      }
    });

    collector.on("end", collected => {
      if(!game.stack[author]) {
        console.log("Q is full lmao")
        return
      }
      message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
      delete game.stack[author]
	    writeToServer(message.guild, args[0], game)
      message.reply(`Your **${game.name}** queue expired. Requeue with the ${"`qq " + args[0] +"`"} command.`)
      return
    })
  }
};
