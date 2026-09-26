/**
 * The calendars a Frappe app lays over one another, and the week of events
 * that fills them — shared by every pattern on this page so they all show the
 * same week, the way the design draws it (node 35231:65071).
 *
 * Each calendar carries the colour its events take and whether it is showing;
 * the patterns filter `events` by the ones that are on, which is how the list
 * on the left turns them off.
 */
import type { CalendarEvent } from '../../experimental/Calendar'

export type CalendarSource = {
  id: string
  label: string
  /** A key in the Calendar's own colour map. */
  color: string
  visible: boolean
}

export const sources: CalendarSource[] = [
  { id: 'leads', label: 'My leads', color: 'amber', visible: true },
  { id: 'deals', label: 'My Deals flow', color: 'violet', visible: true },
  { id: 'qualified', label: 'Qualified Deals', color: 'green', visible: true },
]

/** The Wednesday the design centres on, resolved against the running week. */
const monday = (() => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return d
})()

function at(dayOffset: number, hours: number, minutes = 0) {
  const d = new Date(monday)
  d.setDate(d.getDate() + dayOffset)
  d.setHours(hours, minutes, 0, 0)
  return d
}

// The Calendar takes the day and the clock separately: `fromDate`/`toDate`
// as `YYYY-MM-DD`, `fromTime`/`toTime` as `HH:MM`.
const pad = (n: number) => String(n).padStart(2, '0')
const day = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const clock = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`

type Seed = {
  id: string
  title: string
  source: string
  day: number
  from: [number, number]
  to: [number, number]
}

// The week the design draws, including the two that overlap on Wednesday.
const seeds: Seed[] = [
  { id: '1', title: 'Product design', source: 'leads', day: 0, from: [10, 0], to: [12, 0] },
  { id: '2', title: 'Frappe discussion', source: 'deals', day: 2, from: [10, 30], to: [11, 0] },
  { id: '3', title: 'Interview', source: 'deals', day: 2, from: [11, 0], to: [12, 0] },
  { id: '4', title: 'Weekly review', source: 'qualified', day: 4, from: [10, 30], to: [11, 30] },
  { id: '5', title: 'Interview', source: 'leads', day: 3, from: [12, 0], to: [13, 0] },
  { id: '6', title: 'DS Meeting', source: 'deals', day: 2, from: [13, 0], to: [14, 0] },
  { id: '7', title: 'Product update', source: 'qualified', day: 4, from: [13, 0], to: [14, 0] },
  { id: '8', title: 'Interview', source: 'leads', day: 1, from: [14, 0], to: [15, 0] },
  { id: '9', title: 'Birthday', source: 'leads', day: 1, from: [15, 0], to: [16, 0] },
  { id: '10', title: 'Weekly standup', source: 'qualified', day: 4, from: [15, 30], to: [17, 0] },
  { id: '11', title: 'Take a walk', source: 'deals', day: 0, from: [18, 0], to: [19, 0] },
  { id: '12', title: 'CRM discussion', source: 'leads', day: 3, from: [18, 0], to: [19, 0] },
]

export function eventsFor(visible: CalendarSource[]): CalendarEvent[] {
  const on = new Set(visible.filter((s) => s.visible).map((s) => s.id))
  const colorOf = Object.fromEntries(sources.map((s) => [s.id, s.color]))
  return seeds
    .filter((s) => on.has(s.source))
    .map((s) => {
      const from = at(s.day, s.from[0], s.from[1])
      const to = at(s.day, s.to[0], s.to[1])
      return {
        id: s.id,
        title: s.title,
        fromDate: day(from),
        toDate: day(to),
        fromTime: clock(from),
        toTime: clock(to),
        color: colorOf[s.source],
      }
    }) as CalendarEvent[]
}
