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

/**
 * The six the file draws (node 35406:63902).
 *
 * Four of them the component knows by name — its `colorMap` holds amber,
 * violet, pink, cyan, blue, orange and green, and turns each into the
 * `surface-{c}-1` fill and `ink-{c}-6` ink the file uses. **Gray and red are
 * not in it**, and an unknown name falls through to green without a word, so
 * those two are handed over as raw ink values instead: `useEventBase` derives
 * a palette from any value it is given.
 *
 * What that derivation cannot give is the exact fill — it mixes the ink 10%
 * into the ground, where the file uses `surface-gray-1` and `surface-red-1`.
 * Adding the two to `colorMap` is the library's job.
 */
const DERIVED = new Set(['gray', 'red'])

/** `--ink-{c}-6` as a hex, read off the page so it follows the theme. */
function inkHex(name: string) {
  if (typeof document === 'undefined') return '#525252'
  const probe = document.createElement('span')
  probe.style.color = `var(--ink-${name}-6)`
  document.body.appendChild(probe)
  const rgb = getComputedStyle(probe).color
  probe.remove()
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext('2d')
  if (!ctx) return '#525252'
  ctx.fillStyle = rgb
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return (
    '#' +
    [r, g, b].map((v) => (v ?? 0).toString(16).padStart(2, '0')).join('')
  )
}

export const colourValue = (name: string) =>
  DERIVED.has(name) ? inkHex(name) : name

export const sources: CalendarSource[] = [
  { id: 'leads', label: 'My leads', color: 'amber', visible: true },
  { id: 'deals', label: 'My Deals flow', color: 'violet', visible: true },
  { id: 'qualified', label: 'Qualified Deals', color: 'green', visible: true },
  // …and the three the file's palette has that the design's own week never
  // used. A quarter of work is not three colours: a personal calendar laid
  // over a work one is what a week actually looks like, days off are the one
  // thing on a calendar that is read at a glance, and a task is not an
  // appointment.
  { id: 'personal', label: 'Personal', color: 'blue', visible: true },
  { id: 'away', label: 'Out of office', color: 'red', visible: true },
  { id: 'work', label: 'My tasks', color: 'gray', visible: true },
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
  // Wednesday carries five, which is two more than a month cell can hold —
  // so the Month view has a day to draw "3 more" on.
  { id: '13', title: 'Design review', source: 'qualified', day: 2, from: [15, 0], to: [16, 0] },
  { id: '14', title: 'Train to Chennai', source: 'leads', day: 2, from: [17, 30], to: [18, 30] },
]

/**
 * The quarter around the week the file draws.
 *
 * The Agenda view covers three months, and the Month view a whole one, so a
 * single week of events left both of them mostly empty — and an empty view
 * cannot be read for whether it is right. What follows fills the same span
 * the Agenda asks for: the month under way and the two after it.
 *
 * Two kinds. The standing ones are a week's shape — a standup on Monday, a
 * critique on Wednesday, a wrap on Friday — laid down across every week in
 * the span. The rest are what a quarter actually holds: a conference, a
 * fortnight of customer visits, someone's leave, a birthday, the tasks that
 * fall due at a month's end.
 *
 * The week the file draws keeps exactly what the file draws. The standing
 * ones step around it, so that one week still reads against node
 * 35231:65071 rather than against this.
 */
type Standing = {
  title: string
  source: string
  /** 1 Monday … 5 Friday. */
  weekday: number
  from: [number, number]
  to: [number, number]
  type?: string
}

const standing: Standing[] = [
  { title: 'Standup', source: 'qualified', weekday: 1, from: [9, 30], to: [9, 45] },
  { title: 'Pipeline review', source: 'deals', weekday: 1, from: [15, 0], to: [16, 0] },
  { title: '1:1 — Priya', source: 'leads', weekday: 2, from: [11, 0], to: [11, 30] },
  { title: 'Design critique', source: 'deals', weekday: 3, from: [10, 0], to: [11, 0] },
  { title: 'Standup', source: 'qualified', weekday: 4, from: [9, 30], to: [9, 45] },
  { title: 'Week in review', source: 'qualified', weekday: 5, from: [16, 0], to: [17, 0] },
]

type Dated = {
  title: string
  source: string
  /** 0 this month, 1 the next, 2 the one after. */
  month: number
  date: number
  from?: [number, number]
  to?: [number, number]
  /** Days it runs, counting the first. */
  days?: number
  allDay?: boolean
  type?: string
}

