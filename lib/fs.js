const fs = require('fs')
const printf = require('util').format
const fromNodeback = require('folktale/data/task').fromNodeback

const readdir = filepath => fromNodeback(fs.readdir)(filepath)

//    readFile : String   -> Task Err String
const readFile = filepath =>
  fromNodeback(fs.readFile)(filepath, { encoding: 'utf-8' })

//    writeFile : String   -> String|Buffer -> Task Err ()
const writeFile = filepath => contents =>
  fromNodeback(fs.writeFile)(filepath, contents)
    .map(() => printf('Wrote %s', filepath))

const stat = fromNodeback(fs.stat)

module.exports = {
  readdir: readdir,
  readFile: readFile,
  writeFile: writeFile,
  stat: stat
}
