/**
 * @vitest-environment node
 */

import { createResource } from './resources'
import { url } from '../mocks/utils'

describe('createResource abort', () => {
  it('aborts an in-flight request without surfacing an error', async () => {
    const resource = createResource({
      url: url('/api/v2/method/slow'),
      auto: false,
    })

    const promise = resource.fetch()
    expect(resource.loading).toBe(true)

    resource.abort()
    await promise

    expect(resource.loading).toBe(false)
    expect(resource.data).toBe(null)
    // a deliberate abort is not a resource error
    expect(resource.error).toBe(null)
  })

  it('stays usable after an abort (controller is recreated per fetch)', async () => {
    const resource = createResource({
      url: url('/api/v2/method/slow'),
      auto: false,
    })

    // first fetch is aborted mid-flight
    const aborted = resource.fetch()
    resource.abort()
    await aborted
    expect(resource.data).toBe(null)

    // a fresh fetch must succeed — the old single-controller version would
    // reuse the already-aborted signal and reject immediately
    await resource.fetch()
    expect(resource.data).toEqual({ data: { success: true } })
    expect(resource.error).toBe(null)
  })
})
