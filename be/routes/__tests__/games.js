const request = require('supertest')
const { v4: uuidv4 } = require('uuid')

const app = require('../..')
const Game = require('../../models/game')
const Player = require('../../models/player')
const { first, every, map, find } = require('lodash')

describe('GET /games', () => {
  it('returns a list of games', async () => {
    const { body, status } = await request(app.callback()).get('/games')
    expect(status).toBe(200)
    expect(body.games).toEqual([])
  })

  it('returns the games in descending order of creation', async () => {
    const games = await Promise.all([
      Game.create({ createdAt: new Date(Date.now() - 1000) }),
      Game.create({ createdAt: new Date(Date.now() - 500) }),
      Game.create({ createdAt: new Date(Date.now() - 2000) })
    ])

    const { body, status } = await request(app.callback()).get('/games')
    expect(status).toBe(200)
    expect(body.games).toHaveLength(3)
    expect(body.games[0].id).toBe(games[1].id)
    expect(body.games[1].id).toBe(games[0].id)
    expect(body.games[2].id).toBe(games[2].id)

    body.games.forEach((game) => {
      expect(game).toHaveProperty('id')
      expect(game).toHaveProperty('dieSize', 6)
      expect(game).toHaveProperty('startingHP', 20)
      expect(game).toHaveProperty('players', [])
    })
  })
})

describe('POST /games', () => {
  it('creates a game', async () => {
    const { body, status } = await request(app.callback()).post('/games')
    expect(status).toBe(200)
    expect(body.game).toBeDefined()
    expect(body.game).toHaveProperty('id')
    expect(body.game).toHaveProperty('dieSize', 6)
    expect(body.game).toHaveProperty('startingHP', 20)
  })

  it('accepts a dieSize and startingHP', async () => {
    const { body, status } = await request(app.callback()).post('/games').send({ dieSize: 10, startingHP: 100 })
    expect(status).toBe(200)
    expect(body.game).toBeDefined()
    expect(body.game).toHaveProperty('id')
    expect(body.game).toHaveProperty('dieSize', 10)
    expect(body.game).toHaveProperty('startingHP', 100)
  })
})

describe('GET /games/:id', () => {
  let game

  beforeEach(async () => {
    game = await Game.create({})
  })

  it('returns the game', async () => {
    const { body, status } = await request(app.callback()).get(`/games/${game.id}`)
    expect(status).toBe(200)
    expect(body.game).toBeDefined()
    expect(body.game).toHaveProperty('id')
    expect(body.game).toHaveProperty('players')
    expect(body.game).toHaveProperty('turns')
    expect(body.game).toHaveProperty('dieSize', 6)
    expect(body.game).toHaveProperty('startingHP', 20)
  })

  it('returns 404 if the game does not exist', async () => {
    const { body, status } = await request(app.callback()).get(`/games/123`)

    expect(status).toBe(404)
    expect(body.error.message).toBe('Model not found')
  })
})

