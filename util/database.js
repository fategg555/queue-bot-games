const fs = require('fs')
const dbfile = __dirname + "/info.json" 

const write = (content) => {
  fs.writeFile(dbfile, JSON.stringify(content), (err) => {if (err) console.log(err)})
}

const read = () => {
  let raw = fs.readFileSync(dbfile)
  let parsed = JSON.parse(raw)
  return parsed
}

const readPlainText = () => {
  return fs.readFileSync(dbfile).toString()
}

module.exports = {write, read, readPlainText}
