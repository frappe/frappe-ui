<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { Button, DatePicker, TabButtons, providePortalTarget } from '../../src'
// The narrow path, not the `experimental` barrel: that one also pulls in
// the editor and the charts, which drags tiptap and echarts into the page.
import { Calendar } from '../../experimental/Calendar'
import type { CalendarEvent } from '../../experimental/Calendar'
import AppHeader from './AppHeader.vue'
import DayIcon from './icons/DayIcon.vue'
import WeekIcon from './icons/WeekIcon.vue'
import MonthIcon from './icons/MonthIcon.vue'
import AgendaIcon from './icons/AgendaIcon.vue'
import TaskIcon from './icons/TaskIcon.vue'
import EventPanel from './EventPanel.vue'
import { sources, eventsFor, colourValue } from './sampleCalendars'
import type { CalendarSource } from './sampleCalendars'
import {
  espressoAgenda,
  espressoAgendaFlat,
  espressoCalendar,
  espressoCardCopy,
  espressoDatePicker,
  espressoMenuHeight,
  espressoGreyDraft,
  grid,
} from './calendarClasses'
import {
  useDragShadow,
  useMonthDragSkeleton,
  useMonthResize,
  type MonthResize,
  useDragToCreate,
  useMonthDragToCreate,
  type CalendarDraft,
} from './useDragToCreate'

// The calendars laid over one another; turning one off filters what the
// Calendar is handed.
const calendars = ref<CalendarSource[]>(sources.map((s) => ({ ...s })))

/** Events made in the panel, which the seed knows nothing about. */
const created = ref<CalendarEvent[]>([])

/**
 * The span being filled in, drawn on the grid while the panel is open.
 *
 * `isDraft` is the component's own: it draws a dashed outline instead of a
 * filled pill, which is exactly what a thing not yet made should look like.
 * Handing it to `events` rather than drawing a box over the grid means it is
 * laid out with everything else and stays put when the grid scrolls.
 */
const draftEvent = computed<CalendarEvent | null>(() => {
  const d = panel.value?.draft
  if (!d || panel.value?.event) return null
  return {
    id: DRAFT_ID,
    title: draftTitle.value || 'New event',
    fromDate: d.fromDate,
    toDate: d.toDate,
    fromTime: d.fromTime,
    toTime: d.toTime,
    isFullDay: d.allDay,
    isDraft: true,
    color: colourValue(draftColour.value),
  }
})
const DRAFT_ID = '__draft__'
const draftTitle = ref('')
/** Grey until the panel's swatch says otherwise — nothing has been chosen. */
const draftColour = ref('gray')

const events = computed(() => [
  ...eventsFor(calendars.value).filter(
    (e) => !hidden.value.includes(String(e.id)),
  ),
  ...created.value,
  ...(draftEvent.value ? [draftEvent.value] : []),
])
function toggle(id: string) {
  const c = calendars.value.find((s) => s.id === id)
  if (c) c.visible = !c.visible
}

// The file opens a side panel where the component would open a popover (on a
// click) or a modal (on a cell click). `onClick` and `onCellClick` replace
// those behaviours outright, so neither is suppressed after the fact.
const panel = ref<{
  event: CalendarEvent | null
  draft: CalendarDraft | null
  kind: 'Event' | 'Task'
} | null>(null)
const openEvent = ({ calendarEvent }: { calendarEvent: CalendarEvent }) =>
  (panel.value = { event: calendarEvent, draft: null, kind: 'Event' })
// New → Event / New → Task, from the header's menu: the same panel, opened on
// the face the menu picked and on no particular hour.
const openNewOf = (kind: 'Event' | 'Task') => {
  draftTitle.value = ''
  draftColour.value = 'gray'
  panel.value = { event: null, draft: null, kind }
}
/**
 * The panel's Date and Time rows moving the block on the grid: the span
 * starts as the grid's and becomes the panel's, and the drawing follows it.
 */
const onDraftChange = (draft: CalendarDraft) => {
  if (panel.value) panel.value = { ...panel.value, draft }
}

// A drag on the grid opens it on what was drawn.
const lastDragEnded = ref(0)
const openDraft = (draft: CalendarDraft) => {
  lastDragEnded.value = Date.now()
  draftTitle.value = ''
  draftColour.value = 'gray'
  panel.value = { event: null, draft, kind: 'Event' }
}

