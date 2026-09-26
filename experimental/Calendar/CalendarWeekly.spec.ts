/**
 * @vitest-environment jsdom
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick } from 'vue'
import CalendarWeekly from './CalendarWeekly.vue'
import {
  CALENDAR_ACTIONS_KEY,
  CALENDAR_CONFIG_KEY,
  type CalendarActions,
  type CalendarConfig,
} from './types'

const week = [3, 4, 5, 6, 7, 8, 9].map((d) => new Date(2026, 7, d)) // Mon 3 Aug – Sun 9 Aug

const config = {
  scrollToHour: 9,
  disableModes: [],
  defaultMode: 'Week',
  isEditMode: true,
  eventIcons: {},
  hourHeight: 50,
  enableShortcuts: false,
  showIcon: false,
  timeFormat: '12h',
  weekends: [],
} as unknown as CalendarConfig

async function mountWeek() {
  const handleCellClick = vi.fn()
  const actions = { handleCellClick } as unknown as CalendarActions
  const host = document.createElement('div')
  document.body.appendChild(host)
  const app = createApp({
    render: () => h(CalendarWeekly, { events: [], config, weeklyDates: week }),
  })
  app.provide(CALENDAR_ACTIONS_KEY, actions)
  app.provide(CALENDAR_CONFIG_KEY, config)
  app.mount(host)
  await nextTick()
  return { app, host, handleCellClick }
}

describe('CalendarWeekly grid cells', () => {
  beforeEach(() => {
    // jsdom has no layout, and the grid scrolls to its first hour on mount.
    Element.prototype.scrollBy = vi.fn()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  /*
   * A click anywhere on the grid starts an event, so a pointer on every empty
   * cell tells the user nothing, and the Day and Month views never set one.
   * The cells keep the cursor they inherit; what is a control keeps its own.
   */
  it('draws the empty all-day and hour cells with the default cursor', async () => {
    const { app, host } = await mountWeek()
    const cells = Array.from(host.querySelectorAll('.cell'))

    expect(cells.length).toBeGreaterThan(week.length)
    for (const cell of cells) {
      expect(cell.classList.contains('cursor-pointer')).toBe(false)
    }
    app.unmount()
  })

  it('still starts an event from a click on an empty cell', async () => {
    const { app, host, handleCellClick } = await mountWeek()
    ;(host.querySelector('[data-time-grid] .cell') as HTMLElement).click()

    expect(handleCellClick).toHaveBeenCalledTimes(1)
    app.unmount()
  })
})
