const connect = require('connect')
const serveStatic = require('serve-static')
const logger = require('morgan')
const liveReload = require('inject-lr-script')

const port = process.env.PORT || 3000

connect()
  .use(liveReload())
  .use(serveStatic('dist'))
  .use(logger('tiny'))
  .listen(port, () => {
    console.log('server listening on %d...', port)
  })
