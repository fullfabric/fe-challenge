import { http, HttpResponse } from 'msw'

const handlers = [
  http.get('/api/games', () => {
    return HttpResponse.json({
      games: [
        {
          id: '15d42a4d-1948-4de4-ba78-b8a893feaf45',
          dieSize: 6,
          startingHP: 10,
          createdAt: '2025-01-01T00:00:00.000Z',
          players: []
        }
      ]
    })
  }),
  http.get('/api/games/:gameId', ({ params }) => {
    return HttpResponse.json({
      game: {
        id: params.gameId,
        dieSize: 6,
        startingHP: 10,
        createdAt: '2025-01-01T00:00:00.000Z',
        players: []
      }
    })
  }),
  http.post('/api/games/:gameId/join', ({ params }) => {
    return HttpResponse.json({
      game: {
        id: params.gameId,
        dieSize: 6,
        startingHP: 10,
        createdAt: '2025-01-01T00:00:00.000Z',
        players: [
          {
            id: 'aed2e347-bb72-4c3d-b938-a31c62e0bd64',
            name: 'John Doe',
            hp: 10
          }
        ]
      }
    })
  }),
  http.post('/api/games/:gameId/start', ({ params }) => {
    return HttpResponse.json({
      game: {
        id: params.gameId,
        dieSize: 6,
        startingHP: 10,
        createdAt: '2025-01-01T00:00:00.000Z',
        startedAt: new Date().toISOString(),
        players: [
          {
            id: 'aed2e347-bb72-4c3d-b938-a31c62e0bd64',
            name: 'John Doe',
            hp: 10
          },
          {
            id: 'e2837989-2e76-4156-8d06-fba52ea6f29d',
            name: 'Jane Doe',
            hp: 10
          }
        ]
      }
    })
  })
]

export default handlers
