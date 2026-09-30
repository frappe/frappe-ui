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
import type { AvatarTheme } from '../../src/components/Avatar/types'
import { faces } from '../components/patterns/designAssets'

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

/**
 * The people on this team, as the panel's People and Assignee fields list
 * them: a face is looked up by the name, and what an event stores is the
 * address — `participant` is the addresses joined by ", ", which is what the
 * panel writes when it saves.
 */
export const people: Person[] = [
  { label: 'Faris Ansari', value: 'faris@timeless.co', photo: 0 },
  { label: 'Rubini Raman', value: 'rubini@timeless.co', theme: 'violet' },
  { label: 'Gowtham Sivakumar', value: 'gowtham@timeless.co', photo: 1 },
  { label: 'Shariq Ansari', value: 'shariq@timeless.co', photo: 2 },
  { label: 'Sally Potter', value: 'sally@timeless.co', photo: 3 },
  { label: 'Emily Taylor', value: 'emily@timeless.co', theme: 'blue' },
  { label: 'Priya Nair', value: 'priya@timeless.co', theme: 'green' },
  { label: 'Anil Mehta', value: 'anil@timeless.co', photo: 5 },
  { label: 'Karthik Iyer', value: 'karthik@timeless.co', theme: 'amber' },
  { label: 'Meera Joshi', value: 'meera@timeless.co', photo: 7 },
  { label: 'Tom Whitfield', value: 'tom@timeless.co', theme: 'red' },
  { label: 'Aisha Khan', value: 'aisha@timeless.co', photo: 9 },
  { label: 'Diego Alvarez', value: 'diego@timeless.co', theme: 'gray' },
  { label: 'Hannah Lee', value: 'hannah@timeless.co', theme: 'green' },
  { label: 'Nikhil Rao', value: 'nikhil@timeless.co', photo: 11 },
  { label: 'Zoe Martin', value: 'zoe@timeless.co', theme: 'amber' },
]

export type Person = {
  label: string
  value: string
  /** Which of the Members frame's faces is theirs — one each, so no two
   *  people share a photo; the rest show an initial on a colour, as
   *  frappe-ui's Avatar does. */
  photo?: number
  theme?: AvatarTheme
}

/**
 * How a person is drawn wherever they are: their photo if they have one, and
 * an initial on their own colour if not — not everyone on a team has put a
 * picture up, and a row of faces where every one is a photograph reads as a
 * stock image rather than a team. Someone not on the list gets an initial in
 * gray.
 */
export function portraitOf(name: string): { image?: string; theme: AvatarTheme } {
  const p = people.find((x) => x.label === name)
  return {
    image: p?.photo != null ? faces[p.photo] : undefined,
    theme: p?.theme ?? 'gray',
  }
}

/** The name an address belongs to, or the address itself if it is nobody's. */
export const nameOf = (address: string) =>
  people.find((p) => p.value === address)?.label ?? address

/**
 * Who is on an event, when the sample does not say: a draw from the team,
 * seeded by the event so it is the same people every time the page opens
 * and different people from one event to the next. Most things are one to
 * three people; a few are the whole room. A number asks for that many and
 * lets the draw pick who; a string names them outright, as the panel would.
 */
function crew(key: string, n?: number | string): string {
  if (typeof n === 'string') return n
  let seed = 2166136261
  for (let i = 0; i < key.length; i++) {
    seed ^= key.charCodeAt(i)
    seed = Math.imul(seed, 16777619) >>> 0
  }
  const next = () => {
    seed = (Math.imul(seed ^ (seed >>> 15), 2246822519) + 0x9e3779b9) >>> 0
    return (seed >>> 8) / 16777216
  }
  const order = people
    .map((p) => ({ p, r: next() }))
    .sort((a, b) => a.r - b.r)
    .map((x) => x.p.value)
  const sizes = [1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 5, 6]
  const count = n ?? sizes[Math.floor(next() * sizes.length)]
  return order.slice(0, Math.min(count, order.length)).join(', ')
}

/** Names, as a sample would rather write them than as addresses. */
const withPeople = (...names: string[]) =>
  names
    .map((n) => people.find((p) => p.label === n)?.value ?? n)
    .join(', ')

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
  /** Who is on it: how many, and the draw picks who — or the addresses outright. */
  with?: number | string
  /** A line about it, read after the title in the agenda. */
  about?: string
}

