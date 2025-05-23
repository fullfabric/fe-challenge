const Router = require('@koa/router')
const Joi = require('joi')

const router = new Router()

const { createGame, joinGame, showGame, listGames, startGame, roll } = require('./controllers/games')

const createGameSchema = Joi.object({
  dieSize: Joi.number().integer().min(1).max(100).optional(),
  startingHP: Joi.number().integer().min(1).max(100).optional()
})

const joinGameSchema = Joi.object({
  name: Joi.string().required()
})

const rollSchema = Joi.object({
  playerId: Joi.string().uuid().required()
})

// Validation middleware
const validateBody = (schema) => async (ctx, next) => {
  await schema.validateAsync(ctx.request.body)
  await next()
}

router.get('/games', listGames)
router.post('/games', validateBody(createGameSchema), createGame)
router.get('/games/:id', showGame)
router.post('/games/:id/join', validateBody(joinGameSchema), joinGame)
router.post('/games/:id/start', startGame)
router.post('/games/:id/roll', validateBody(rollSchema), roll)

module.exports = router.routes()
