const Koa = require('koa')
const { koaBody } = require('koa-body')

const routes = require('./routes')

const app = new Koa()

// Basic logging
app.use(async (ctx, next) => {
  await next()

  const rt = ctx.response.get('X-Response-Time')

  if (process.env.NODE_ENV !== 'test') {
    console.log(`${ctx.method} ${ctx.url} - ${rt}`)
  }
})

app.use(errorHandler())
app.use(koaBody()) // Body parsing
app.use(routes)

app.on('error', (err, ctx) => {
  if (!err.status || err.status === 500) console.error('Server error', err)
})

module.exports = app

function errorHandler() {
  return async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      let { status = 500, message, details, isJoi } = error

      const body = { error: { message, details } }

      if (isJoi) {
        status = 422
        error.message = details.map((d) => d.message).join('\n')
        error.receivedBody = ctx.request.body
      }

      ctx.type = 'json'
      ctx.status = status
      ctx.body = body

      ctx.app.emit('error', error, ctx)
    }
  }
}
