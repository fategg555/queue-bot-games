const database = require("./database.js")

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://admin:${process.env.MONGO_PWD}@cluster0.zrz6s.mongodb.net/Information?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const getGuildData = (serverName) => {

    return new Promise((resolve, rej) => {
        client.connect(async err => {
            if (err) throw err
          const collection = client.db("Information").collection("info");
          // perform actions on the collection object
          let serverObj = {"server": serverName}
          collection.find(serverObj).toArray((err, res) => {
                if (err)
                    throw err;
                resolve(res[0]);
            })
        }); 
      
    })
  
}

const createNewServerInfoDoc = async (guild) => {
    return new Promise((resolve, rej) => {
        client.connect(err => {
            const collection = client.db("Information").collection("info")
            const query = {"server": guild.name}
            collection.insertOne(query, (err, res) => {
                let guildObj = {$set: {[guild.id]: {"lfgs": []}}}
                if (err) throw err;
                if (res) {
                    collection.updateOne(query, guildObj, (err, res) => {
                        if (err) throw err;
                        resolve(true)
                    })
                }
            })
            
        })
    })
}

const writeToGuild = (guild, fields, data) => {
    return new Promise((res, rej) => {
            client.connect(async err => {
                const collection = client.db("Information").collection("info")
                const query = {"server": guild.name}
                let id = guild.id
                let guildObj = {$set: {[id + "." + fields]: data}}
                await collection.updateOne(query, guildObj).then(() => console.log("wrote data to the", guild.name, data))
                res(true)
            })
    })
}

const deleteFromGuild = async (guild, data) => {
    return new Promise((resolve, rej) => {
        client.connect(async err => {
            const collection = client.db("Information").collection("info")
            const query = {"server": guild.name}
            let guildObj = {$set: data}
            await collection.updateOne(query, guildObj).then(() => console.log("wrote data to the", guild.name, data))
            resolve(true)
        })
    })
}

module.exports = {
    getGuildData,
    createNewServerInfoDoc,
    writeToGuild,
    deleteFromGuild
}


