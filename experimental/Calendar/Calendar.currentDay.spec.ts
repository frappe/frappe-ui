/**
 * @vitest-environment jsdom
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, ref, type App } from 'vue'
import Calendar from './Calendar.vue'

type Exposed = {
  currentDay: number | null
  currentMonth: number
  setCalendarDate: (d?: Date | string) => void
}

let app: App | null = null

async function mountCalendar() {
  const calendar = ref<Exposed | null>(null)
  const host = document.createElement('div')
  document.body.appendChild(host)
  app = createApp({
    render: () =>
      h(Calendar, { ref: calendar, config: { enableShortcuts: false } }),
  })
  app.mount(host)
  await nextTick()
  return calendar
}

describe('Calendar currentDay', () => {
  beforeEach(() => {
    // 26 October 2026 and 30 November 2026 sit in the same cell of their month
    // grids (index 29): October starts on a Thursday, November on a Sunday.
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 9, 26, 10))
    Element.prototype.scrollBy = vi.fn()
    Element.prototype.scrollTo = vi.fn()
  })

  afterEach(() => {
    app?.unmount()
    app = null
    vi.useRealTimers()
  })

  it('names the day it shows after a jump to a date in the same cell of another month', async () => {
    const calendar = await mountCalendar()
    expect(calendar.value?.currentDay).toBe(26)

    calendar.value?.setCalendarDate(new Date(2026, 10, 30))
    await nextTick()
    await nextTick()

    expect(calendar.value?.currentMonth).toBe(10)
    expect(calendar.value?.currentDay).toBe(30)
  })
})
