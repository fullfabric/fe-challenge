import '@testing-library/jest-dom'

const { server } = require('../fe/mocks/api')

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
