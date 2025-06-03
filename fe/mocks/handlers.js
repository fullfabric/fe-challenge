import { http, HttpResponse } from 'msw'

const handlers = [
  http.get('/api/games', () => {
    return HttpResponse.json({
      games: [
        {
          id: '15d42a4d-1948-4de4-ba78-b8a893feaf45',
          dieSize: 6,
          startingHP: 10,
          createdAt: '2025-01-01T00:00:00.000Z'
        }
      ]
    })
  })
]

export default handlers
