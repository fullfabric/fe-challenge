const fs = require('fs/promises')
const path = require('path')

const Router = require('@koa/router')

const games = require('./routes/games')

const router = new Router()

router.use('/api/games', games)

router.get('/openapi.yaml', async (ctx) => {
  ctx.type = 'text/yaml'
  ctx.body = await fs.readFile(path.join(__dirname, '..', 'docs', 'openapi.yaml'), 'utf8')
})

router.get('/docs', async (ctx) => {
  ctx.type = 'text/html'
  ctx.body = await fs.readFile(path.join(__dirname, '..', 'docs', 'index.html'), 'utf8')
})

router.get('/(.*)', async (ctx) => {
  ctx.type = 'text/html'
  ctx.body = await fs.readFile(path.join(__dirname, '..', 'fe', 'dist', 'index.html'), 'utf8')
})

module.exports = router.routes()
