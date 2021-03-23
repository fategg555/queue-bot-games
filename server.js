// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)

// but feel free to use whatever libraries or frameworks you'd like through `package.json`.

require("dotenv").config()

const express = require("express");
const app = express();

const fs = require('fs')
const Discord = require('discord.js');
const client = new Discord.Client()
client.commands = new Discord.Collection()
client.cooldowns = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const config= require("./config.js")



client.once('ready', () => {
  console.log("ready!")
})

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on("message", msg => {
  if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;
  const args = msg.content.slice(config.prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
  if (!client.commands.has(command)) return;
  
  try {
	  client.commands.get(command).execute(msg, args, client);
  } catch (error) {
	  console.error(error);
	  msg.reply('there was an error trying to execute that command! Check your spelling or refer to qhelp for a list of commands and args.');
  }
})

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];
































































// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// // https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

client.login(process.env.BOT_TOKEN)
// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
