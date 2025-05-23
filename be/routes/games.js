const Router = require('@koa/router')
const Joi = require('joi')

const router = new Router()

const { createGame, joinGame, showGame, listGames, startGame, roll } = require('../controllers/games')

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

router.get('/', listGames)
router.post('/', validateBody(createGameSchema), createGame)
router.get('/:id', showGame)
router.post('/:id/join', validateBody(joinGameSchema), joinGame)
router.post('/:id/start', startGame)
router.post('/:id/roll', validateBody(rollSchema), roll)

module.exports = router.routes()

function validateBody(schema) {
  return async (ctx, next) => {
    await schema.validateAsync(ctx.request.body)
    await next()
  }
}