/**
 * A month bar's edge, pulled: the span it stands for follows it.
 *
 * The bar names its event and the day it was grabbed over places it, which
 * is enough to tell two standups apart. A span being drawn is checked first
 * — it is the one on screen that has no event behind it yet.
 */
function applyResize({
  title,
  from: barFrom,
  to: barTo,
  edge,
  date,
}: MonthResize) {
  const d = panel.value?.draft
  if (
    d &&
    (draftTitle.value || 'New event') === title &&
    d.fromDate <= barTo &&
    d.toDate >= barFrom
  ) {
    const next =
      edge === 'start'
        ? { ...d, fromDate: date <= d.toDate ? date : d.toDate }
        : { ...d, toDate: date >= d.fromDate ? date : d.fromDate }
    if (next.fromDate === d.fromDate && next.toDate === d.toDate) return
    panel.value = { ...panel.value!, draft: next }
    return
  }

  // Of the events by that name, the one this bar is a piece of: the one
  // whose span the bar's own sits inside, and the shortest of those — a
  // standup on the 30th and a trip from the 29th to the 1st both cover the
  // 30th, and a bar a day wide on the 30th is the standup.
  const ev = events.value
    .filter(
      (e) =>
        !e.isDraft &&
        e.title === title &&
        String(e.fromDate) <= barFrom &&
        String(e.toDate ?? e.fromDate) >= barTo,
    )
    .sort((a, b) => span(a) - span(b))[0]
  if (!ev) return

  const from = String(ev.fromDate)
  const to = String(ev.toDate ?? ev.fromDate)
  const patch =
    edge === 'start'
      ? { fromDate: date <= to ? date : to }
      : { toDate: date >= from ? date : from }
  if (patch.fromDate === from || patch.toDate === to) return
  remember(ev, patch)
}

/**
 * A change to an event, kept.
 *
 * A seeded event is not ours to rewrite in place, so the changed one is kept
 * beside it and the original hidden — as Save and Delete both do.
 */
function remember(ev: CalendarEvent, patch: Partial<CalendarEvent>) {
  const id = String(ev.id)
  if (created.value.some((e) => String(e.id) === id)) {
    created.value = created.value.map((e) =>
      String(e.id) === id ? { ...e, ...patch } : e,
    )
    return
  }
  created.value = [...created.value, { ...ev, ...patch }]
  hidden.value = [...hidden.value, id]
}

/**
 * A card moved or resized on the grid, kept.
 *
 * The component moves an event in its own copy of the list and says so; the
 * page holds the list it was handed, and never heard. So a card dragged to
 * Thursday sat on Thursday until anything at all made the calendar read its
 * events again — a click on the grid was enough — and then went back to
 * where it had been, which reads as the calendar undoing what you just did.
 */
function rememberMove(ev: CalendarEvent) {
  if (!ev || ev.isDraft || String(ev.id) === DRAFT_ID) return
  const held = events.value.find((e) => String(e.id) === String(ev.id))
  if (!held) return
  const patch = {
    fromDate: ev.fromDate,
    toDate: ev.toDate,
    fromTime: ev.fromTime,
    toTime: ev.toTime,
  }
  const same =
    String(held.fromDate) === String(patch.fromDate) &&
    String(held.toDate) === String(patch.toDate) &&
    String(held.fromTime) === String(patch.fromTime) &&
    String(held.toTime) === String(patch.toTime)
  if (same) return
  remember(held, patch)
}

/** How many days an event covers, for picking the tightest fit. */
function span(e: CalendarEvent) {
  const from = new Date(`${String(e.fromDate)}T00:00`).getTime()
  const to = new Date(`${String(e.toDate ?? e.fromDate)}T00:00`).getTime()
  return Number.isNaN(from) || Number.isNaN(to) ? 0 : to - from
}

/** Save: the event keeps its id and takes the panel's fields. */
function saveEvent(payload: CalendarEvent) {
  const id = String(payload.id)
  // The panel names a colour; the calendar draws with a value. Two of the
  // six have no name it knows — see `colourValue` — so the name is turned
  // into what it draws with here, as Create does.
  const next = {
    ...payload,
    color: colourValue(String(payload.color ?? 'gray')),
  }
  created.value = created.value.map((e) =>
    String(e.id) === id ? { ...e, ...next } : e,
  )
  // A seeded event is not ours to rewrite in place, so the edited one is
  // kept beside it and the original hidden — the same trick delete uses.
  if (!created.value.some((e) => String(e.id) === id)) {
    created.value = [...created.value, { ...next }]
    hidden.value = [...hidden.value, id]
  }
  panel.value = null
}

