/* global compose, chain, map */

const fs = require('./fs')
const path = require('path')
require('pointfree-fantasy').expose(global)
const moment = require('moment-timezone')
const cheerio = require('cheerio')
const waitAll = require('folktale/data/task').waitAll

const entriesPath = path.join('src', 'entries')

// dateToObject : Date -> Object
const dateToObject = compose(wrapper => ({
  year: wrapper.year(),
  month: wrapper.format('MMMM'),
  date: wrapper.date(),
  day: wrapper.day(),
  time: wrapper.format('HH:mm'),
  timestamp: wrapper.tz('America/New_York').format('dddd, D MMMM YYYY [at] H:mm z')
}), moment)

// parseHTML : String -> Task Err Cheerio
const parseHTML = compose(map(cheerio.load), fs.readFile)

// makeRecord : String -> Task Err Object
const makeRecord = filename => {
  const relativePath = path.join(entriesPath, filename)

  return compose(
    map(([$, stat]) => ({
      src: relativePath,
      name: $('article > h1').text(),
      href: path.join(path.sep, 'entries', filename),
      created: dateToObject(stat.birthtime),
      modified: dateToObject(stat.mtime)
    })),
    waitAll
  )([
    parseHTML(relativePath),
    fs.stat(relativePath)
  ])
}

module.exports = compose(
  map(entries => ({ entries: entries })),
  chain(compose(waitAll, map(makeRecord))),
  fs.readdir
)(entriesPath)
