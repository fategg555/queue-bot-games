const {checkLFG} = require("./../util/util.js");
const {writeToGuild, getGuildData } = require("../util/mongo.js");
const Discord  = require("discord.js")
//let stack = database.read();

module.exports = {
  name: "q",
  cooldown: 60,
  description: "looking for game command",
  params: "<game shortcut>",
  async execute(message, args, client) { 

  const author = message.author.id
  const updateQueue = async (msg, color=0x0099ff) => {
    console.log("beginning of queue update", new Date().getSeconds())
    console.log("before GameData call", new Date().getSeconds())
        let game = await getGameData()
    console.log("after game data, before gameStack cal", new Date().getSeconds())
        viewStackEmbed.fields[0].value = await getGameStack()
        viewStackEmbed.color = color
        console.log("after gamestack call", new Date().getSeconds())
        viewStackEmbed.fields[0].name = `**People in stack** (${game.stack[author].length}/${game.stackSize})`
        if (game.stackSize - game.stack[author].length === 0) {
          console.log("poopoobeans")
          msg.channel.send("There are no more spots remaining!");
          embed.then(message => updateColor(message, 0x00ff44))
          message.reactions.removeAll().catch(error => {console.error('Failed to clear reactions: ', error)});
          console.log("after poopoobeans")
          removeStack()
          return
        }
        StackEmbed = new Discord.MessageEmbed(viewStackEmbed)
        msg.edit(StackEmbed)
    console.log("after the queueu update")
  }

  

  const updateColor = (message, color) => {
    viewStackEmbed.color = color
    StackEmbed = new Discord.MessageEmbed(viewStackEmbed)
    message.edit(StackEmbed)
  }

  const getGameData = () => {
    return new Promise(async (res, rej) => {
      let gaemz = await getGuildData(message.guild.name)
      res(gaemz[message.guild.id][args[0]])
    })
  }

  const getGameStack = async () => {
    let ids = ""
    let gameData = await getGameData()
    // console.log(gameData)
    for (let personID of gameData.stack[author]) {
      ids += `<@${personID}>\n`;  
    } 
    if (ids.length === 0 ) ids += "There no one in the queue."
    return ids
  }

  const removeStack = async () => {
    delete game.stack[author]
    await writeToGuild(message.guild, `${args[0]}.stack`, game.stack)
  }

  let data = await getGuildData(message.guild.name)
if (!data[message.guild.id][args[0]]) {
	message.reply("This game does not exist. Please enter a valid game code.")
	return
}
   if (!checkLFG(message, data, args[0])) {
    message.reply(`You are not in the LFG channel. Please enter commands into <#${data[message.guild.id][args[0]]["lfg"]}>  or set the lfg channel with the ${"`qset lfg <game code>`"} into a game channel.`)
      return
  }
    if(Object.keys(data[message.guild.id]).length === 0) {
      message.reply(`You've not added any games to this server! Make sure you set the LFG channel and make some games!`)
      return
    }

    let game = await getGameData()
    let mins = game["queueTimeoutMins"]
    if (!game["queueTimeoutMins"]) {
      await writeToGuild(message.guild, `${args[0]}.queueTimeoutMins`, 5)
    }
    game = await getGameData()
    mins = game["queueTimeoutMins"]
    
    
    if(!game) {
      message.reply("This game does not currently exist on this server. Run **qadd** <name> <max number> <game shortcut> to create the game.")
      return   
    }
    message.channel.send(
      `A **${game.name}** queue request has started. React to this msg above to secure a spot. This request **expires in ${game["queueTimeoutMins"]} minutes**.`
    );
    message.react("✅").then(() => message.react("❌"));
    let people = "The people being pinged:\n";
    for(let player of game.players) {
      people += `<@${player}>`
    }
   if(people.length == 25) {
	people += "There is currently nobody subscribed to this game."
   }
    message.channel.send(people);
    
    if (!game.stack[author]) {
      game.stack[author] = [author]
    } 
    if (!game.stack[author].includes(message.author.id)) {
      game.stack[author].push(author)
    }
    
    await writeToGuild(message.guild, `${args[0]}.stack`, game.stack)
    
    let viewStackEmbed = {
      color: 0x0099ff,
      title: 'Queue Time!',
      author: {
          name: message.author.tag,
      },
      description: `Active Queue List for **${game.name}**`,
      fields: [
          {
              name: `**People in stack** (${game.stack[author].length}/${game.stackSize})`,
              value: await getGameStack(),
              inline: true,
          }
      ],
      timestamp: new Date(),
  }
  let embed = message.channel.send({embed: viewStackEmbed})

    const filter = (reaction, user) => {
      return ["✅", "❌"].includes(reaction.emoji.name) && user.tag !== "Queuey Boi#6717" ; 
    };

    const collector = message.createReactionCollector(filter, {
      max: game.stackSize + 1,
      time: 1000*60*mins
    });

    collector.on("collect", async(reaction, user) => {
      game = await getGameData()
      console.log("current game stack", getGameStack())

    if(reaction.emoji.name === "❌") {
      if(!game.stack[author].includes(user.id)) return
      game.stack[author].splice(game.stack[author].indexOf(user.id), 1)
      console.log("❌", game.stack)
    }
    if(reaction.emoji.name === "✅") {
      if(game.stack[author].includes(user.id)) return
      game.stack[author].push(user.id);
      console.log("✅", game.stack)
    }

      await writeToGuild(message.guild, `${args[0]}.stack.${author}`, game.stack[author]).then(async res => {
        if (res) await embed.then(message => {updateQueue(message)})
      })
    });

    collector.on("end", async collected => {
      game = await getGameData()
      if(!game.stack[author]) {
        console.log("Q is full")
        return
      }
	await removeStack()
      message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
      embed.then(message => updateColor(message, 0xff2200))
      message.reply(`Your **${game.name}** queue expired. Requeue with the ${"`qq " + args[0] +"`"} command.`)
      return
    })
  }
};
