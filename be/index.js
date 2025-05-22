const Koa = require('koa')
const { koaBody } = require('koa-body')

const routes = require('./routes')

const app = new Koa()

// Basic logging
app.use(async (ctx, next) => {
  await next()

  const rt = ctx.response.get('X-Response-Time')

  console.log(`${ctx.method} ${ctx.url} - ${rt}`)
})

// Body parsing
app.use(koaBody())

app.use(routes)

module.exports = app
