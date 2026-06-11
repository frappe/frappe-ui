import { server } from './src/mocks/node'
import { beforeAll, afterEach, afterAll } from 'vitest'

// jsdom doesn't implement elementFromPoint; prosemirror-view ≥1.41 calls it
// (posAtCoords) during cursor handling, crashing editor mounts in tests
if (typeof document !== 'undefined' && !document.elementFromPoint) {
  document.elementFromPoint = () => null
}

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
