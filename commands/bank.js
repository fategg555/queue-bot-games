const { checkAllLFG } = require("./../util/util.js")
const { writeToGuild, getGuildData, getEmoji, getUserData } = require("../util/mongo.js");

module.exports = {
    name: "bank",
    description: 'view items and currency',
    params: "<none>",
    async execute(message, args) {
        let data = await getGuildData(message.guild.name)

        if (!checkAllLFG(message, data)) {
            message.channel.send(`You are not in an LFG channel. Please enter this into an lfg channel.`)
            return
        }

        itemsString = ""
        let userData = await getUserData(message.author.id)
        if (!userData) {
            itemsString += "You don't have any items/currency"
        } else {
            delete userData["_id"]
            delete userData["id"]
            let items = Object.keys(userData)
            for (let item of items) {
                let emote = await getEmoji(item)
                itemsString += `${emote} ${"`"+item+"`"}: ${userData[item]}\n`
            }
        }




        const viewBankEmbed = {
            color: 0x91007e,
            title: `${message.author.tag}'s Bank`,
            description: 'Currency and Items',
            fields: [
                {
                    name: '**Stuff**',
                    value: itemsString,
                    inline: false,
                }
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

        message.channel.send({ embed: viewBankEmbed }).catch(e => message.reply("You can't view any games because there aren't any. Add a game to view it."))

    },
};
