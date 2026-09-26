import { onMounted, type Ref } from 'vue'
import { twelveHoursFormat, twentyFourHoursFormat } from '../calendarUtils'
import type { CalendarConfig } from '../types'

/**
 * What the Day and Week views share about their hours: the row labels in the
 * format the grid is read in, the row's height, the time a click on a row asks
 * for, and the scroll to the hour the grid opens on.
 */
export function useHourGrid(
  config: CalendarConfig,
  grid: Ref<HTMLElement | null>,
) {
  const hourHeight = config.hourHeight
  const minuteHeight = hourHeight / 60
  const timeArray =
    config.timeFormat == '24h' ? twentyFourHoursFormat : twelveHoursFormat

  /**
   * The time a click asks for: the mark it landed nearest, less the half hour
   * that puts that mark in the middle of the event rather than at its start.
   *
   * The row it was in is an hour tall and carries three marks — its own line,
   * the half hour, and the line below it — so where in the row the click fell
   * is the finer thing it already knows and the row label alone throws away.
   * The top and bottom quarters go to the lines that bound the row and the
   * middle half to the half hour, which is the widest target of the three
   * because it is the one with no line to aim at.
   *
   * Centred, not started, because a click is a point and an event is an hour:
   * the point is where the reader is looking, and an hour hung below it puts
   * the thing they were pointing at at its very top edge. So a click on the 7
   * line asks for 6:30, which draws an event through the 7 it was aimed at;
   * the middle of the row asks for 7, which is the row itself; and the 8 line
   * asks for 7:30.
   *
   * Half hours, not quarters: a quarter of a 72px row is an 18px target, under
   * what a thumb can be asked to hit.
   *
   * A whole hour hands back the row's own label, unchanged, so what a consumer
   * parses is what it always parsed. A half hour is spelled out in the format
   * the grid is read in: "7:30 am" beside "7 am", "07:30" beside "07:00".
   */
  const LAST_START = 23 * 60 + 30

  function slotTime(e: MouseEvent, hour: number): string {
    const row = e.currentTarget as HTMLElement | null
    const fraction = row
      ? (e.clientY - row.getBoundingClientRect().top) / hourHeight
      : 0
    const minutes = fraction < 0.25 ? 0 : fraction < 0.75 ? 30 : 60

    // Both ends are the day's own: midnight has nothing above it to centre on,
    // and the last row's line below it belongs to the day after — the date came
    // with the cell, so neither can be reached from here.
    const start = Math.min(Math.max(hour * 60 + minutes - 30, 0), LAST_START)
    const startHour = Math.floor(start / 60)
    if (start % 60 === 0) return timeArray[startHour]!

    if (config.timeFormat === '24h')
      return `${String(startHour).padStart(2, '0')}:30`
    return `${((startHour + 11) % 12) + 1}:30 ${startHour < 12 ? 'am' : 'pm'}`
  }

  onMounted(() => {
    const scrollToHour = config.scrollToHour || new Date().getHours()
    grid.value?.scrollBy(0, scrollToHour * 60 * minuteHeight - 10)
  })

  return { hourHeight, minuteHeight, timeArray, slotTime }
}
