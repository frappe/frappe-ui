<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, DatePicker, TabButtons, providePortalTarget } from '../../src'
// The narrow path, not the `experimental` barrel: that one also pulls in
// the editor and the charts, which drags tiptap and echarts into the page.
import { Calendar } from '../../experimental/Calendar'
import type { CalendarEvent } from '../../experimental/Calendar'
import AppHeader from './AppHeader.vue'
import DayIcon from './icons/DayIcon.vue'
import WeekIcon from './icons/WeekIcon.vue'
import MonthIcon from './icons/MonthIcon.vue'
import EventPanel from './EventPanel.vue'
import { sources, eventsFor } from './sampleCalendars'
import type { CalendarSource } from './sampleCalendars'
import { espressoCalendar, espressoDatePicker, grid } from './calendarClasses'

// The calendars laid over one another; turning one off filters what the
// Calendar is handed.
const calendars = ref<CalendarSource[]>(sources.map((s) => ({ ...s })))
const events = computed(() =>
  eventsFor(calendars.value).filter((e) => !hidden.value.includes(String(e.id))),
)
function toggle(id: string) {
  const c = calendars.value.find((s) => s.id === id)
  if (c) c.visible = !c.visible
}

// The file opens a side panel where the component would open a popover (on a
// click) or a modal (on a cell click). `onClick` and `onCellClick` replace
// those behaviours outright, so neither is suppressed after the fact.
const panel = ref<{
  event: CalendarEvent | null
  date: Date | null
  kind: 'Event' | 'Task'
} | null>(null)
const openEvent = ({ calendarEvent }: { calendarEvent: CalendarEvent }) =>
  (panel.value = { event: calendarEvent, date: null, kind: 'Event' })
const openNew = (data: { date?: Date } = {}) =>
  (panel.value = { event: null, date: data.date ?? null, kind: 'Event' })
// New → Event / New → Task, from the header's menu: the same panel, opened on
// the face the menu picked.
const openNewOf = (kind: 'Event' | 'Task') =>
  (panel.value = { event: null, date: null, kind })
const removeEvent = (id: string | number | undefined) => {
  hidden.value = [...hidden.value, String(id)]
  panel.value = null
}

// Deleting is the app's business: the component reports it, the data drops it.
const hidden = ref<string[]>([])

// Every overlay on this page lands in `overlays` rather than on <body>, which
// is the only way to reach the month picker's panel with a class — DatePicker
// sizes it itself and takes no `portalTo`. The New menu names its own target
// and is unaffected.
const overlays = ref<HTMLElement | null>(null)
providePortalTarget(() => overlays.value ?? undefined)

// Each view carries Espresso's own glyph: a ring for the single day, three
// dots for the week's run of days, four in a grid for the month.
const views = [
  { label: 'Day', value: 'Day', iconLeft: DayIcon },
  { label: 'Week', value: 'Week', iconLeft: WeekIcon },
  { label: 'Month', value: 'Month', iconLeft: MonthIcon },
]

// ── The sub-header's label ───────────────────────────────────────────────────
//
// The file names the month and the year, and nothing else — "Aug 2025". The
// component's own label is longer in two ways: it spells the month out, and
// in the Day view it names the day as well ("Thu, 25 Sep 2026"), which the
// file says in the band over the grid instead.
const FULL_MONTH = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/g

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
  <div class="flex h-screen w-full overflow-hidden bg-surface-base">
    <div class="flex min-w-0 flex-1 flex-col">
      <AppHeader @new="openNewOf" />

      <div class="flex min-h-0 flex-1">
      <Calendar
        :events="events"
        :class="`min-w-0 flex-1 ${espressoCalendar}`"
        :on-click="openEvent"
        :on-dbl-click="openEvent"
        :on-cell-click="openNew"
        :config="{
          defaultMode: 'Week',
          isEditMode: true,
          enableShortcuts: true,
          timeFormat: '12h',
          hourHeight: grid.hourHeight,
          noBorder: true,
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
          <div class="mb-4 mt-3.5 flex h-8 shrink-0 items-center gap-8 px-5">
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
                  @click="setCalendarDate()"
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
                :model-value="activeView"
                :options="views"
                @update:model-value="updateActiveView"
              />

              <Button size="sm" icon-left="lucide-arrow-up-down" label="Sort">
                Sort
                <template #suffix>
                  <span class="lucide-chevron-down size-4 text-ink-gray-5" />
                </template>
              </Button>
              <Button size="sm" icon-left="lucide-list-filter" label="Filter">
                Filter
                <template #suffix>
                  <span class="lucide-chevron-down size-4 text-ink-gray-5" />
                </template>
              </Button>
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
            <template v-for="band in [dayBand(currentMonthYear)]" :key="band.name">
              <span :class="band.today && 'text-ink-gray-7'">{{ band.name }}</span>
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

      <!--
        Where the header's New menu lands. A target of its own rather than
        the page root, so the 220 the file draws reaches that menu and not
        every Select in the panel beside it.
      -->
      <div id="calendar-new-menu" class="[&_[data-slot=content]]:!w-[220px]" />

      <!-- Where every other overlay on the page lands; see `overlays`. -->
      <div ref="overlays" :class="espressoDatePicker" />

      <EventPanel
        v-if="panel"
        :event="panel.event"
        :date="panel.date"
        :kind="panel.kind"
        @close="panel = null"
        @delete="removeEvent"
      />
      </div>
    </div>
  </div>
</template>
