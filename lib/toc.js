const fs = require('fs')
const path = require('path')
const moment = require('moment')
const cheerio = require('cheerio')

const entries = path.join('src', 'entries')

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

module.exports = function () {
  return new Promise(function (resolve, reject) {
    fs.readdir(entries, function (err, files) {
      if (err) { reject(err) }
      Promise.all(
        files.map(function (file) {
          return new Promise(function (resolve, reject) {
            const relativePath = path.join(entries, file)
            const href = path.join(path.sep, 'entries', file)
            const $ = cheerio.load(fs.readFileSync(relativePath))
            fs.stat(relativePath, function (err, stat) {
              if (err) { reject(err) }
              resolve({
                src: relativePath,
                name: $('article > h1').text(),
                href: href,
                created: dateToObject(stat.birthtime),
                modified: dateToObject(stat.mtime)
              })
            })
          })
        })
      ).then(function (entries) {
        resolve({ entries: entries })
      })
    })
  })
}
