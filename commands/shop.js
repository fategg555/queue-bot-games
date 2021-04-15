const { checkAllLFG } = require("./../util/util.js")
const { writeToGuild, getGuildData, getEmoji, getUserData, getShop, updateUserData } = require("../util/mongo.js");
const { Structures } = require("discord.js");

module.exports = {
    name: "shop",
    description: 'view items and currency',
    params: "<none>",
    async execute(message, args) {
        let data = await getGuildData(message.guild.name)
        if (!checkAllLFG(message, data)) {
            message.channel.send(`You are not in an LFG channel. Please enter this into an lfg channel.`)
            return
        }

        itemsString = ""
        let shop = await getShop()
        delete shop["_id"]
        for (let item of shop) {
            let price = item.price.split(" ")
            let value = price[0]
            let currency = price[1]
            itemsString += `1 ${await getEmoji(item.name)} ${"`" + item.name + "`"}: ${value} ${await getEmoji(currency)} ${"`" + currency + "`"}\n`
        }

        const viewShopEmbed = {
            color: 0xb0005e,
            title: `The Shop`,
            fields: [
                {
                    name: '**Items for Sale**',
                    value: itemsString,
                    inline: false,
                }
            ],
            timestamp: new Date(),
        }
        if (parseInt(args[0])) {
            let number = parseInt(args[0])
            let user = await getUserData(message.author.id)
            let shop = await getShop()
            let itemName = await new Promise((resolve, reject) => {
                let nameString = ""
                for(let word of args.splice(1, args.length - 1)) {
                    nameString += word + " "
                }
                let string = nameString.slice(0, nameString.length - 1)
                resolve(string)
            })
            let item = await new Promise((resolve, reject) => {
                for (let stuffs of shop) {
                    console.log(stuffs.name)
                    if (stuffs.name === itemName) {
                        resolve(stuffs)
                        return
                    } else {
                        continue
                    }
                }
                message.channel.send(`The item ${"`" + itemName + "`"} does not exist. Look up items in the shop.`)
                return
            })
            let price = item.price.split(" ")[0]
            let currency = item.price.split(" ")[1]
            let cost = parseInt(price) * number
            let balance = user[message.guild.id][currency]
            if (cost > balance) {
                message.channel.send(`You don't have enough ${"`" + currency + "`"} to buy ${"`" + item.name + "`"}.`)
                return
            }
            let reactionMessage = await new Promise((resolve, reject) => {
                message.channel.send(`Are you sure you want to buy ${args[0]} ${"`" + itemName + "`"} at a cost of **${cost + " " + "`" + currency + "`"}**?`).then(msg => {
                    msg.react("✅").then(() => {
                        msg.react("❌")
                        resolve(msg)
                    })
                })
            })

            const filter = (reaction, user) => {
                return ["✅", "❌"].includes(reaction.emoji.name) && user.id === message.author.id;
            };

            const collector = reactionMessage.createReactionCollector(filter, {
                max: 2,
                time: 1000 * 60
            });
            collector.on("collect", async (reaction, user) => {

                if (reaction.emoji.name === "❌") {
                    message.channel.send("This purchase has been cancelled.")
                    reactionMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                    return
                }
                if (reaction.emoji.name === "✅") {
                    balance -= cost
                    let data = await getUserData(user.id)
		    newStuff = data[message.guild.id][itemName]
                    if(!newStuff) newStuff = 0
                    newStuff += number
                    //await updateUserData(user.id, message.guild.id +"."+itemName, newStuff)
                    //await updateUserData(user.id, message.guild.id +"."+currency, balance)
		    if (balance === 0) {
			delete data[message.guild.id][currency]
			await updateUserData(user.id, message.guild.id, data[message.guild.id])
		    } else {
			await updateUserData(user.id, message.guild.id+"."+currency, balance)
		    }
		    await updateUserData(user.id, message.guild.id+"."+itemName, newStuff)
                    message.channel.send("Your purchase has been completed ✅.")
                    reactionMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                    return
                }


            });

        } else {
            console.log("here")
            message.channel.send({ embed: viewShopEmbed }).catch()
        }


    },
};
