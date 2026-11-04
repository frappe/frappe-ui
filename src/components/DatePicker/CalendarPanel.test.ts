/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import DateCalendar from './DateCalendar.vue'

describe('Calendar date labels', () => {
  it('labels each date as a spoken date, not the ISO key', () => {
    const host = document.createElement('div')
    const app = createApp(DateCalendar, { modelValue: '2026-02-03' })
    app.mount(host)
    const cell = host.querySelector('[data-value="2026-02-03"]')
    expect(cell?.getAttribute('aria-label')).toBe('Tuesday, 3 February 2026')
    app.unmount()
  })
})
