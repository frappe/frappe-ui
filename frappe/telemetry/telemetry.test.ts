/**
 * @vitest-environment jsdom
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PulseProvider } from './pulse'

vi.mock('frappe-ui', () => ({
  call: vi.fn().mockResolvedValue({}),
}))

describe('PulseProvider', () => {
  let provider: PulseProvider

  beforeEach(() => {
    provider = new PulseProvider()
  })

  it('is disabled by default', () => {
    const result = provider.capture('test', 'app')
    expect(result).toBeUndefined()
  })

  it('captures events after being enabled and initialized', () => {
    provider.setEnabled(true)
    provider.init()

    // Should not throw
    expect(() => {
      provider.capture('user_login', 'test_app', { user: 'test@example.com' })
    }).not.toThrow()
  })

  it('stops capturing events when disabled', () => {
    provider.setEnabled(true)
    provider.init()
    provider.capture('event1', 'app')

    provider.setEnabled(false)

    // Should not throw
    expect(() => {
      provider.capture('event2', 'app')
    }).not.toThrow()
  })

  it('sends events to correct API endpoint', async () => {
    const { call } = await import('frappe-ui')
    const mockCall = call as any

    provider.setEnabled(true)
    provider.init()

    const testEvents = [
      {
        event_name: 'test_event',
        app: 'test_app',
        captured_at: new Date().toISOString(),
      },
    ]

    await provider['sendEvents'](testEvents)

    expect(mockCall).toHaveBeenCalledWith(
      'frappe.utils.telemetry.pulse.client.bulk_capture',
      { events: testEvents },
    )
  })

  it('batches events before sending', () => {
    vi.useFakeTimers()

    provider.setEnabled(true)
    provider.init()

    // Capture multiple events
    for (let i = 0; i < 5; i++) {
      provider.capture('event', 'app', { count: i })
    }

    // Events should be queued, not sent immediately
    const buffered = provider['eq']?.getBufferedEvents()
    expect(buffered?.length).toBeGreaterThan(0)

    vi.useRealTimers()
  })
})