describe('POST /games/:id/join', () => {
  let game

  beforeEach(async () => {
    game = await Game.create({})
  })

  it('creates a new player assigned to the game, returning its ID', async () => {
    const { body, status } = await request(app.callback()).post(`/games/${game.id}/join`).send({ name: 'John Doe' })

    expect(status).toBe(200)

    expect(body.yourId).toBeDefined()

    const player = await Player.findByPk(body.yourId)
    expect(player).toBeDefined()
    expect(player.name).toBe('John Doe')
    expect(player.hp).toBe(20)
    expect(player.gameId).toBe(game.id)
  })

  it('returns the game with the player', async () => {
    const { status, body } = await request(app.callback()).post(`/games/${game.id}/join`).send({ name: 'John Doe' })

    expect(status).toBe(200)
    expect(body.game).toBeDefined()
    expect(body.game).toHaveProperty('id')
    expect(body.game).toHaveProperty('players')
    expect(body.game.players).toHaveLength(1)
    expect(body.game.players[0]).toHaveProperty('id')
    expect(body.game.players[0]).toHaveProperty('name', 'John Doe')
    expect(body.game.players[0]).toHaveProperty('hp', 20)
    expect(body.game.players[0]).toHaveProperty('gameId', game.id)
  })

  it('can add a second player', async () => {
    await request(app.callback()).post(`/games/${game.id}/join`).send({ name: 'John Doe' })
    const { status, body } = await request(app.callback()).post(`/games/${game.id}/join`).send({ name: 'Jane Doe' })

    expect(status).toBe(200)
    expect(body.game).toBeDefined()
    expect(body.game).toHaveProperty('id')
    expect(body.game).toHaveProperty('players')
    expect(body.game.players).toHaveLength(2)
    expect(body.game.players[0]).toHaveProperty('name', 'John Doe')
    expect(body.game.players[1]).toHaveProperty('name', 'Jane Doe')
  })

  it('errors out when adding a third player', async () => {
    await request(app.callback()).post(`/games/${game.id}/join`).send({ name: 'John Doe' })
    await request(app.callback()).post(`/games/${game.id}/join`).send({ name: 'Jane Doe' })
    const { status, body } = await request(app.callback())
      .post(`/games/${game.id}/join`)
      .set('Accept', 'application/json')
      .send({ name: 'Luise Doe' })

    expect(status).toBe(400)
    expect(body.error.message).toBe('Game is full')
  })

  it('creates a player with the customized HP', async () => {
    game.startingHP = 10
    await game.save()

    const { status, body } = await request(app.callback()).post(`/games/${game.id}/join`).send({ name: 'Luise Doe' })

    expect(status).toBe(200)
    expect(body.game.players[0]).toHaveProperty('hp', 10)
  })
})

describe('POST /games/:id/start', () => {
  let game, players

  beforeEach(async () => {
    game = await Game.create({})
    players = await Promise.all([game.createPlayer({ name: 'John Doe' }), game.createPlayer({ name: 'Jane Doe' })])
  })

  it('starts the game', async () => {
    expect(game.isStarted()).toBe(false)

    const { status, body } = await request(app.callback()).post(`/games/${game.id}/start`)

    expect(status).toBe(200)
    expect(body.game).toHaveProperty('startedAt')

    await game.reload()
    expect(game.isStarted()).toBe(true)
  })

  it('adds a new turn to the game with randomly selected attacker and defender', async () => {
    const { status, body } = await request(app.callback()).post(`/games/${game.id}/start`)

    expect(status).toBe(200)
    expect(body.game).toBeDefined()
    expect(body.game).toHaveProperty('id')
    expect(body.game).toHaveProperty('turns')
    expect(body.game.turns).toHaveLength(1)

    const turn = body.game.turns[0]
    expect(turn).toHaveProperty('attackerId')
    expect(turn).toHaveProperty('defenderId')

    expect([turn.attackerId, turn.defenderId]).toEqual(expect.arrayContaining([players[0].id, players[1].id]))
  })

  it('fails on an already started game', async () => {
    await request(app.callback()).post(`/games/${game.id}/start`)
    const { status, body } = await request(app.callback()).post(`/games/${game.id}/start`)

    expect(status).toBe(400)
    expect(body.error.message).toBe('Game already started')
  })

  it('fails on a game with less than 2 players', async () => {
    await players[0].destroy()

    const { status, body } = await request(app.callback()).post(`/games/${game.id}/start`)

    expect(status).toBe(400)
    expect(body.error.message).toBe('Not enough players')
  })
})