const dated: Dated[] = [
  // ── The month under way ────────────────────────────────────────────────
  { title: 'Dropbox — discovery call', source: 'leads', month: 0, date: 2, from: [14, 0], to: [15, 0] },
  { title: 'Onboarding — Northwind', source: 'qualified', month: 0, date: 3, from: [11, 0], to: [12, 30] },
  { title: 'Interview — backend', source: 'leads', month: 0, date: 9, from: [16, 0], to: [17, 0] },
  { title: 'Priya on leave', source: 'away', month: 0, date: 14, days: 3, allDay: true },
  { title: 'Quarterly forecast', source: 'deals', month: 0, date: 17, from: [13, 0], to: [14, 30] },
  { title: 'Renewal — Contoso', source: 'qualified', month: 0, date: 21, from: [10, 0], to: [11, 0] },
  { title: 'Send the forecast', source: 'work', month: 0, date: 22, from: [9, 0], to: [9, 30], type: 'task' },
  { title: 'Team dinner', source: 'personal', month: 0, date: 25, from: [19, 0], to: [21, 0] },

  // ── The month after ───────────────────────────────────────────────────
  { title: 'Lunch with Anil', source: 'personal', month: 1, date: 1, from: [12, 30], to: [13, 30] },
  { title: 'Frappe Conference, Mumbai', source: 'deals', month: 1, date: 5, days: 3, allDay: true },
  { title: 'Roadmap — Q4', source: 'deals', month: 1, date: 12, from: [14, 0], to: [16, 0] },
  { title: 'Interview — designer', source: 'leads', month: 1, date: 14, from: [15, 0], to: [16, 0] },
  { title: 'Raise the invoices', source: 'work', month: 1, date: 15, from: [10, 0], to: [10, 30], type: 'task' },
  { title: "Shreya's birthday", source: 'personal', month: 1, date: 19, allDay: true },
  { title: 'Customer visits — Bengaluru', source: 'leads', month: 1, date: 20, days: 4, allDay: true },
  { title: 'Board pack due', source: 'work', month: 1, date: 26, from: [17, 0], to: [18, 0], type: 'task' },
  { title: 'Month-end close', source: 'work', month: 1, date: 30, from: [16, 0], to: [17, 30], type: 'task' },

  // ── And the one after that ────────────────────────────────────────────
  { title: 'Q4 kickoff', source: 'deals', month: 2, date: 2, from: [10, 0], to: [11, 30] },
  { title: 'Dropbox — renewal', source: 'qualified', month: 2, date: 5, from: [11, 0], to: [12, 0] },
  { title: 'Diwali', source: 'away', month: 2, date: 8, allDay: true },
  { title: 'Offsite — Goa', source: 'deals', month: 2, date: 9, days: 5, allDay: true },
  { title: 'Performance reviews', source: 'work', month: 2, date: 16, from: [14, 0], to: [17, 0], type: 'task' },
  { title: 'Interview — product', source: 'leads', month: 2, date: 18, from: [11, 0], to: [12, 0] },
  { title: 'Webinar — CRM for teams', source: 'qualified', month: 2, date: 20, from: [16, 0], to: [17, 0] },
  { title: 'Customer advisory board', source: 'qualified', month: 2, date: 24, from: [14, 0], to: [16, 0] },
  { title: 'Anil out', source: 'away', month: 2, date: 26, days: 2, allDay: true },
  { title: 'Month-end close', source: 'work', month: 2, date: 30, from: [16, 0], to: [17, 30], type: 'task' },
]

/** The first of the month under way, which the three-month span starts at. */
const monthStart = (() => {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1)
})()

const shift = (d: Date, days: number) => {
  const next = new Date(d)
  next.setDate(next.getDate() + days)
  return next
}

/** Whether a day falls in the week the file draws, which is left alone. */
const inDrawnWeek = (d: Date) => {
  const from = day(monday)
  const to = day(shift(monday, 6))
  const on = day(d)
  return on >= from && on <= to
}

function standingEvents(): CalendarEvent[] {
  const out: CalendarEvent[] = []
  const end = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth() + 3,
    0,
  )
  let n = 0
  for (let d = new Date(monthStart); d <= end; d = shift(d, 1)) {
    if (inDrawnWeek(d)) continue
    for (const s of standing) {
      if (d.getDay() !== s.weekday) continue
      const from = new Date(d)
      from.setHours(s.from[0], s.from[1], 0, 0)
      const to = new Date(d)
      to.setHours(s.to[0], s.to[1], 0, 0)
      out.push({
        id: `w${(n += 1)}`,
        title: s.title,
        source: s.source,
        fromDate: day(from),
        toDate: day(to),
        fromTime: clock(from),
        toTime: clock(to),
      } as CalendarEvent & { source: string })
    }
  }
  return out
}

function datedEvents(): CalendarEvent[] {
  return dated.map((e, i) => {
    const first = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth() + e.month,
      e.date,
    )
    const last = shift(first, (e.days ?? 1) - 1)
    const from = new Date(first)
    from.setHours(e.from?.[0] ?? 9, e.from?.[1] ?? 0, 0, 0)
    const to = new Date(last)
    to.setHours(e.to?.[0] ?? 10, e.to?.[1] ?? 0, 0, 0)
    return {
      id: `d${i + 1}`,
      title: e.title,
      source: e.source,
      type: e.type,
      fromDate: day(first),
      toDate: day(last),
      fromTime: e.allDay ? undefined : clock(from),
      toTime: e.allDay ? undefined : clock(to),
      isFullDay: !!e.allDay,
    } as CalendarEvent & { source: string }
  })
}

export function eventsFor(visible: CalendarSource[]): CalendarEvent[] {
  const on = new Set(visible.filter((s) => s.visible).map((s) => s.id))
  const colorOf = Object.fromEntries(sources.map((s) => [s.id, s.color]))
  const week = seeds.map((s) => {
    const from = at(s.day, s.from[0], s.from[1])
    const to = at(s.day, s.to[0], s.to[1])
    return {
      id: s.id,
      title: s.title,
      source: s.source,
      fromDate: day(from),
      toDate: day(to),
      fromTime: clock(from),
      toTime: clock(to),
    } as CalendarEvent & { source: string }
  })
  return [...week, ...standingEvents(), ...datedEvents()]
    .filter((e) => on.has(e.source))
    .map(({ source, ...e }) => ({
      ...e,
      color: colourValue(String(colorOf[source] ?? 'green')),
    })) as CalendarEvent[]
}
