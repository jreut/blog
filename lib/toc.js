const fs = require('fs')
const path = require('path')
const moment = require('moment')
const cheerio = require('cheerio')
const _ = require('pointfree-fantasy')
const Task = require('folktale/data/task')

const entriesPath = path.join('src', 'entries')

const dateToObject = function (date) {
  const wrapper = moment(date)
  return {
    year: wrapper.year(),
    month: wrapper.format('MMMM'),
    date: wrapper.date(),
    day: wrapper.day(),
    time: wrapper.format('HH:mm')
  }
}

const makeRecord = function (filename) {
  const relativePath = path.join(entriesPath, filename)
  const href = path.join(path.sep, 'entries', filename)
  const $ = cheerio.load(fs.readFileSync(relativePath))
  return Task.fromNodeback(fs.stat)(relativePath).map(function (stat) {
    return ({
      src: relativePath,
      name: $('article > h1').text(),
      href: href,
      created: dateToObject(stat.birthtime),
      modified: dateToObject(stat.mtime)
    })
  })
}

module.exports = function () {
  return Task.fromNodeback(fs.readdir)(entriesPath)
    .orElse(function () { return [] })
    .chain(_.compose(Task.waitAll, _.map(makeRecord)))
    .map(function (entries) { return { entries: entries } })
}
