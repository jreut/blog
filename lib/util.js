module.exports = {
  prop: prop => obj => obj[prop],
  tap: label => x => { console.log(label, x); return x }
}
