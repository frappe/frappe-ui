import { server } from './mocks'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { watch } from 'vue'

beforeAll(() => {
  // Bypass unhandled requests to suppress MSW warnings while still intercepting our test routes
  server.listen({ onUnhandledRequest: 'bypass' })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

export function waitFor(
  condition: () => boolean,
  options: { timeout?: number; interval?: number } = {},
): Promise<void> {
  const { timeout = 2000, interval = 10 } = options
  const startTime = Date.now()

  return new Promise((resolve, reject) => {
    const check = () => {
      if (condition()) {
        resolve()
        return
      }

      if (Date.now() - startTime >= timeout) {
        reject(new Error(`Timeout waiting for condition after ${timeout}ms`))
        return
      }

      setTimeout(check, interval)
    }

    check()
  })
}

export async function waitForLoading(loadingGetter: () => boolean) {
  await waitFor(() => loadingGetter() === true)
  await waitFor(() => loadingGetter() === false)
}
