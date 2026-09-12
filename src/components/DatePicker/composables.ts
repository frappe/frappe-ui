import { ref, computed, watch } from 'vue'
import type { Dayjs } from 'dayjs/esm'
import { dayjs } from '../../utils/dayjs'
import { generateWeeks, monthStart, getDateValue } from './utils'
import type { CalendarPanelExposed } from './calendarTypes'
import type {
  CommonDatePickerProps,
  PopoverAlign,
  PopoverSide,
  DatePickerViewMode as ViewMode,
} from './types'

// View + month/year navigation state shared by all three pickers.
export function useCalendarView() {
  const view = ref<ViewMode>('date')
  const currentYear = ref<number>(dayjs().year())
  const currentMonth = ref<number>(dayjs().month())

  // Prev/next only navigate months in the day grid. The month-year split view
  // scrolls instead of paging, so it has no prev/next controls.
  function prev(): void {
    const m = monthStart(currentYear.value, currentMonth.value).subtract(
      1,
      'month',
    )
    currentYear.value = m.year()
    currentMonth.value = m.month()
  }

  function next(): void {
    const m = monthStart(currentYear.value, currentMonth.value).add(1, 'month')
    currentYear.value = m.year()
    currentMonth.value = m.month()
  }

  // Toggle between the day grid and the month-year split view.
  function cycleView(): void {
    view.value = view.value === 'date' ? 'monthYear' : 'date'
  }

  // Picking a month commits the choice and returns to the day grid.
  function selectMonth(i: number): void {
    currentMonth.value = i
    view.value = 'date'
  }

  // Picking a year stays in the split view so the user can then pick a month.
  function selectYear(y: number): void {
    currentYear.value = y
  }

  function focusOn(d: Dayjs): void {
    currentYear.value = d.year()
    currentMonth.value = d.month()
  }

  function resetView(): void {
    view.value = 'date'
  }

  return {
    view,
    currentYear,
    currentMonth,
    prev,
    next,
    cycleView,
    selectMonth,
    selectYear,
    focusOn,
    resetView,
  }
}

// Positioning resolution: `side`/`align`/`offset`.
export function usePopoverPositioning(props: CommonDatePickerProps) {
  const resolvedSide = computed<PopoverSide>(() => props.side ?? 'bottom')
  const resolvedAlign = computed<PopoverAlign>(() => props.align ?? 'start')
  const resolvedOffset = computed(() => props.offset ?? 4)
  return { resolvedSide, resolvedAlign, resolvedOffset }
}

// Returns the readonly state to apply to the underlying TextInput (the
// inverse of `typeable`). HTML `readonly` is still the correct attribute on
// the trigger element — `typeable` is the picker-level vocabulary that wraps
// it.
export function useTypeable(props: { typeable?: boolean }) {
  return computed<boolean>(() => props.typeable === false)
}

// `keepOpen` resolution.
export function useKeepOpen(props: CommonDatePickerProps) {
  return computed(() => props.keepOpen === true)
}

// Coerce arbitrary string input to a Dayjs, respecting an optional explicit format.
export function useDateCoercion(getFormat: () => string | undefined) {
  return function coerceToDayjs(val?: string | null): Dayjs | null {
    if (!val) return null
    const raw = String(val).trim()
    if (!raw) return null
    const format = getFormat()
    if (format) {
      const dStrict = dayjs(raw, format, true)
      if (dStrict.isValid()) return dStrict
    }
    const dLoose = dayjs(raw)
    if (dLoose.isValid()) return dLoose
    const normalized = getDateValue(raw)
    if (normalized) {
      const dNorm = dayjs(normalized)
      if (dNorm.isValid()) return dNorm
    }
    return null
  }
}

// Build an `isDateUnavailable` checker from min/max/isDateUnavailable props.
export function makeUnavailableCheck(
  getMin: () => string | undefined,
  getMax: () => string | undefined,
  getIsUnavailable: () => ((d: Dayjs) => boolean) | undefined,
) {
  return function checkUnavailable(d: Dayjs): boolean {
    const min = getMin()
    const max = getMax()
    const isUnavailable = getIsUnavailable()
    if (min && d.isBefore(dayjs(min), 'day')) return true
    if (max && d.isAfter(dayjs(max), 'day')) return true
    if (isUnavailable?.(d)) return true
    return false
  }
}

export interface UseFocusedDateOptions {
  /** Identity of the current value. The watch fires when it changes. */
  key: () => string
  /** The date the view and the roving tabindex follow. */
  anchor: () => Dayjs | null
  /** The months on screen, so the seed can scan every pane. */
  months: () => Array<{ year: number; month: number }>
  isUnavailable: (date: Dayjs) => boolean
  focusOn: (date: Dayjs) => void
  resetView: () => void
  panels: () => Array<CalendarPanelExposed | null | undefined>
}

// The panels' roving tabindex is controlled, so the focused date lives here. It
// is seeded at setup so the first render already has `tabindex=0` on the cell
// `focus()` will land on.
export function useFocusedDate(options: UseFocusedDateOptions) {
  const focusedDate = ref<Dayjs | null>(null)
  let ownKey: string | null = null

  function seed(): void {
    const anchor = options.anchor()
    if (anchor?.isValid() && !options.isUnavailable(anchor)) {
      focusedDate.value = anchor
      return
    }
    const cells = options
      .months()
      .flatMap(({ year, month }) => generateWeeks(year, month, '').flat())
      .filter((cell) => cell.inMonth && !options.isUnavailable(cell.date))
    const target = cells.find((cell) => cell.isToday) ?? cells[0]
    if (target) focusedDate.value = target.date
  }

  // Only a value set from outside moves the view. The calendar's own click
  // landed on a visible cell, and following it would move the view after an
  // out-of-month click or a click in the second pane.
  watch(
    options.key,
    (key) => {
      if (key === ownKey) return
      options.resetView()
      const anchor = options.anchor()
      if (anchor?.isValid()) options.focusOn(anchor)
      seed()
    },
    { immediate: true },
  )

  /** Record the value the calendar is committing, so the watch ignores it. */
  function markOwnCommit(key: string): void {
    ownKey = key
  }

  /** Move keyboard focus into the day grid. */
  function focus(): void {
    for (const panel of options.panels()) panel?.focusInitialCell()
  }

  return { focusedDate, markOwnCommit, focus }
}
