const { checkAllLFG } = require("./../util/util.js")
const { writeToGuild, getGuildData, getEmoji, getUserData } = require("../util/mongo.js");

module.exports = {
    name: "bank",
    description: 'view items and currency',
    params: "<none>",
    async execute(message, args) {
        let data = await getGuildData(message.guild.name)

        if (!checkAllLFG(message, data)) {
            return
        }

        itemsString = ""
        let usrData = await getUserData(message.author.id)
console.log(usrData)
        if (usrData?.[message.guild.id] === null || usrData?.[message.guild.id] === undefined ) {
            itemsString += "You don't have any items/currency."
        } else {
            let userData = usrData[message.guild.id]
            let items = Object.keys(userData)
            for (let item of items) {
                let emote = await getEmoji(item)
                itemsString += `${emote} ${"`"+item+"`"}: ${userData[item]}\n`
            }
        }

        const viewBankEmbed = {
            color: 0x91007e,
            title: `${message.author.tag}'s Bank`,
            description: `${message.guild.name} account`,
            fields: [
                {
                    name: '**Currency and Items**',
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
