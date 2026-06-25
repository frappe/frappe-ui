<template>
  <div class="select-none text-base text-ink-gray-9">
    <div
      v-if="centerHeader"
      class="flex items-center justify-between p-2 pb-0 gap-1"
    >
      <Button
        :class="{ invisible: hidePrev }"
        label="previous"
        variant="ghost"
        icon="lucide-chevron-left"
        @click="emit('prev')"
      />
      <span class="text-sm-medium text-ink-gray-7">
        {{ months[currentMonth] }} {{ currentYear }}
      </span>
      <Button
        :class="{ invisible: hideNext }"
        label="next"
        variant="ghost"
        icon="lucide-chevron-right"
        @click="emit('next')"
      />
    </div>
    <div v-else class="flex items-center justify-between p-2 pb-0 gap-1">
      <Button
        variant="ghost"
        size="sm"
        class="text-sm-medium text-ink-gray-7"
        label="cycle-calendar-view"
        @click="emit('cycleView')"
      >
        {{ months[currentMonth] }} {{ currentYear }}
      </Button>
      <div v-if="view === 'date'" class="flex items-center">
        <Button
          v-if="!hidePrev"
          label="previous"
          variant="ghost"
          icon="lucide-chevron-left"
          @click="emit('prev')"
        />
        <Button
          v-if="todayLabel && !hideToday"
          :label="todayLabel"
          variant="ghost"
          class="text-xs"
          @click="emit('today')"
        />
        <Button
          v-if="!hideNext"
          label="next"
          variant="ghost"
          icon="lucide-chevron-right"
          @click="emit('next')"
        />
      </div>
    </div>
    <div class="p-2">
      <div
        v-if="view === 'date'"
        ref="gridRef"
        role="grid"
        aria-label="Calendar dates"
        @mouseleave="emit('hoverCell', null)"
      >
        <div
          class="flex items-center text-xs-medium uppercase text-ink-gray-4 mb-1 gap-0.5"
        >
          <div
            v-for="(d, di) in WEEKDAYS"
            :key="di"
            class="flex size-7 items-center justify-center"
          >
            {{ d }}
          </div>
        </div>
        <div class="flex flex-col gap-0.5">
          <div
            v-for="(week, wi) in weeks"
            :key="wi"
            class="flex gap-0.5"
            role="row"
          >
            <template v-for="cell in week" :key="cell.key">
              <div
                v-if="hideOutOfMonth && !cell.inMonth"
                class="size-7"
                aria-hidden="true"
              />
              <button
                v-else
                type="button"
                class="flex size-7 items-center justify-center text-sm transition-colors duration-100"
                :class="cellClass(cell)"
                role="gridcell"
                :aria-selected="ariaSelected(cell)"
                :aria-disabled="cell.isUnavailable ? 'true' : undefined"
                :aria-label="ariaLabel(cell)"
                :disabled="cell.isUnavailable"
                :data-value="cell.key"
                :data-outside-view="cell.inMonth ? undefined : ''"
                :data-disabled="cell.isUnavailable ? '' : undefined"
                :tabindex="isFocusedCell(cell) ? 0 : -1"
                @mouseenter="emit('hoverCell', cell.date)"
                @click="!cell.isUnavailable && emit('selectDate', cell.date)"
                @keydown.left.prevent="
                  shiftFocus(cell.date.subtract(1, 'day'), -1)
                "
                @keydown.right.prevent="shiftFocus(cell.date.add(1, 'day'), 1)"
                @keydown.up.prevent="
                  shiftFocus(cell.date.subtract(7, 'day'), -1)
                "
                @keydown.down.prevent="shiftFocus(cell.date.add(7, 'day'), 1)"
                @keydown.home.prevent="
                  shiftFocus(cell.date.subtract(cell.date.day(), 'day'), -1)
                "
                @keydown.end.prevent="
                  shiftFocus(cell.date.add(6 - cell.date.day(), 'day'), 1)
                "
                @keydown.page-up.prevent="
                  shiftFocus(
                    $event.shiftKey
                      ? cell.date.subtract(1, 'year')
                      : cell.date.subtract(1, 'month'),
                    -1,
                  )
                "
                @keydown.page-down.prevent="
                  shiftFocus(
                    $event.shiftKey
                      ? cell.date.add(1, 'year')
                      : cell.date.add(1, 'month'),
                    1,
                  )
                "
                @keydown.enter.prevent="
                  !cell.isUnavailable && emit('selectDate', cell.date)
                "
                @keydown.space.prevent="
                  !cell.isUnavailable && emit('selectDate', cell.date)
                "
              >
                {{ cell.date.date() }}
              </button>
            </template>
          </div>
        </div>
      </div>
      <div v-else class="flex h-52 w-52" aria-label="Select month and year">
        <div
          ref="yearListRef"
          class="relative flex w-1/2 flex-col gap-0.5 overflow-y-auto"
          role="listbox"
          aria-label="Select year"
        >
          <button
            v-for="y in years"
            type="button"
            :key="y"
            class="w-full text-ink-gray-8 h-7 shrink-0 rounded py-1 text-sm text-center cursor-pointer transition-colors duration-100"
            :class="
              y === currentYear
                ? 'bg-surface-gray-2 hover:bg-surface-gray-3'
                : ' hover:bg-surface-gray-1'
            "
            :data-selected="y === currentYear ? '' : undefined"
            :aria-selected="y === currentYear ? 'true' : 'false'"
            @click="emit('selectYear', y)"
          >
            {{ y }}
          </button>
        </div>
        <div
          ref="monthListRef"
          class="relative flex w-1/2 flex-col gap-0.5 overflow-y-auto pl-1.5"
          role="listbox"
          aria-label="Select month"
        >
          <button
            v-for="(m, i) in months"
            type="button"
            :key="m"
            class="w-full text-ink-gray-8 shrink-0 h-7 rounded py-1 text-sm text-center cursor-pointer transition-colors duration-100"
            :class="
              i === currentMonth
                ? 'bg-surface-gray-2 hover:bg-surface-gray-3'
                : ' hover:bg-surface-gray-1'
            "
            :data-selected="i === currentMonth ? '' : undefined"
            :aria-selected="i === currentMonth ? 'true' : 'false'"
            @click="emit('selectMonth', i)"
          >
            {{ m }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { Dayjs } from 'dayjs/esm'
import { Button } from '../Button'
import { months } from './utils'
import type { DatePickerViewMode as ViewMode } from './types'

export interface CalendarPanelCell {
  date: Dayjs
  key: string
  inMonth: boolean
  isToday: boolean
  isSelected: boolean
  isUnavailable: boolean
  isRangeStart?: boolean
  isRangeEnd?: boolean
  inRange?: boolean
}

interface Props {
  view: ViewMode
  currentYear: number
  currentMonth: number
  weeks: CalendarPanelCell[][]
  /** Label for the optional Today/Now action button between prev/next. Empty/undefined hides it. */
  todayLabel?: string
  /** Hide the prev nav button — used in dual-pane right side. */
  hidePrev?: boolean
  /** Hide the next nav button — used in dual-pane left side. */
  hideNext?: boolean
  /** Hide the Today/Now button — used in dual-pane to avoid duplicates. */
  hideToday?: boolean
  /** Render out-of-month cells as empty placeholders — used in dual-pane to avoid showing the same date in both panes. */
  hideOutOfMonth?: boolean
  /**
   * Render a slim header with prev/next flanking a centered, non-clickable
   * month label. Used in dual-pane so the two panels read as
   * `< First Month | Second Month >`.
   */
  centerHeader?: boolean
  /** Earliest selectable date in YYYY-MM-DD format. Used to bound keyboard nav. */
  min?: string
  /** Latest selectable date in YYYY-MM-DD format. Used to bound keyboard nav. */
  max?: string
  /**
   * The date that currently holds the roving tabindex. Controlled — parent
   * owns the state, panel emits `update:focusedDate` when arrow keys land on
   * a new cell. Multiple panels (e.g. dual-pane DateRangePicker) can share
   * the same value; each panel only renders `tabindex=0` if the date falls
   * inside its own visible weeks.
   */
  focusedDate?: Dayjs | null
}

const props = withDefaults(defineProps<Props>(), {
  todayLabel: '',
  hidePrev: false,
  hideNext: false,
  hideToday: false,
  hideOutOfMonth: false,
  centerHeader: false,
})

const emit = defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
  (e: 'today'): void
  (e: 'cycleView'): void
  (e: 'selectMonth', i: number): void
  (e: 'selectYear', y: number): void
  (e: 'selectDate', d: Dayjs): void
  (e: 'hoverCell', d: Dayjs | null): void
  /** Request that the parent make this date visible. The parent decides
   *  whether to advance its own month (single-pane) or to leave the view
   *  alone because the date is already visible in a sibling panel
   *  (dual-pane). */
  (e: 'navigate', d: Dayjs): void
  /** Roving tabindex moved — parent should update its `focusedDate` ref so
   *  every panel that shares it stays in sync. */
  (e: 'update:focusedDate', d: Dayjs): void
}>()

