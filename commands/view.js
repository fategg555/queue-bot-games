const {checkAllLFG} = require("./../util/util.js")
const { writeToGuild, getGuildData } = require("../util/mongo.js");

module.exports = {
	name: "view",
	description: 'view games and their shortcuts',
    params: "<none>",
	async execute(message, args) {
        let data = await getGuildData(message.guild.name)

    if (!checkAllLFG(message, data)) {
        return
      }

    let games = Object.keys(data[message.guild.id])
    games.splice(games.indexOf("lfgs"), 1)
    
    let gamesString = ""
    let namesString = ""
    let subListLengthString = ""

    for (let game of games) {
        gamesString += game + "\n"
    }

    for (let game of games) {
        namesString += data[message.guild.id][game]["name"] + "\n"
    }

    for (let game of games) {
        subListLengthString += data[message.guild.id][game].stackSize + "\n"
    }

    const viewGamesEmbed = {
        color: 0x0099ff,
        title: 'View Games',
        // url: 'https://discord.js.org',
        // author: {
        //     name: 'Some name',
        //     icon_url: 'https://i.imgur.com/wSTFkRM.png',
        //     url: 'https://discord.js.org',
        // },
        description: 'View games in the server',
        // thumbnail: {
        //     url: 'https://i.imgur.com/wSTFkRM.png',
        // },
        fields: [
            // {
            //     name: 'Regular field title',
            //     value: 'Some value here',
            // },
            // {
            //     name: '\u200b',
            //     value: '\u200b',
            //     inline: false,
            // },
            {
                name: '**Game name**',
                value: namesString,
                inline: true,
            },
            {
                name: '**Game code**',
                value: gamesString,
                inline: true,
            },
            {
                name: '**Stack Size**',
                value: subListLengthString,
                inline: true,
            },
        ],
        // image: {
        //     url: 'https://i.imgur.com/wSTFkRM.png',
        // },
        timestamp: new Date(),
        // footer: {
        //     text: 'Some footer text here',
        //     icon_url: 'https://i.imgur.com/wSTFkRM.png',
        // },
    };

    message.channel.send({embed: viewGamesEmbed}).catch(e => message.reply("You can't view any games because there aren't any. Add a game to view it."))

	},
};