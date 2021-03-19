let config = require("./../config.js")

let lfg = config["lfg-channel"]



module.exports = {
	name: "set",
	description: 'set various properties',
	execute(message, args) {
	  if(/^<#.*>$/.test(args[0]) && args[0].length == 21) {
      message.channel.send(`${args[0]} has been set to the active lfg channel. Any commands will not work outside of it.`)
      console.log(lfg)
    } else {
      console.log("invalid channel name")
    }
	}
};