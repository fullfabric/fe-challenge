const request = require('supertest')
const app = require('../..')

describe('GET /openapi.yaml', () => {
  it('returns the openapi.yaml file', async () => {
    const { status, text } = await request(app.callback())
      .get('/openapi.yaml')
      .expect('Content-Type', /text\/yaml/)

    expect(status).toBe(200)
    expect(text).toContain('openapi: 3.0.0')
  })
})

describe('GET /docs', () => {
  it('returns the docs', async () => {
    const { status, text } = await request(app.callback())
      .get('/docs')
      .expect('Content-Type', /text\/html/)

    expect(status).toBe(200)
    expect(text).toContain('<!DOCTYPE html>')
  })
})