/**
 * A click on a cell, which is the Month view's only way in — it has no hours
 * to drag across, so a day is clicked and the panel opens on it.
 *
 * The Week and Day views raise this too, on the click that ends a drag. That
 * click would overwrite the span just drawn with the single hour under the
 * pointer, so a drag marks the moment it finished and this ignores anything
 * arriving on its heels.
 */
function openFromCell(data: {
  date?: Date | string
  time?: string
  isFullDay?: boolean
}) {
  if (Date.now() - lastDragEnded.value < 400) return
  const d = data.date ? new Date(data.date) : new Date()
  if (Number.isNaN(d.getTime())) return
  const pad = (n: number) => String(n).padStart(2, '0')
  const iso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  const from = data.time && /^\d/.test(data.time) ? data.time : '09:00'
  const [h, m] = from.split(':').map(Number)
  const to = `${pad(((h ?? 9) + 1) % 24)}:${pad(m ?? 0)}`
  // One day is one day, not the whole of it. The Month grid reports its
  // cells as full-day, but a day picked there should open with the hours
  // showing and a default in them — the panel can take a time even where
  // the grid cannot capture one.
  openDraft({
    fromDate: iso,
    toDate: iso,
    fromTime: from,
    toTime: to,
    allDay: false,
  })
}

/** The panel's Create: the dashed block becomes a real one. */
function createEvent(payload: CalendarEvent) {
  created.value = [
    ...created.value,
    {
      ...payload,
      id: `made-${Date.now()}`,
      isDraft: false,
      color: colourValue(String(payload.color ?? 'gray')),
    },
  ]
  panel.value = null
  draftTitle.value = ''
}
const removeEvent = (id: string | number | undefined) => {
  created.value = created.value.filter((e) => String(e.id) !== String(id))
  hidden.value = [...hidden.value, String(id)]
  panel.value = null
}

// Deleting is the app's business: the component reports it, the data drops it.
const hidden = ref<string[]>([])

/**
 * Where "now" sits in the grid, in pixels from midnight.
 *
 * The component draws its marker inside today's column, so the line it draws
 * stops at that column's edges. The file runs a hairline across the whole week
 * and gives today's stretch of it a heavier weight — see `espressoCalendar`.
 * That hairline is a pseudo-element on the week's grid, and this is the only
 * part of it that cannot be written as a class: it moves with the clock.
 */
const clock = ref(new Date())
/**
 * Every 15 seconds, not every minute.
 *
 * The component's marker runs on its own clock, and the two only agree while
 * they are on the same minute — cross one and the thick line jumped a row's
 * worth ahead of the hairline until the other caught up, which is why a
 * reload "fixed" it. A quarter-minute keeps the window they can disagree in
 * under a pixel at 70px to the hour, and the tick below re-reads the
 * marker's real position anyway.
 */
const tick = setInterval(() => (clock.value = new Date()), 15_000)
onUnmounted(() => clearInterval(tick))
/**
 * Drag a span open. The component reports a click on an hour and has nothing
 * for a drag, so the handler goes on the element it renders — see
 * `useDragToCreate`. A click that never moved still lands here, as an hour.
 */
const calendarEl = ref<HTMLElement | null>(null)
const { band, attach, detach } = useDragToCreate(
  calendarEl,
  grid.hourHeight,
  openDraft,
)
// …and the Month view, where a cell is a day and a drag across cells is a
// span of them. Both listen on the same element; each ignores what the other
// is for, because a month cell carries no `[data-time-grid]` and an hour
// carries no `[data-week-row]`.
const month = useMonthDragToCreate(calendarEl, openDraft)
// …and the faded copy a card leaves where it was picked up from. Week and
// Day build all three parts by hand, because the component drags their pills
// itself; Month keeps the component's own faded original for A and draws the
// other two here, the browser's picture of the card having been taken away.
const carried = useDragShadow(calendarEl)
const monthSlot = useMonthDragSkeleton(calendarEl)
// …and pulling a month bar's edge, which lengthens what it stands for.
const monthEdges = useMonthResize(calendarEl, applyResize)
/** Whichever view is being dragged in, one blank slot marks the drop. */
const dropSlot = computed(() => carried.slot.value ?? monthSlot.slot.value)
/**
 * …and one card in hand, drawn once. Month and Week reach the same markup
 * rather than each having their own, which is what keeps a moved card the
 * same weight, the same shadow and the same 180ms in either view.
 */
