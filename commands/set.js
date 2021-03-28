const {checkManager} = require("./../util/util.js");
const { writeToServer, getServerData, createNewServerInfoDoc } = require("../util/mongo.js");
//let data = database.read()

module.exports = {
	name: "set",
	description: 'set various LFG channel',
  params: "<none>",
	execute(message, args) {

    let server = getServerData(message.guild.name)
    if (!checkManager(message)) {
      message.author.send("You do not have the *Game Manager* role. Either request to get the role or request someone with the role to set the LFG.")
      return
      }

	  if(message.channel.id.length == 18) {
      if (!server[message.guild.id]) {
        createNewServerInfoDoc(message.guild)
      }

      if (getServerData(message.guild.name)[message.guild.id]["lfg"] === message.channel.id) {
        message.channel.send("This channel has already been set.")
        return
      }
      
      writeToServer(message.guild, "lfg", message.channel.id)
      message.channel.send(`The LFG channel has been set to <#${message.channel.id}> ✅!`)
        

    } else {
      message.channel.send("This is an invalid channel. Try again.")
      return
    }
	},
};
