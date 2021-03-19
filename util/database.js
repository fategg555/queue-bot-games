const fs = require('fs')
const dbfile = __dirname + "/data.json"
const dbTempFile = __dirname + "/data.json"


const write = (file, content) => {
  fs.writeFile(file, JSON.stringify(content), (err) => {if (err) console.log(err)})
}

const read = (file) => {
  let raw = fs.readFileSync(file)
  let parsed = JSON.parse(raw)
  return parsed
}

const readPlainText = (file) => {
  return fs.readFileSync(file).toString()
}

module.exports = {write, read, readPlainText}