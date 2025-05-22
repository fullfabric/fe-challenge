const { Router } = require('@koa/router')

const Game = require('../models/game')

const router = new Router()

router.get('/', async (ctx) => {
  const games = await Game.findAll()
  ctx.body = games
})

module.exports = router