// ── Month-year split view ────────────────────────────────────────────────────
// The year column is a scrollable list. We bound it to [min, max] when provided
// (so unreachable years aren't offered) and otherwise fall back to a wide window
// around the current year. The current year is always included.
const years = computed<number[]>(() => {
  const current = props.currentYear
  const minY = props.min ? Number(props.min.slice(0, 4)) : current - 100
  const maxY = props.max ? Number(props.max.slice(0, 4)) : current + 10
  const start = Math.min(minY, current)
  const end = Math.max(maxY, current)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const yearListRef = ref<HTMLElement | null>(null)
const monthListRef = ref<HTMLElement | null>(null)

// Center the active year/month when the split view opens. Manual scrollTop (vs
// scrollIntoView) keeps the scroll contained to each list and never nudges the
// popover or page. Relies on the list containers being `relative` so the
// buttons' `offsetTop` is measured against them.
function centerSelected(container: HTMLElement | null) {
  const el = container?.querySelector<HTMLElement>('[data-selected]')
  if (!container || !el) return
  container.scrollTop =
    el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2
}

watch(
  () => props.view,
  (view) => {
    if (view !== 'monthYear') return
    nextTick(() => {
      centerSelected(yearListRef.value)
      centerSelected(monthListRef.value)
    })
  },
)

// ── Roving tabindex (Reka Calendar pattern) ──────────────────────────────────
// The focused date is *controlled* — the parent owns the value and feeds it
// in via `props.focusedDate`. Arrow keys compute a target, emit
// `update:focusedDate`, and a watch on the prop drives the actual DOM focus.
// Multiple panels can share the same `focusedDate`; only the panel whose
// visible weeks contain the date renders the `tabindex=0` cell, and the
// matching panel's watch handler calls `.focus()` on its own cell.

const gridRef = ref<HTMLElement | null>(null)

function isFocusedCell(cell: CalendarPanelCell): boolean {
  return !!props.focusedDate && cell.date.isSame(props.focusedDate, 'day')
}

function pickInitialFocusDate(weeks: CalendarPanelCell[][]): Dayjs | null {
  const flat = weeks.flat()
  const selected = flat.find(
    (c) =>
      (c.isSelected || c.isRangeStart || c.isRangeEnd) &&
      !c.isUnavailable &&
      c.inMonth,
  )
  if (selected) return selected.date
  const today = flat.find((c) => c.isToday && c.inMonth && !c.isUnavailable)
  if (today) return today.date
  const firstAvailable = flat.find((c) => c.inMonth && !c.isUnavailable)
  return firstAvailable?.date ?? null
}

// (Seeding `focusedDate` is the parent's responsibility — it knows the full
// picture: selected/from value, whether dual-pane is active, etc. CalendarPanel
// stays purely controlled so multiple panels sharing one focused-date can't
// race each other on mount.)

// When the focused date changes, move DOM focus to the matching cell — but
// only if the cell is in *our* grid and focus is already inside a calendar
// panel. The "already inside a panel" guard avoids stealing focus from the
// trigger input on every parent state change.
watch(
  () => props.focusedDate,
  (val) => {
    if (!val) return
    nextTick(() => {
      const key = val.format('YYYY-MM-DD')
      const el = gridRef.value?.querySelector(
        `[data-value='${key}']:not([data-outside-view])`,
      ) as HTMLButtonElement | null
      if (!el) return
      const active = document.activeElement
      const focusInSomePanel = active?.hasAttribute('data-value')
      if (focusInSomePanel) el.focus()
    })
  },
)

// Defense-in-depth ceiling for the skip-disabled recursion: even with the
// min/max bounds check, an `isDateUnavailable` predicate that returns true
// for an unbounded run of dates would otherwise spin forever.
const MAX_SKIP_DISABLED_STEPS = 366

function shiftFocus(target: Dayjs, dir: 1 | -1, retried = false, steps = 0) {
  // Bounds check first — if the target is outside [min, max], the arrow
  // press is a no-op rather than trying to navigate into nothing. Matches
  // Reka's CalendarCellTrigger behavior.
  if (props.min && target.isBefore(props.min, 'day')) return
  if (props.max && target.isAfter(props.max, 'day')) return
  if (steps > MAX_SKIP_DISABLED_STEPS) return

  const key = target.format('YYYY-MM-DD')
  const el = gridRef.value?.querySelector(
    `[data-value='${key}']:not([data-outside-view])`,
  ) as HTMLButtonElement | null

  if (!el) {
    // Target isn't in *our* grid. Tell the parent so it can either advance
    // its month (single-pane) or just update focusedDate (dual-pane, where
    // the date is already visible in a sibling panel). Then retry once —
    // by then either our grid has the cell (parent advanced our month) or
    // a sibling panel does (its watch handler picks it up).
    if (retried) return
    emit('navigate', target)
    nextTick(() => shiftFocus(target, dir, true, steps))
    return
  }

  if (el.hasAttribute('data-disabled')) {
    // Skip disabled by stepping one more day in the same direction. Reset
    // `retried` (we may cross another month boundary) but bump `steps`.
    shiftFocus(target.add(dir, 'day'), dir, false, steps + 1)
    return
  }

  emit('update:focusedDate', target)
  el.focus()
}

/**
 * Move keyboard focus into the grid (used when the parent opens the popover
 * via ↓ on the trigger input). Falls back to today/selected/first-available
 * when the parent hasn't seeded a focused date yet.
 */
function focusInitialCell() {
  const target = props.focusedDate ?? pickInitialFocusDate(props.weeks)
  if (!target) return
  emit('update:focusedDate', target)
  nextTick(() => {
    const key = target.format('YYYY-MM-DD')
    const el = gridRef.value?.querySelector(
      `[data-value='${key}']:not([data-outside-view])`,
    ) as HTMLButtonElement | null
    el?.focus()
  })
}

defineExpose({ focusInitialCell })

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function ariaSelected(cell: CalendarPanelCell): 'true' | 'false' {
  return cell.isSelected || cell.isRangeStart || cell.isRangeEnd
    ? 'true'
    : 'false'
}

function ariaLabel(cell: CalendarPanelCell): string {
  return cell.date.format('YYYY-MM-DD') + (cell.isToday ? ' (Today)' : '')
}

function cellClass(cell: CalendarPanelCell): Array<string | false> {
  // "Today" stays bold whether or not it's selected; its gray text color is kept
  // separate so it can be dropped on selected cells.
  const todayFont = cell.isToday ? 'font-semibold' : ''
  // Resting text color for non-selected cells. Omitted on selected/range cells:
  // both are `text-*` utilities, so leaving them in would win the CSS source-order
  // tie against `text-ink-base` and the selected date would render gray.
  const restingText = [
    cell.inMonth ? 'text-ink-gray-8' : 'text-ink-gray-3',
    cell.isToday ? 'text-ink-gray-9' : '',
  ]

  if (cell.isUnavailable) {
    return [
      'rounded',
      ...restingText,
      todayFont,
      'opacity-30 cursor-not-allowed',
    ]
  }

  if (cell.isRangeStart || cell.isRangeEnd || cell.isSelected) {
    return [
      'rounded',
      todayFont,
      'bg-surface-gray-9 text-ink-base hover:bg-surface-gray-9 cursor-pointer',
    ]
  }

  if (cell.inRange) {
    return [
      'rounded',
      ...restingText,
      todayFont,
      'bg-surface-gray-3 hover:bg-surface-gray-3 cursor-pointer',
    ]
  }

  return [
    'rounded',
    ...restingText,
    todayFont,
    'hover:bg-surface-gray-2 cursor-pointer',
  ]
}
</script>