const heldCard = computed(
  () => carried.carrying.value ?? monthSlot.carrying.value,
)
const heldLanding = computed(
  () => carried.landing.value || monthSlot.landing.value,
)
onMounted(() => {
  attach(calendarEl.value)
  month.attach(calendarEl.value)
  carried.attach(calendarEl.value)
  monthSlot.attach(calendarEl.value)
  monthEdges.attach(calendarEl.value)
})
onUnmounted(() => {
  detach(calendarEl.value)
  month.detach(calendarEl.value)
  carried.detach(calendarEl.value)
  monthSlot.detach(calendarEl.value)
  monthEdges.detach(calendarEl.value)
})

const nowTop = computed(
  () =>
    (clock.value.getHours() * 60 + clock.value.getMinutes()) *
    (grid.hourHeight / 60),
)

/**
 * …and then the hairline is pinned to where the component actually drew its
 * marker, rather than to what our own clock makes of the time.
 *
 * Two clocks cannot be relied on to round the same way at the same instant.
 * The marker is in the DOM and its offset is the truth, so that is read back
 * and written into `--now-top`; `nowTop` above is only the opening guess,
 * for the frame before the marker exists.
 */
const measuredTop = ref<number | null>(null)
function syncNowLine() {
  const host = calendarEl.value
  const marker = host?.querySelector<HTMLElement>('.current-time')
  const grid = host?.querySelector<HTMLElement>('.z-0>[data-day-columns]')
  if (!marker || !grid) {
    measuredTop.value = null
    return
  }
  const top =
    marker.getBoundingClientRect().top - grid.getBoundingClientRect().top
  measuredTop.value = Math.round(top * 100) / 100
}
watch(clock, () => nextTick(syncNowLine))
onMounted(() => nextTick(syncNowLine))

const nowLineTop = computed(() => measuredTop.value ?? nowTop.value)

// Every overlay on this page lands in `overlays` rather than on <body>, which
// is the only way to reach the month picker's panel with a class — DatePicker
// sizes it itself and takes no `portalTo`. The New menu names its own target
// and is unaffected.
const overlays = ref<HTMLElement | null>(null)
providePortalTarget(() => overlays.value ?? undefined)

/**
 * Today, in the Agenda: the week rather than the day.
 *
 * The list scrolls to today on its own, which puts the day at the top and
 * the two or three days before it out of sight above — and a week read from
 * the middle is a week you have to scroll back through to see. Today is the
 * one control that says "put me back where I started", and where the list
 * starts is the week it is in.
 *
 * Twice over, because the component does its own scrolling when the date it
 * is anchored on changes, and does it a frame or two after being told.
 */
function parkAgenda() {
  const park = () => {
    const list = calendarEl.value?.querySelector<HTMLElement>(
      '.overflow-y-auto.bg-surface-base',
    )
    const here = [
      ...(list?.querySelectorAll<HTMLElement>('.calendar-week-label') ?? []),
    ].find((l) => l.textContent?.trim().startsWith('This week'))
    if (!list || !here) return
    list.scrollTop +=
      here.getBoundingClientRect().top - list.getBoundingClientRect().top
  }
  nextTick(() => {
    requestAnimationFrame(() => requestAnimationFrame(park))
    setTimeout(park, 160)
  })
}

/** Today: the component's own, and in the Agenda the week it lands in. */
function goToday(setCalendarDate: () => void, view: string) {
  setCalendarDate()
  if (view === 'Agenda') parkAgenda()
}

// Each view carries Espresso's own glyph: a ring for the single day, three
// dots for the week's run of days, four in a grid for the month, and a ring
// with what it says beside it for the list.
const views = [
  { label: 'Day', value: 'Day', iconLeft: DayIcon },
  { label: 'Week', value: 'Week', iconLeft: WeekIcon },
  { label: 'Month', value: 'Month', iconLeft: MonthIcon },
  { label: 'Agenda', value: 'Agenda', iconLeft: AgendaIcon },
  // A second agenda, for reading one against the other: the same list with
  // no fill behind a row until it is pointed at. The component knows four
  // views, so this one is Agenda with a flag on it.
  { label: 'Agenda V2', value: 'AgendaV2', iconLeft: AgendaIcon },
]

/** Whether the agenda is the one that fills a row only under the pointer. */
const agendaFlat = ref(false)
const viewPill = (view: string) =>
  view === 'Agenda' && agendaFlat.value ? 'AgendaV2' : view
