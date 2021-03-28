const database = require("./database.js")

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://admin:${process.env.MONGO_PWD}@cluster0.zrz6s.mongodb.net/Information?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const getServerData = (serverName) => {
  client.connect(err => {
    const collection = client.db("Information").collection("info");
    // perform actions on the collection object
    let serverObj = {"server": serverName}
    collection.find(serverObj).toArray((err, res) => {
    //   console.log(res[0])
      database.write(res[0])
    })
  }); 

  return database.read()
  
}


const createNewServerInfoDoc = (guild) => {
    client.connect(err => {
        const collection = client.db("Information").collection("info")
        const query = {"server": guild.name}
        collection.insertOne(query, (err, res) => {
            let guildObj = {$set: {[guild.id]: {}}}
            if (err) throw err;
            if (res) {
                collection.updateOne(query, guildObj, (err, res) => {
                    if (err) throw err;
                })
            }
        })
        
    })
}

const writeToServer = (guild, fields, data) => {
    client.connect(err => {
        const collection = client.db("Information").collection("info")
        const query = {"server": guild.name}
        let id = guild.id
        let guildObj = {$set: {[id + "." + fields]: data}}
        collection.updateOne(query, guildObj)
    })
}

module.exports = {
    getServerData,
    createNewServerInfoDoc,
    writeToServer
}


