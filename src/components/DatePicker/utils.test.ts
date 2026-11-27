import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import de from 'dayjs/esm/locale/de'
import { dayjs } from '../../utils/dayjs'
import { generateWeeks } from './utils'

describe('generateWeeks with a Monday-first Day.js locale', () => {
  let previousLocale: string

  beforeEach(() => {
    previousLocale = dayjs.locale()
    dayjs.locale(de)
  })

  afterEach(() => {
    dayjs.locale(previousLocale)
  })

  it('starts on Sunday by default', () => {
    expect(generateWeeks(2025, 5, '')[0][0].key).toBe('2025-06-01')
  })

  it('starts on the configured weekday', () => {
    expect(generateWeeks(2025, 5, '', 'saturday')[0][0].key).toBe('2025-05-31')
  })
})
