import { beforeAll, afterEach, afterAll, beforeEach } from 'vitest'
import { server, resetMockTodos } from './mocks'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'bypass' })
})

beforeEach(() => {
  resetMockTodos()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