function pickView(v: string, updateActiveView: (view: string) => void) {
  agendaFlat.value = v === 'AgendaV2'
  updateActiveView(v === 'AgendaV2' ? 'Agenda' : v)
  if (v.startsWith('Agenda')) parkAgenda()
}

// ── The sub-header's label ───────────────────────────────────────────────────
//
// The file names the month and the year, and nothing else — "Aug 2025". The
// component's own label is longer in two ways: it spells the month out, and
// in the Day view it names the day as well ("Thu, 25 Sep 2026"), which the
// file says in the band over the grid instead.
const FULL_MONTH =
  /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/g

/** "September 2026" → "Sep 2026"; "Thu, 25 Sep 2026" → "Sep 2026". */
function monthYear(label: string, view: string) {
  const s = view === 'Day' ? label.replace(/^[^,]+,\s*\d+\s*/, '') : label
  return s.replace(FULL_MONTH, (m) => m.slice(0, 3))
}

/**
 * The Day view's own band: "Thu, 25 Sep 2026" → the name, the number, and
 * whether that day is today — which the file marks with the same red tag the
 * week's strip uses (node 35235:67217).
 */
function dayBand(label: string) {
  const m = label.match(/^([^,]+),\s*(\d+)\s+(\w+)\s+(\d+)/)
  if (!m) return { name: label, date: '', today: false }
  const [, name, day, month, year] = m
  const shown = new Date(`${month} ${day}, ${year}`)
  return {
    name,
    date: day,
    today: shown.toDateString() === new Date().toDateString(),
  }
}
</script>

