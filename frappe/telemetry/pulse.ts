import { call } from 'frappe-ui'

type PulseEvent = {
  captured_at: string
  event_name: string
  app: string
  user?: string
  properties?: Record<string, any>
}

export class PulseProvider {
  private enabled: boolean
  private eq: QueueManager | null
  private beforeUnloadAttached: boolean

  constructor() {
    this.enabled = false
    this.eq = null
    this.beforeUnloadAttached = false
  }

  setEnabled(isEnabled: boolean) {
    this.enabled = isEnabled
    if (!this.enabled) {
      this.eq?.stop()
      this.eq = null
    }
  }

  init() {
    if (!this.enabled) return
    if (this.eq) return

    try {
      this.eq = new QueueManager((events) => this.sendEvents(events), {
        flushInterval: 10000,
      })

      if (!this.beforeUnloadAttached) {
        this.beforeUnloadAttached = true

        // Send remaining events on unload
        window.addEventListener('beforeunload', () => {
          const events = this.eq?.getBufferedEvents?.() || []
          if (events.length) this.sendBeacon(events)
        })
      }
    } catch (error: any) {
      // ignore errors
    }
  }

  capture(event: string, app: string, props?: Record<string, any>) {
    if (!this.enabled || !this.eq) return

    const user = (window as any)?.frappe?.session?.user

    this.eq.add({
      event_name: event,
      app: app,
      properties: props,
      user,
      captured_at: new Date().toISOString(),
    })
  }

  private async sendEvents(events: PulseEvent[]): Promise<void> {
    return call('frappe.utils.telemetry.pulse.client.bulk_capture', { events })
  }

  private sendBeacon(events: PulseEvent[]) {
    try {
      if (navigator.sendBeacon) {
        const url =
          '/api/method/frappe.utils.telemetry.pulse.client.bulk_capture'
        const data = new FormData()
        data.append('events', JSON.stringify(events))
        navigator.sendBeacon(url, data)
      }
    } catch (error: any) {
      // ignore errors
    }
  }

  stop() {
    this.eq?.stop()
    this.eq = null
  }
}

type QueueManagerOptions = {
  maxQueueSize?: number
  flushInterval?: number
}

class QueueManager {
  private flushCallback: (events: PulseEvent[]) => Promise<void>
  private queue: PulseEvent[]
  private pendingBatch: PulseEvent[] | null
  private retryAttempts: number
  private maxRetries: number
  private maxQueueSize: number
  private flushInterval: number
  private timer: ReturnType<typeof setInterval> | null
  private flushing: boolean

  constructor(
    flushCallback: (events: PulseEvent[]) => Promise<void>,
    options: QueueManagerOptions = {},
  ) {
    this.flushCallback = flushCallback
    this.queue = []
    this.pendingBatch = null
    this.retryAttempts = 0
    this.maxRetries = 3
    this.maxQueueSize = options.maxQueueSize || 20
    this.flushInterval = options.flushInterval || 5000
    this.timer = null
    this.flushing = false

    this.start()
  }

  getBufferedEvents() {
    const events: PulseEvent[] = []
    if (this.pendingBatch?.length) events.push(...this.pendingBatch)
    if (this.queue.length) events.push(...this.queue)
    return events
  }

  private start() {
    this.timer = setInterval(() => {
      if (this.queue.length || this.pendingBatch) this.flush()
    }, this.flushInterval)
  }

  add(event: PulseEvent) {
    this.queue.push(event)

    if (this.queue.length >= this.maxQueueSize) {
      this.flush()
    }
  }

  async flush() {
    if (this.flushing) return
    this.flushing = true

    try {
      if (!this.pendingBatch) {
        if (!this.queue.length) return
        this.pendingBatch = this.queue.splice(0, this.maxQueueSize)
        this.retryAttempts = 0
      }

      try {
        await this.flushCallback(this.pendingBatch)
        this.pendingBatch = null
        this.retryAttempts = 0
      } catch (error: any) {
        this.retryAttempts++
        if (this.retryAttempts > this.maxRetries) {
          this.pendingBatch = null
          this.retryAttempts = 0
        }
      }
    } finally {
      this.flushing = false
    }
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    void this.flush()
  }
}

export const pulse_provider = new PulseProvider()
