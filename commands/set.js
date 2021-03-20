const database = require("./../util/database.js");

let data = database.read()

module.exports = {
	name: "set",
	description: 'set various properties',
	execute(message, args) {
	  if(/^<#.*>$/.test(args[0]) && args[0].length == 21) {
      message.channel.send(`${args[0]} has been set to the active lfg channel. Any commands will not work outside of it.`)
      if(!data[message.guild.id]) {
        data[message.guild.id] = {}
        data[message.guild.id]["lfg"] = ""
      }
      data[message.guild.id]["lfg"] = args[0]
      database.write(data)
    } else {
      message.channel.send("This is an invalid channel. Try again.")
      return
    }
	},
};