<template>
  <!--
    The calendar as the file draws it (node 35208:100256), minus the app's own
    nav: a 48px header, 14, a 32px sub-header, 16, then the grid — 70px to
    the hour and 72 to the gutter, as the file's 164x70 cells set it. No card
    around it: the file draws rules, so `noBorder` takes the component's
    rounded box away.
  -->
  <!-- h-full, not h-screen: in the v2 shell the page fills the stage under the header bars -->
  <div class="flex h-full w-full overflow-hidden bg-surface-base">
    <div class="flex min-w-0 flex-1 flex-col">
      <AppHeader @new="openNewOf" />

      <div class="flex min-h-0 flex-1">
        <div ref="calendarEl" class="flex min-w-0 flex-1 flex-col">
          <Calendar
            :events="events"
            :class="[
              'min-w-0 flex-1',
              espressoCalendar,
              espressoAgenda,
              agendaFlat && espressoAgendaFlat,
              draftColour === 'gray' && espressoGreyDraft,
            ]"
            :style="{ '--now-top': `${nowLineTop}px` }"
            :on-click="openEvent"
            :on-dbl-click="openEvent"
            :on-cell-click="openFromCell"
            @update="rememberMove"
            :config="{
              defaultMode: 'Week',
              isEditMode: true,
              enableShortcuts: true,
              timeFormat: '12h',
              hourHeight: grid.hourHeight,
              noBorder: true,
              // A task shows Espresso's task mark where an event shows the bar of
              // its calendar's colour (node 35235:67472). `eventIcons` is the
              // component's own way in: it draws the glyph keyed to the event's
              // `type`, which is what the panel stamps on what it makes.
              eventIcons: { task: TaskIcon },
            }"
          >
            <!--
          The sub-header, rebuilt: the slot hands over the month label and
          every mover, so the file's chrome replaces the component's without
          touching it.
        -->
            <template
              #header="{
                currentMonthYear,
                activeView,
                decrement,
                increment,
                updateActiveView,
                onMonthYearChange,
                selectedMonthDate,
                setCalendarDate,
              }"
            >
              <!--
            The sub-header (node 35208:100051): 1180x32, inset 20 either
            side, gap 32 between the title and the controls. 14 above it —
            the header ends at 48, this starts at 62 — and 16 below, where
            the day strip begins at 110.

            frappe-ui ships no sub-header, so it is that structure rebuilt
            from the parts: the month as a 16/500 ink-gray-7 label, a 2px-gap
            pair for prev/next, the view tabs, then Sort and Filter. Every
            control is `sm`, which is the 28 the file draws.
          -->
              <div
                class="mb-4 mt-3.5 flex h-8 shrink-0 items-center gap-8 px-5"
              >
                <!--
              The label is the way into the month. frappe-ui's DatePicker
              takes any trigger, so the file's label is that trigger and the
              component's own input never renders; picking a date sends the
              calendar there through `onMonthYearChange`, which is the same
              hand-off the component's default header makes.
            -->
                <DatePicker
                  :model-value="selectedMonthDate"
                  :clearable="false"
                  align="start"
                  class="[&_[data-slot=chevron]]:hidden"
                  @update:model-value="onMonthYearChange"
                >
                  <template #trigger="{ open, setOpen }">
                    <button
                      type="button"
                      class="flex items-center gap-2 text-lg-medium text-ink-gray-7"
                      @click="setOpen(!open)"
                    >
                      {{ monthYear(currentMonthYear, activeView) }}
                      <span
                        class="lucide-chevron-down size-4 text-ink-gray-5 transition-transform"
                        :class="open && 'rotate-180'"
                      />
                    </button>
                  </template>
                </DatePicker>

                <div class="ml-auto flex items-center gap-2">
                  <!--
                The file's button-group: the movers sit 2 apart, not 8. Today
                stands between them — the one control that always leads back,
                wherever paging has got to, and the same place the file's own
                month picker puts it.
              -->
                  <div class="flex items-center gap-0.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="lucide-chevron-left"
                      aria-label="Previous"
                      @click="decrement"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      label="Today"
                      @click="goToday(setCalendarDate, activeView)"
                    >
                      Today
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="lucide-chevron-right"
                      aria-label="Next"
                      @click="increment"
                    />
                  </div>

                  <TabButtons
                    :model-value="viewPill(activeView)"
                    :options="views"
                    @update:model-value="(v) => pickView(v, updateActiveView)"
                  />
                </div>
              </div>

              <!--
            The Day view's own band (node 35235:66862): 32 tall, the day
            named 13px in from the content's left edge — over the gutter, not
            over the column — and a rule closing it. The rule is drawn here:
            unbordered, the Day view draws none along its own top, where the
            Week's box still draws the one under its strip of dates. It stands where
            the week's strip of dates stands, 16 under the sub-header, so the
            two views start their grids on the same line.

            The Week view has one of these per day and the component draws it;
            the Day view has none, and the component names the day in the
            sub-header instead, which is the one place the file does not.
          -->
              <div
                v-if="activeView === 'Day'"
                class="flex h-8 shrink-0 items-center gap-1 border-b border-outline-gray-1 px-[13px] text-base text-ink-gray-6"
              >
                <template
                  v-for="band in [dayBand(currentMonthYear)]"
                  :key="band.name"
                >
                  <span :class="band.today && 'text-ink-gray-7'">{{
                    band.name
                  }}</span>
                  <!--
                Today's tag: 26x24 on a radius of 6, solid `surface-red-7`,
                and 8 off the name — `gap-1` above plus the 4 here.
              -->
                  <span
                    v-if="band.today"
                    class="ml-1 inline-flex h-6 items-center rounded-3 bg-surface-red-7 px-[5px] text-white"
                  >
                    {{ band.date }}
                  </span>
                  <span v-else>{{ band.date }}</span>
                </template>
              </div>
            </template>
          </Calendar>
        </div>

        <!--
        Where the header's New menu lands. A target of its own rather than
        the page root, so the 220 the file draws reaches that menu and not
        every Select in the panel beside it.
      -->
        <div
          id="calendar-new-menu"
          class="[&_[data-slot=content]]:!w-[220px]"
        />

        <!-- Where every other overlay on the page lands; see `overlays`. -->
        <div ref="overlays" :class="[espressoDatePicker, espressoMenuHeight]" />

        <!--
        The span being drawn: a wash of `surface-gray-1` and no edge at all,
        which is as quiet as a thing that is still being drawn should be. It
        follows the pointer in viewport coordinates, so it needs no place in
        the component's own tree — and it takes no clicks, so the drag under
        it is never interrupted.

        Once the button comes up this goes and the calendar draws the same
        span as a draft instead: no fill, an `outline-gray-1` dash. Drawn and
        drawn-and-waiting are two states, and they look like two things.
      -->
        <div
          v-if="band"
          class="pointer-events-none fixed z-30 rounded-4 bg-surface-gray-1"
          :style="{
            left: `${band.left}px`,
            top: `${band.top}px`,
            width: `${band.width}px`,
            height: `${band.height}px`,
          }"
        />

        <!--
        The same card in the Month view, one per row the span runs over — a
        span that passes Saturday continues on the next row, which is how the
        grid draws a real multi-day event too. The card, not the cells: a wash
        over each whole cell said "these days are selected", where what is
        being made is one thing laid across them.
      -->
        <div
          v-for="(b, i) in month.bands.value"
          :key="i"
          class="pointer-events-none fixed z-30 rounded-4 bg-surface-gray-1"
          :style="{
            left: `${b.left}px`,
            top: `${b.top}px`,
            width: `${b.width}px`,
            height: `${b.height}px`,
          }"
        />

        <!--
        B — where the card would land: an empty `surface-gray-1` slot and
        nothing else. Month takes it from the day cell the browser is
        carrying the bar over, Week and Day from the hour the component has
        snapped its pill to.
      -->
        <div
          v-if="dropSlot"
          aria-hidden="true"
          class="pointer-events-none fixed z-[24] rounded-4 bg-surface-gray-1"
          :style="{
            left: `${dropSlot.left}px`,
            top: `${dropSlot.top}px`,
            width: `${dropSlot.width}px`,
            height: `${dropSlot.height}px`,
          }"
        />

        <!--
        …and where it was before it was picked up: the card's whole markup at
        a third of its weight, so both ends of the move are on screen at
        once. Month leaves its own faded copy behind, so this is Week and
        Day's.
      -->
        <div
          v-if="carried.ghost.value"
          aria-hidden="true"
          :class="`pointer-events-none fixed z-[25] opacity-40 ${espressoCardCopy}`"
          :style="{
            left: `${carried.ghost.value.rect.left}px`,
            top: `${carried.ghost.value.rect.top}px`,
            width: `${carried.ghost.value.rect.width}px`,
            height: `${carried.ghost.value.rect.height}px`,
          }"
          v-html="carried.ghost.value.html"
        />

        <!--
        …and the card itself, in hand: unchanged but for a shadow, following
        the pointer rather than the grid. The grid's snapping is what the
        blank slot is for.
      -->
        <div
          v-if="heldCard"
          aria-hidden="true"
          :class="[
            `pointer-events-none fixed z-30 rounded-4 shadow-md ${espressoCardCopy}`,
            heldLanding && 'transition-all duration-[180ms] ease-out',
          ]"
          :style="{
            left: `${heldCard.rect.left}px`,
            top: `${heldCard.rect.top}px`,
            width: `${heldCard.rect.width}px`,
            height: `${heldCard.rect.height}px`,
          }"
          v-html="heldCard.html"
        />

        <!--
        The panel arrives rather than appears: 200ms is long enough to read as
        a movement and short enough to not be waited on, and it slides its own
        width so it uncovers the grid rather than landing on it.

        `transition`, not `transition-[transform,opacity]` — that arbitrary
        pair generates nothing, which left the element with
        `transition-property: none`, a leave that never ended and a panel that
        would not close.
      -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          leave-active-class="transition duration-150 ease-in"
          enter-from-class="translate-x-full opacity-0"
          leave-to-class="translate-x-full opacity-0"
        >
          <EventPanel
            v-if="panel"
            :event="panel.event"
            :draft="panel.draft"
            :kind="panel.kind"
            :title-model="draftTitle"
            :colour-model="draftColour"
            @update:title-model="draftTitle = $event"
            @update:colour-model="draftColour = $event"
            @update:draft="onDraftChange"
            @close="panel = null"
            @create="createEvent"
            @save="saveEvent"
            @delete="removeEvent"
          />
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
  The month cell's overflow, as the file draws it (a day with more on it than
  it can hold shows two and then "1 more").

  This is the one override on the page that is not a class, because what it
  needs cannot be said as one: the count is per-cell and CSS can only arrive
  at it with a counter.

  The component already has this — `cellEvents` measures the row, keeps what
  fits and reports the rest, and the cell draws a `+N` button for it. It is
  gated behind `isNarrow`, so on anything wider than a phone every event is
  drawn and the row grows to hold them. Ungating it is a library change and
  those are on hold, so the same rule is drawn here instead.

  Three events fit a cell. Past three the cell keeps its three and adds a
  line saying how many it is not showing — so four events read as three and
  "1 more", and six as three and "3 more".

  `visibility` rather than `display`, because a box that is not generated does
  not increment a counter — and `position: absolute` so the hidden ones take
  no space while they are still counted.