// The week the design draws, including the two that overlap on Wednesday.
const seeds: Seed[] = [
  { id: '1', title: 'Product design', source: 'leads', day: 0, from: [10, 0], to: [12, 0], with: 3, about: 'Second pass on the pricing page. Sally has the three tier names from marketing; we need to settle the comparison table, what the free plan is allowed to say, and whether the annual toggle stays above the fold or moves into the cards' },
  { id: '2', title: 'Frappe discussion', source: 'deals', day: 2, from: [10, 30], to: [11, 0], with: 2, about: 'What the calendar still needs from the library before the release: the agenda slots, gray and red in the colour map, and a week that can start on Monday' },
  { id: '3', title: 'Interview', source: 'deals', day: 2, from: [11, 0], to: [12, 0], with: 2, about: 'Frontend, round two — the take-home walkthrough' },
  { id: '4', title: 'Weekly review', source: 'qualified', day: 4, from: [10, 30], to: [11, 30], with: 6, about: 'Pipeline by stage, then the three deals that slipped out of the quarter — Northwind, Contoso and the Dropbox renewal — and whether any of them come back in November' },
  { id: '5', title: 'Interview', source: 'leads', day: 3, from: [12, 0], to: [13, 0], with: 1 },
  { id: '6', title: 'DS Meeting', source: 'deals', day: 2, from: [13, 0], to: [14, 0], with: 4, about: 'Tokens and the type scale. Settle ink-gray-5 against 6 for secondary text, whether text-base moves to 14 or stays at 13, and what happens to every table label that assumed the old size. Bring the audit sheet' },
  { id: '7', title: 'Product update', source: 'qualified', day: 4, from: [13, 0], to: [14, 0], with: 5, about: 'What shipped this week, five minutes each, and the one thing each team is stuck on. Emily is taking notes and the recording goes to the channel afterwards' },
  { id: '8', title: 'Interview', source: 'leads', day: 1, from: [14, 0], to: [15, 0], with: 1, about: 'Backend, round one' },
  { id: '9', title: 'Birthday', source: 'leads', day: 1, from: [15, 0], to: [16, 0], with: 4, about: 'Cake in the kitchen at three' },
  { id: '10', title: 'Weekly standup', source: 'qualified', day: 4, from: [15, 30], to: [17, 0], with: 5, about: 'Long one this week: the release, then the support queue' },
  { id: '11', title: 'Take a walk', source: 'deals', day: 0, from: [18, 0], to: [19, 0], with: 1 },
  { id: '12', title: 'CRM discussion', source: 'leads', day: 3, from: [18, 0], to: [19, 0], with: 3, about: 'The lead scoring proposal — bring the sheet. Faris wants a call on whether website visits count for anything before we show it to sales on Monday' },
  // Wednesday carries five, which is two more than a month cell can hold —
  // so the Month view has a day to draw "3 more" on.
  { id: '13', title: 'Design review', source: 'qualified', day: 2, from: [15, 0], to: [16, 0], with: 2, about: 'Settings modal and the agenda, against the file' },
  { id: '14', title: 'Train to Chennai', source: 'leads', day: 2, from: [17, 30], to: [18, 30], with: withPeople('Faris Ansari'), about: 'Vande Bharat, coach C4 — Faris has the tickets' },
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
  with?: number | string
  about?: string
}

const standing: Standing[] = [
  { title: 'Standup', source: 'qualified', weekday: 1, from: [9, 30], to: [9, 45], with: 4 },
  { title: 'Pipeline review', source: 'deals', weekday: 1, from: [15, 0], to: [16, 0], with: 3, about: 'Every open deal over 5L, by stage' },
  { title: '1:1 — Priya', source: 'leads', weekday: 2, from: [11, 0], to: [11, 30], with: withPeople('Priya Nair') },
  { title: 'Design critique', source: 'deals', weekday: 3, from: [10, 0], to: [11, 0], with: 3, about: 'Bring one screen; twenty minutes each, and the notes go in the file' },
  { title: 'Standup', source: 'qualified', weekday: 4, from: [9, 30], to: [9, 45], with: 4 },
  { title: 'Week in review', source: 'qualified', weekday: 5, from: [16, 0], to: [17, 0], with: 6, about: 'What landed, what slipped, who is out next week' },
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
  with?: number | string
  about?: string
}

