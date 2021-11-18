const {checkLFG} = require("./../util/util.js");
const {writeToGuild, getGuildData, getUserData, createUser, updateUserData, addEmoji} = require("../util/mongo.js");
const Discord  = require("discord.js");
const { connect } = require("mongodb");
//let stack = database.read();

module.exports = {
  name: "q",
  cooldown: 60,
  description: "looking for game command",
  params: "<game shortcut>",
  async execute(message, args, client) { 

  const author = message.author.id
  let authordata = await getUserData(author)
  if (!authordata) {
    await createUser(author, message.guild.id)
  }
  authordata = await getUserData(author)
  console.log("AUTHOR", authordata)
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
          if(authordata?.[message.guild.id] || authordata?.[message.guild.id] === undefined) {
            await updateUserData(author, message.guild.id +".tokens", 0)
          }
          authordata = await getUserData(author)
          let authorData = authordata[message.guild.id]
          let tokens = authorData["tokens"]
          tokens += game.stack[author].length
          if (game.stackSize > 3) await updateUserData(author, message.guild.id +".tokens", tokens)
          for (let usr of game.stack[author]) {
	    if (usr === author) continue
            let usrData = await getUserData(usr)
            if(!usrData) {
              await createUser(usr, message.guild.id)
            }
            if(usrData?.[message.guild.id] === null || usrData?.[message.guild.id] === undefined) {
              await updateUserData(usr, message.guild.id +".tokens", 0)
            }
            usrData = await getUserData(usr)
            console.log(usrData)
            let userData = usrData[message.guild.id]
            let tokns = userData["tokens"]
            tokns += 1
            if (game.stackSize > 3) await updateUserData(usr, message.guild.id+".tokens", tokns)
          }
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
      return
  }
    if(Object.keys(data[message.guild.id]).length === 0) {
      message.reply(`You've not added any games to this server! Make sure you set the LFG channel and make some games!`)
      return
    }

    let timeFormat = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/

    if (args.length > 1) {
      if (!timeFormat.test(args[1])) {
        message.reply(`Your time string in invalid. It should be in the format of ${"`HH:MM`"} of a valid time.`)
        return
      }
    }

    let game = await getGameData()
    let mins = game["queueTimeoutMins"]
    let timeEnd = game["queueEnd"]
    if (!game["queueTimeoutMins"]) {
      await writeToGuild(message.guild, `${args[0]}.queueTimeoutMins`, 5)
    }

    game = await getGameData()
    mins = game["queueTimeoutMins"]

    if (!game["queueEnd"]) {
      let futureTime = new Date()
      if (args.length > 1) {
        let timeArray = args[1].split(":")
        futureTime.setHours(timeArray[0])
        futureTime.setMinutes(timeArray[1])
      } else {
        futureTime = futureTime.setMinutes(futureTime.getMinutes() + mins)
      }
      await writeToGuild(message.guild, `${args[0]}.queueEnd`, new Date(futureTime))
    }

    game = await getGameData()
    timeEnd = game["queueEnd"]
    
    if(!game) {
      message.reply("This game does not currently exist on this server. Run **qadd** <name> <max number> <game shortcut> to create the game.")
      return   
    }
    message.channel.send(
      `A **${game.name}** queue request has started. React to this msg above to secure a spot. This request **expires at** ${"`"+new Date(game["queueEnd"]).toLocaleString().split(",")[1].slice(1)+"`"}.`
    );
    message.react("✅").then(() => message.react("❌"));
    let people = "The people being pinged:\n";
    for(let player of game.players) {
      people += `<@${player}>\n`
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
      return ["✅", "❌"].includes(reaction.emoji.name) && user.id !== process.env.TEST_BOT_ID ; 
    };

    const collector = message.createReactionCollector(filter, {
      max: game.stackSize + 1,
      time: timeEnd - new Date()
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
        message.reply(`It's time to play **${game.name}**! Gather your stack and get to playing!`)
        return
      }
      delete game["queueEnd"]
      await writeToGuild(message.guild, `${args[0]}`, game)
	    await removeStack()
  
      message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
      embed.then(message => updateColor(message, 0xff2200))
      message.reply(`Your **${game.name}** queue expired. Requeue with the ${"`qq " + args[0] +"`"} command.`)
      return
    })
  }
};