*/
:deep([data-week-row] > div > .flex.flex-col.pb-1\.5) {
  counter-reset: espresso-more;
  position: relative;
}
:deep(
  [data-week-row]
    > div
    > .flex.flex-col.pb-1\.5:has(> :nth-child(4))
    > :nth-child(n + 4)
) {
  counter-increment: espresso-more;
  position: absolute;
  visibility: hidden;
}
:deep(
  [data-week-row] > div > .flex.flex-col.pb-1\.5:has(> :nth-child(4))::after
) {
  content: counter(espresso-more) ' more';
  display: flex;
  align-items: center;
  /* A lane tall and on the pills' own left edge, so the rows of a cell keep
     one rhythm down to the last of them. */
  height: 28px;
  padding-inline: 6px;
  font-size: 12px;
  color: var(--ink-gray-7);
}

/*
  A card being moved or resized keeps the width it had standing still.

  The component widens it on purpose: at rest a timed pill stops at 93% of
  its column, which is where a pill laid over it begins, and while it is
  dragged it runs the column's whole width instead. So a card picked up grew
  by a fourteenth as it left the ground and shrank again when it landed,
  which reads as the card changing rather than moving — and the blank slot,
  which is drawn from where the pill has snapped to, grew with it.

  The right edge goes back to the air it keeps standing still: 7%, and the
  pill's own margin. Not a class, because an arbitrary variant cannot carry
  an attribute selector with a colon in its value.

  The two marks a wrapper in hand wears are the z-index it is lifted to and
  the transform it is moved by — and so does every popper on the page, which
  is positioned by a transform and lifted over everything else. Read on
  those alone this rule set a right edge on the New menu and threw it across
  the window, so it asks for the pill as well: the wrapper is the one thing
  on the page with a timed pill directly inside it.
*/
:deep(.flex[style*='z-index: 100'][style*='translate']:has(> .event)) {
  right: calc(7% + 1px) !important;
}

