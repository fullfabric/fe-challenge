const { sample, find, last, every } = require('lodash')
const Game = require('../models/game')
const sequelize = require('../sequelize')
const { existsOr404 } = require('./utils')
const { PlayerAlreadyPlayed, PlayerNotPartOfTurn } = require('../models/turn/errors')

const FULL_GAME_OPTIONS = { include: ['players', 'turns'], order: [['turns', 'createdAt', 'ASC']] }

async function createGame(ctx) {
  const game = await Game.create(ctx.request.body)
  ctx.body = { game }
}

async function listGames(ctx) {
  const games = await Game.findAll({ include: ['players'], order: [['createdAt', 'DESC']] })
  ctx.body = { games }
}

async function showGame(ctx) {
  const game = await Game.findByPk(ctx.params.id, FULL_GAME_OPTIONS)

  existsOr404(ctx, game)

  ctx.body = { game }
}

async function joinGame(ctx) {
  const game = await Game.findByPk(ctx.params.id)

  existsOr404(ctx, game)

  const newPlayer = await sequelize.transaction(async (t) => {
    const playerCount = await game.countPlayers({ transaction: t })

    if (playerCount >= 2) {
      ctx.throw(400, 'Game is full', { error: 'Game is full' })
    }

    return await game.createPlayer({ name: ctx.request.body.playerName, hp: game.startingHP }, { transaction: t })
  })

  ctx.body = { game: await game.reload({ include: ['players'] }), playerId: newPlayer.id }
}

async function startGame(ctx) {
  const game = await Game.findByPk(ctx.params.id, { include: ['players'] })

  existsOr404(ctx, game)

  if (game.players.length < 2) {
    ctx.throw(400, 'Not enough players')
  }

  if (game.isStarted()) {
    ctx.throw(400, 'Game already started')
  }

  const attacker = sample(game.players)
  const defender = game.players.find((p) => p.id !== attacker.id)

  await sequelize.transaction(async (t) => {
    game.startedAt = new Date()

    await game.createTurn({ attackerId: attacker.id, defenderId: defender.id })
    await game.save({ transaction: t })
  })

  ctx.body = { game: await game.reload(FULL_GAME_OPTIONS) }
}

async function roll(ctx) {
  const game = await Game.findByPk(ctx.params.id, FULL_GAME_OPTIONS)

  existsOr404(ctx, game)

  if (!game.isStarted()) ctx.throw(400, 'Game is not started')
  if (game.isFinished()) ctx.throw(400, 'Game is finished')

  const player = find(game.players, ['id', ctx.request.body.playerId])

  if (!player) ctx.throw(400, "You're not part of this game")

  try {
    const currentTurn = last(game.turns)
    const roll = currentTurn.roll(player.id, game.dieSize)
    await currentTurn.save()

    if (currentTurn.isFinished()) {
      await applyTurnDamage(game, currentTurn)

      if (every(game.players, (player) => player.isAlive())) {
        await game.createTurn({ attackerId: currentTurn.defenderId, defenderId: currentTurn.attackerId })
      } else {
        game.winnerId = currentTurn.attackerId
        await game.save()
      }
    }

    ctx.body = {
      roll,
      game: await game.reload(FULL_GAME_OPTIONS)
    }
  } catch (error) {
    if (error instanceof PlayerAlreadyPlayed) {
      ctx.throw(400, "You've already played this turn")
    }

    if (error instanceof PlayerNotPartOfTurn) {
      ctx.throw(400, "You're not part of this game")
    }

    throw error
  }
}

module.exports = {
  createGame,
  joinGame,
  showGame,
  listGames,
  startGame,
  roll
}

async function applyTurnDamage(game, turn) {
  const defender = find(game.players, ['id', turn.defenderId])

  if (turn.attackRoll > turn.defenseRoll) {
    defender.takeDamage(turn.attackRoll - turn.defenseRoll)
    await defender.save()
  }
}
