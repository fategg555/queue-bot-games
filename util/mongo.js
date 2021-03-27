const database = require("./database.js")

const getClient = () => {
    const MongoClient = require('mongodb').MongoClient;
    const uri = `mongodb+srv://admin:<${process.env.MONGO_PWD}>@cluster0.zrz6s.mongodb.net/Information?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    return client
}

const getServerData = (client, server) => {
    client.connect(err => {
        const collection = client.db("Information").collection("info")
        collection.find({"server": server}).toArray((err, res) => {
            database.write(res[0])
        })
    })
    
    database.read()
}

const createNewServerInfoDoc = (client, guild) => {
    client.connect(err => {
        const collection = client.db("Information").collection("info")
        collection.insertOne({"server": guild.name}, (err, res) => {
            if (err) throw err;
            if (res) {
                collection.updateOne({"server": guild.name}, {$set: {[guild.id]: {}}}, (err, res) => {
                    if (err) throw err;
                })
            }
        })
        
    })
}

const writeToServer = (client, data) => {
    
}

module.exports = {
    getClient,
    getServerData
}