/*
  The week's heading, as a link rather than a chip.

  The component draws it as a button with a fill under it on hover, set in
  from the card it heads. Here it reads as a heading that happens to go
  somewhere: it starts on the same line as the sub-header's own label, takes
  medium rather than semibold, changes only its ink under the pointer, and
  carries a chevron to say it leads somewhere.

  The chevron is a mask rather than a glyph, so it is lucide's own shape and
  takes the label's colour with it. It cannot be a child — the button is the
  component's — so it is drawn after the text, which is where a suffix goes.
*/
:deep(.calendar-week-label) {
  margin-left: 0 !important;
  padding-left: 4px !important;
  padding-right: 0 !important;
  font-weight: 500 !important;
}
:deep(.calendar-week-label:hover) {
  background-color: transparent !important;
  color: var(--ink-gray-6) !important;
}
:deep(.calendar-week-label)::after {
  content: '';
  align-self: center;
  width: 16px;
  height: 16px;
  /* The ink and the weight the sub-header's own chevron carries: this set
     draws at 1.5, not the 2 a hand-written lucide path defaults to. */
  background-color: var(--ink-gray-5);
  -webkit-mask: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m9 18 6-6-6-6'/%3E%3C/svg%3E")
    center / contain no-repeat;
  mask: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m9 18 6-6-6-6'/%3E%3C/svg%3E")
    center / contain no-repeat;
}

/*
  A day's label takes you to that day, and says so by the cursor alone.

  The component fills it on hover, which on a list of days reads as a row
  being selected rather than a label being pointed at — and the fill is the
  width of the gutter, so a whole column lights up beside the events it
  names.
*/
:deep(.calendar-day-header:hover) {
  background-color: transparent !important;
}

/*
  No "Now" or "Soon" on a row.

  The list already says when a thing is: the day heads it and the time leads
  it. A badge repeating that in a word is a second answer to a question the
  row has answered, and the one on a card is the loudest thing in a column
  of quiet ones.
*/
:deep(.calendar-row .contents:has(> .rounded-full)) {
  display: none;
}

/*
  A month bar settles rather than jumps.

  The browser carries its own picture of the bar while it is dragged and the
  component redraws it where it landed, so at the drop the bar is simply
  somewhere else. It is placed by `left` and `width`, neither of which moves
  while the drag is on, so this fires on the drop alone — the component
  already transitions it, at 75ms, which is quick enough to read as a jump.

  A bar that spans days only; a single day's event is a row in its cell's
  stack, and moving it to another day moves it to another stack, which has
  no two positions to travel between.
*/
:deep([data-week-row] .event.absolute) {
  transition:
    left 180ms ease-out,
    width 180ms ease-out,
    top 180ms ease-out !important;
}
</style>
