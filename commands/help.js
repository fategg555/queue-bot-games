const {checkLFG} = require("./../util/util.js")

module.exports = {
	name: "help",
	description: 'view all commands and params',
    params: "<none>",
	execute(message, args, client) {
    const database = require("./../util/database.js")
    let data = database.read();
    const fs = require('fs')
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    if (!checkLFG(message, data)) {
        message.author.send(`You are not in the LFG channel. Please enter commands into the lfg channel or set the lfg channel with the ${"`qset <channel>`"} command`)
          return
    }
    let names = []
    let namesString = ""
    let descs = []
    let descsString = ""
    let params = []
    let paramsString = ""

    for(let command of commandFiles) {
        names.push("q"+require("./"+command).name)
        descs.push(require("./"+command).description)
        params.push(require("./"+command).params)
    }

    for (let name of names) {
        namesString += name + "\n\n"
    }

    for (let desc of descs) {
        descsString += desc + "\n\n"
    }

    for (let param of params) {
        paramsString += param + "\n\n"
    }

    const viewHelpEmbed = {
        color: 0x0099ff,
        title: 'Help Center',
        // url: 'https://discord.js.org',
        // author: {
        //     name: 'Some name',
        //     icon_url: 'https://i.imgur.com/wSTFkRM.png',
        //     url: 'https://discord.js.org',
        // },
        description: 'view commands and usage',
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
                name: '**Command**',
                value: namesString,
                inline: true,
            },
            {
                name: '**Parameters**',
                value: paramsString,
                inline: true,
            },
            {
                name: '**Description**',
                value: descsString,
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

    message.author.send({embed: viewHelpEmbed})
        
       
	
    }
}