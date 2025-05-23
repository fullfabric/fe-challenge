const request = require('supertest')
const app = require('../..')

describe('GET /openapi.yaml', () => {
  it('returns the openapi.yaml file', async () => {
    const { status, body } = await request(app.callback()).get('/openapi.yaml')

    expect(status).toBe(200)
    expect(body).toBeDefined()
  })
})