const dated: Dated[] = [
  // ── The month under way ────────────────────────────────────────────────
  { title: 'Dropbox — discovery call', source: 'leads', month: 0, date: 2, from: [14, 0], to: [15, 0], with: 2, about: 'Their ops lead and two from finance. They are on Salesforce today, the contract ends in March, and the thing they keep coming back to is whether our import handles their custom objects — have the answer ready before we get on the call' },
  { title: 'Onboarding — Northwind', source: 'qualified', month: 0, date: 3, from: [11, 0], to: [12, 30], with: 3, about: 'Import their contacts, set up the two pipelines, walk the team through the inbox. They have eleven people joining, so keep the demo account clean and have the invite links ready before we start' },
  { title: 'Interview — backend', source: 'leads', month: 0, date: 9, from: [16, 0], to: [17, 0], with: 2 },
  { title: 'Priya on leave', source: 'away', month: 0, date: 14, days: 3, allDay: true, with: withPeople('Priya Nair'), about: 'Back Thursday; Rubini covers the leads inbox' },
  { title: 'Quarterly forecast', source: 'deals', month: 0, date: 17, from: [13, 0], to: [14, 30], with: 3, about: 'Commit, best case and the gap to target' },
  { title: 'Renewal — Contoso', source: 'qualified', month: 0, date: 21, from: [10, 0], to: [11, 0], with: 2, about: 'Three-year term on the table if we hold the seat price' },
  { title: 'Send the forecast', source: 'work', month: 0, date: 22, from: [9, 0], to: [9, 30], type: 'task', with: withPeople('Faris Ansari'), about: 'To Priya, before standup' },
  { title: 'Team dinner', source: 'personal', month: 0, date: 25, from: [19, 0], to: [21, 0], with: withPeople('Faris Ansari', 'Rubini Raman', 'Gowtham Sivakumar', 'Shariq Ansari', 'Sally Potter', 'Emily Taylor'), about: 'Karavalli, table for eight under Sally' },

  // ── The month after ───────────────────────────────────────────────────
  { title: 'Lunch with Anil', source: 'personal', month: 1, date: 1, from: [12, 30], to: [13, 30], with: withPeople('Anil Mehta'), about: 'Toit, Indiranagar' },
  { title: 'Frappe Conference, Mumbai', source: 'deals', month: 1, date: 5, days: 3, allDay: true, with: 4, about: 'Booth on the second floor, next to the coffee. Gowtham speaks on day two at four; Nikhil and Aisha run the booth while he is on, and the demo laptop needs the offline build in case the wifi goes' },
  { title: 'Roadmap — Q4', source: 'deals', month: 1, date: 12, from: [14, 0], to: [16, 0], with: 5, about: 'Three themes, no more — and a written list of what we are saying no to this quarter, so nobody hears it for the first time in a customer call' },
  { title: 'Interview — designer', source: 'leads', month: 1, date: 14, from: [15, 0], to: [16, 0], with: 2, about: 'Portfolio walkthrough, then the settings-modal exercise' },
  { title: 'Raise the invoices', source: 'work', month: 1, date: 15, from: [10, 0], to: [10, 30], type: 'task', with: 1 },
  { title: "Shreya's birthday", source: 'personal', month: 1, date: 19, allDay: true, with: 3 },
  { title: 'Customer visits — Bengaluru', source: 'leads', month: 1, date: 20, days: 4, allDay: true, with: 2, about: 'Northwind on Tuesday, Contoso Wednesday, the rest as they confirm' },
  { title: 'Board pack due', source: 'work', month: 1, date: 26, from: [17, 0], to: [18, 0], type: 'task', with: withPeople('Rubini Raman'), about: 'Numbers from Rubini by Monday, narrative by Wednesday' },
  { title: 'Month-end close', source: 'work', month: 1, date: 30, from: [16, 0], to: [17, 30], type: 'task', with: 1 },

  // ── And the one after that ────────────────────────────────────────────
  { title: 'Q4 kickoff', source: 'deals', month: 2, date: 2, from: [10, 0], to: [11, 30], with: 6, about: 'Targets by team, then the hiring plan' },
  { title: 'Dropbox — renewal', source: 'qualified', month: 2, date: 5, from: [11, 0], to: [12, 0], with: 2 },
  { title: 'Diwali', source: 'away', month: 2, date: 8, allDay: true, with: 6, about: 'Office closed; support on rota' },
  { title: 'Offsite — Goa', source: 'deals', month: 2, date: 9, days: 5, allDay: true, with: 16, about: 'Whole team. Flights out Monday morning, back Friday night; Hannah has the hotel, Diego has the agenda, and Wednesday afternoon is deliberately empty' },
  { title: 'Performance reviews', source: 'work', month: 2, date: 16, from: [14, 0], to: [17, 0], type: 'task', with: 1, about: 'Six write-ups, thirty minutes each' },
  { title: 'Interview — product', source: 'leads', month: 2, date: 18, from: [11, 0], to: [12, 0], with: 2 },
  { title: 'Webinar — CRM for teams', source: 'qualified', month: 2, date: 20, from: [16, 0], to: [17, 0], with: 2, about: 'Forty signed up so far; Shariq runs the demo' },
  { title: 'Customer advisory board', source: 'qualified', month: 2, date: 24, from: [14, 0], to: [16, 0], with: 4, about: 'Eight customers, the roadmap, and an hour of them talking while we do not. Tom moderates; the rest of us take notes and hold the follow-ups until the next day' },
  { title: 'Anil out', source: 'away', month: 2, date: 26, days: 2, allDay: true, with: withPeople('Anil Mehta') },
  { title: 'Month-end close', source: 'work', month: 2, date: 30, from: [16, 0], to: [17, 30], type: 'task', with: 1 },
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
        participant: crew(`${s.title} ${day(from)}`, s.with),
        description: s.about,
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
      participant: crew(
        `${e.title} ${day(first)}`,
        e.type === 'task' ? (e.with ?? 1) : e.with,
      ),
      description: e.about,
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
      participant: crew(`${s.id} ${s.title}`, s.with),
      description: s.about,
    } as CalendarEvent & { source: string }
  })
  return [...week, ...standingEvents(), ...datedEvents()]
    .filter((e) => on.has(e.source))
    .map(({ source, ...e }) => ({
      ...e,
      color: colourValue(String(colorOf[source] ?? 'green')),
    })) as CalendarEvent[]
}