describe('POST /games/:id/roll', () => {
  let game, players

  beforeEach(async () => {
    game = await Game.create({ startedAt: new Date() })
    players = await Promise.all([game.createPlayer({ name: 'John Doe' }), game.createPlayer({ name: 'Jane Doe' })])
    await game.createTurn({ attackerId: players[0].id, defenderId: players[1].id })
  })

  it('rolls a die for the player', async () => {
    const { status, body } = await request(app.callback())
      .post(`/games/${game.id}/roll`)
      .send({ playerId: players[0].id })

    expect(status).toBe(200)
    expect(body.roll).toBeDefined()
    expect(body.roll).toBeGreaterThan(0)
    expect(body.roll).toBeLessThan(7)
  })

  it('saves the roll in the turn for the right player', async () => {
    let { status, body } = await request(app.callback())
      .post(`/games/${game.id}/roll`)
      .send({ playerId: players[0].id })

    const rolled = body.roll

    expect(status).toBe(200)
    expect(body.game.turns[0]).toHaveProperty('attackRoll', rolled)
    expect(body.game.turns[0]).toHaveProperty('defenseRoll', null)
    ;({ status, body } = await request(app.callback()).post(`/games/${game.id}/roll`).send({ playerId: players[1].id }))

    expect(status).toBe(200)
    expect(body.game.turns[0]).toHaveProperty('attackRoll', rolled)
    expect(body.game.turns[0]).toHaveProperty('defenseRoll', body.roll)
  })

  it('accepts rolls from the defender first', async () => {
    const { status, body } = await request(app.callback())
      .post(`/games/${game.id}/roll`)
      .send({ playerId: players[1].id })

    expect(status).toBe(200)
    expect(body.game.turns[0]).toHaveProperty('attackRoll', null)
    expect(body.game.turns[0]).toHaveProperty('defenseRoll', body.roll)
  })

  it('rolls within the specified die size for the game', async () => {
    game.dieSize = 2
    await game.save()

    let { status, body } = await request(app.callback())
      .post(`/games/${game.id}/roll`)
      .send({ playerId: players[0].id })

    expect(status).toBe(200)
    expect(body.roll).toBeGreaterThan(0)
    expect(body.roll).toBeLessThan(3)
    ;({ status, body } = await request(app.callback()).post(`/games/${game.id}/roll`).send({ playerId: players[1].id }))

    expect(status).toBe(200)
    expect(body.roll).toBeGreaterThan(0)
    expect(body.roll).toBeLessThan(3)
  })

  it('fails if the player is not part of the turn', async () => {
    const { status, body } = await request(app.callback()).post(`/games/${game.id}/roll`).send({ playerId: uuidv4() })

    expect(status).toBe(400)
    expect(body.error.message).toBe("You're not part of this game")
  })

  it('fails if the player has already played this turn', async () => {
    await request(app.callback()).post(`/games/${game.id}/roll`).send({ playerId: players[0].id })
    const { status, body } = await request(app.callback())
      .post(`/games/${game.id}/roll`)
      .send({ playerId: players[0].id })

    expect(status).toBe(400)
    expect(body.error.message).toBe("You've already played this turn")
  })

  describe('when both players have rolled', () => {
    let body

    beforeEach(async () => {
      await request(app.callback()).post(`/games/${game.id}/roll`).send({ playerId: players[0].id })
      ;({ body } = await request(app.callback()).post(`/games/${game.id}/roll`).send({ playerId: players[1].id }))
    })

    it('adds a new turn to the game with swapped roles', async () => {
      expect(body.game.turns).toHaveLength(2)
      expect(body.game.turns[1]).toHaveProperty('attackerId', players[1].id)
      expect(body.game.turns[1]).toHaveProperty('defenderId', players[0].id)
    })

    it('applies damage to the defender if the attack roll is higher', async () => {
      const turn = first(body.game.turns)

      /* eslint-disable jest/no-conditional-expect */
      if (turn.attackRoll > turn.defenseRoll) {
        expect(body.game.players[1].hp).toBe(players[1].hp - (turn.attackRoll - turn.defenseRoll))
      } else {
        expect(body.game.players[1].hp).toBe(players[1].hp)
      }
      /* eslint-enable jest/no-conditional-expect */
    })
  })

  describe('when the defender dies', () => {
    let body

    beforeEach(async () => {
      players[0].hp = 1
      players[1].hp = 1
      await Promise.all([players[0].save(), players[1].save()])

      while (
        await Promise.all([players[0].reload(), players[1].reload()]).then((ps) => every(ps, (p) => p.isAlive()))
      ) {
        await request(app.callback()).post(`/games/${game.id}/roll`).send({ playerId: players[0].id })
        ;({ body } = await request(app.callback()).post(`/games/${game.id}/roll`).send({ playerId: players[1].id }))
      }
    })

    it('finishes the game', async () => {
      await game.reload()

      expect(map(players, 'id')).toContain(game.winnerId)

      const winner = find(players, ['id', game.winnerId])
      expect(winner.hp).toBe(1)

      const loser = find(players, (p) => p.id !== game.winnerId)
      expect(loser.hp).toBeLessThanOrEqual(0)

      expect(body.game.winnerId).toBe(winner.id)
    })
  })
})
