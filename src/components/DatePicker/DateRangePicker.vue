<template>
  <PickerShell
    ref="shellRef"
    v-model:open="isOpen"
    v-model:input-value="inputValue"
    v-model:typing="isTyping"
    :side="resolvedSide"
    :align="resolvedAlign"
    :offset="resolvedOffset"
    :open-on-focus="props.openOnFocus"
    :open-on-click="props.openOnClick"
    :id="props.id"
    :label="props.label"
    :description="props.description"
    :error="props.error"
    :required="props.required"
    :size="props.size"
    :variant="props.variant"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :readonly="inputReadonly"
    :input-class="dp.inputClass"
    :display-label="displayLabel"
    content-class="w-fit rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5"
    @blur="commitInput()"
    @enter="commitInput(true)"
    @open="onShellOpen"
    @close="onShellClose"
    @request-focus="onShellRequestFocus"
  >
    <template v-if="$slots.trigger" #trigger="ts"
      ><slot name="trigger" v-bind="ts"
    /></template>
    <template v-if="$slots.target" #target="ts"
      ><slot name="target" v-bind="ts"
    /></template>
    <template v-if="$slots.prefix" #prefix="ts"
      ><slot name="prefix" v-bind="ts"
    /></template>
    <template v-if="$slots.suffix" #suffix="ts"
      ><slot name="suffix" v-bind="ts"
    /></template>

    <template #default="{ close }">
      <div
        class="flex"
        :class="$slots.actions ? 'divide-x divide-outline-gray-2' : ''"
      >
        <aside
          v-if="$slots.actions"
          data-slot="actions"
          aria-label="Shortcuts"
          class="flex flex-col p-2 gap-0.5"
        >
          <slot
            name="actions"
            v-bind="{
              fromDate,
              toDate,
              setDate: handleDateCellClick,
              setRange: handleSetRange,
              clear: handleClearClick,
              close,
            }"
          />
        </aside>
        <div
          class="flex"
          :class="isDualPaneActive ? 'divide-x divide-outline-gray-2' : ''"
        >
          <CalendarPanel
            ref="leftPanelRef"
            :view="view"
            :current-year="currentYear"
            :current-month="currentMonth"
            :year-range-start="yearRangeStart"
            :year-range="yearRange"
            :weeks="weeks"
            :today-label="isDualPaneActive ? '' : 'Today'"
            :hide-next="isDualPaneActive"
            :hide-out-of-month="isDualPaneActive"
            :center-header="isDualPaneActive"
            :min="props.min"
            :max="props.max"
            v-model:focused-date="focusedDate"
            @prev="prev"
            @next="next"
            @today="handleTodayClick"
            @cycle-view="cycleView"
            @select-month="selectMonth"
            @select-year="selectYear"
            @select-date="handleDateCellClick"
            @hover-cell="onCellHover"
            @navigate="onPanelNavigate"
          />
          <CalendarPanel
            v-if="isDualPaneActive"
            ref="rightPanelRef"
            :view="view"
            :current-year="rightYear"
            :current-month="rightMonth"
            :year-range-start="yearRangeStart"
            :year-range="yearRange"
            :weeks="rightWeeks"
            hide-prev
            hide-today
            hide-out-of-month
            center-header
            :min="props.min"
            :max="props.max"
            v-model:focused-date="focusedDate"
            @next="next"
            @cycle-view="cycleView"
            @select-date="handleDateCellClick"
            @hover-cell="onCellHover"
            @navigate="onPanelNavigate"
          />
        </div>
      </div>
    </template>
  </PickerShell>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { dayjs, dayjsLocal } from '../../utils/dayjs'
import { generateWeeks } from './utils'
import CalendarPanel, { type CalendarPanelCell } from './CalendarPanel.vue'
import PickerShell from '../shared/picker/PickerShell.vue'
import {
  useCalendarView,
  usePopoverPositioning,
  useKeepOpen,
  useTypeable,
  useDateCoercion,
  useDeprecationWarnings,
  makeUnavailableCheck,
  type LegacyDatePickerProps,
} from './composables'
import type { Dayjs } from 'dayjs/esm'
import type {
  DateRangePickerProps,
  DateRangePickerEmits,
  DateRangePickerSlots,
  DateRangeValue,
} from './types'

const props = withDefaults(defineProps<DateRangePickerProps>(), {
  value: () => [],
  modelValue: () => [],
  variant: 'subtle',
  placeholder: 'Select range',
  typeable: true,
  readonly: false,
  allowCustom: true,
  disabled: false,
  clearable: true,
  dualPane: false,
  openOnFocus: false,
  openOnClick: true,
  // Legacy default kept; see `useKeepOpen` for why.
  autoClose: true,
})
const emit = defineEmits<DateRangePickerEmits>()

const slots = defineSlots<DateRangePickerSlots>()

const dp = props as unknown as LegacyDatePickerProps

// ── Popover open state ───────────────────────────────────────────────────────

const shellRef = ref<{ open: () => void } | null>(null)
const isOpen = ref(false)

watch(
  () => props.open,
  (val) => {
    if (typeof val === 'boolean' && val !== isOpen.value) {
      isOpen.value = val
    }
  },
)

watch(isOpen, (val) => {
  emit('update:open', val)
})

function onShellOpen() {
  initFromValue()
  seedFocusedDate()
}

function onShellClose() {
  resetView()
  hoverDate.value = null
  if (isTyping.value) {
    commitInput()
    isTyping.value = false
  }
  focusedDate.value = null
}

defineExpose({
  open: () => shellRef.value?.open(),
})

// ── Keyboard focus management ────────────────────────────────────────────────

const leftPanelRef = ref<{ focusInitialCell: () => void } | null>(null)
const rightPanelRef = ref<{ focusInitialCell: () => void } | null>(null)
const focusedDate = ref<Dayjs | null>(null)

function seedFocusedDate() {
  if (focusedDate.value) return
  // Prefer the existing range start, then today, then first available cell
  // in the left pane, then in the right pane (dual-pane fallback).
  if (fromDate.value) {
    const d = dayjs(fromDate.value)
    if (!checkUnavailable(d)) {
      focusedDate.value = d
      return
    }
  }
  const today = dayjsLocal().startOf('day')
  if (!checkUnavailable(today)) {
    focusedDate.value = today
    return
  }
  const leftFirst = weeks.value
    .flat()
    .find((c) => c.inMonth && !c.isUnavailable)
  if (leftFirst) {
    focusedDate.value = leftFirst.date
    return
  }
  if (props.dualPane) {
    const rightFirst = rightWeeks.value
      .flat()
      .find((c) => c.inMonth && !c.isUnavailable)
    if (rightFirst) focusedDate.value = rightFirst.date
  }
}

function onShellRequestFocus() {
  // Seed synchronously so panels mount with `props.focusedDate` already
  // set — important for dual-pane, where two panels otherwise race to seed
  // and the wrong one wins. Then queue the actual `.focus()` call for
  // after the popover has rendered.
  seedFocusedDate()
  nextTick(() => {
    leftPanelRef.value?.focusInitialCell()
    rightPanelRef.value?.focusInitialCell()
  })
}

function onPanelNavigate(target: Dayjs) {
  // In dual-pane mode, the target may already be visible in the sibling
  // panel (right pane = currentMonth + 1). In that case we don't advance the
  // view — instead, just push the focused date so the sibling panel's watch
  // picks it up and focuses its own matching cell.
  if (props.dualPane) {
    const inLeft =
      target.month() === currentMonth.value &&
      target.year() === currentYear.value
    const inRight =
      target.month() === rightMonth.value && target.year() === rightYear.value
    if (inLeft || inRight) {
      focusedDate.value = target
      return
    }
  }
  // Single-pane (or dual-pane crossing beyond the right edge): advance the
  // view. After the parent re-renders, the originating panel's shiftFocus
  // retry will find the cell and emit `update:focusedDate`.
  focusOn(target)
}

// ── Positioning / keepOpen / deprecations ────────────────────────────────────

const { resolvedSide, resolvedAlign, resolvedOffset } = usePopoverPositioning(
  props,
  dp,
)
const shouldKeepOpen = useKeepOpen(props, dp)
const inputReadonly = useTypeable(props, dp)
useDeprecationWarnings('DateRangePicker', dp, {
  hasTargetSlot: computed(() => !!slots.target),
})

// ── Calendar state ───────────────────────────────────────────────────────────

const {
  view,
  currentYear,
  currentMonth,
  yearRangeStart,
  yearRange,
  prev,
  next,
  cycleView,
  selectMonth,
  selectYear,
  focusOn,
  resetView,
} = useCalendarView()

const DATE_FORMAT = 'YYYY-MM-DD'
const fromDate = ref<string>('')
const toDate = ref<string>('')
// Tracks the date under the cursor while the user is mid-selection
// (start picked, end not yet) so we can preview the in-progress range.
const hoverDate = ref<Dayjs | null>(null)

const checkUnavailable = makeUnavailableCheck(
  () => props.min,
  () => props.max,
  () => props.isDateUnavailable,
)

const coerceToDayjs = useDateCoercion(() => props.format)

// ── Value parsing ────────────────────────────────────────────────────────────

function normalizeIncoming(val?: string[] | null): [string, string] {
  if (!val || !val.length) return ['', '']
  const from = coerceToDayjs(val[0] || '')
  const to = coerceToDayjs(val[1] || '')
  return [from?.format(DATE_FORMAT) || '', to?.format(DATE_FORMAT) || '']
}

function parseRangeInput(raw: string): [Dayjs | null, Dayjs | null] {
  if (!raw.trim()) return [null, null]
  const normalized = raw.replace(/\s+to\s+/i, ',').replace(/\s+-\s+/g, ',')
  const parts = normalized
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
  if (!parts.length) return [null, null]
  return [coerceToDayjs(parts[0]), coerceToDayjs(parts[1])]
}

function pickIncoming(): string[] {
  if (props.modelValue && props.modelValue.length) return props.modelValue
  if (props.value && props.value.length) return props.value
  return []
}

function syncFromValue(val?: string[]): void {
  const [f, t] = normalizeIncoming(val)
  fromDate.value = f
  toDate.value = t
  if (f) focusOn(dayjs(f))
}

const initialValue = ref<string>('')
syncFromValue(pickIncoming())
initialValue.value = serialize(fromDate.value, toDate.value)

function initFromValue(): void {
  syncFromValue(pickIncoming())
}

watch(
  () => [props.modelValue, props.value],
  () => {
    syncFromValue(pickIncoming())
  },
)

// ── Display ──────────────────────────────────────────────────────────────────

const displayLabel = computed<string>(() =>
  formatDisplay(fromDate.value, toDate.value),
)

function formatOne(dateStr: string): string {
  if (!dateStr) return ''
  const d = dayjs(dateStr)
  if (!d.isValid()) return dateStr
  return props.format ? d.format(props.format) : dateStr
}
function formatDisplay(from: string, to: string): string {
  if (!from && !to) return ''
  if (from && !to) return formatOne(from)
  return `${formatOne(from)} to ${formatOne(to)}`
}

const inputValue = ref<string>(displayLabel.value)
const isTyping = ref(false)
watch(displayLabel, (val) => {
  if (!isTyping.value) inputValue.value = val
})

// ── Calendar grid (with range markers) ───────────────────────────────────────

function buildRangeWeeks(year: number, month: number): CalendarPanelCell[][] {
  const raw = generateWeeks(year, month, '')
  const f = fromDate.value ? dayjs(fromDate.value) : null
  const t = toDate.value ? dayjs(toDate.value) : null
  // While picking the end date, the hovered cell and everything between
  // `from` and it render as in-range (light gray) — only committed endpoints
  // get the dark "selected" treatment. Mouse hover and keyboard focus both
  // act as the preview anchor; mouse wins when both exist.
  const previewAnchor = hoverDate.value ?? focusedDate.value
  const hovering = !t && f && previewAnchor ? previewAnchor : null
  const hoverEnd = hovering && hovering.isAfter(f!, 'day') ? hovering : null
  const hoverStart = hovering && hovering.isBefore(f!, 'day') ? hovering : null
  return raw.map((week) =>
    week.map((d) => {
      const isRangeStart = !!(f && d.date.isSame(f, 'day'))
      const isRangeEnd = !!(t && d.date.isSame(t, 'day'))
      let inRange = false
      if (f && t) {
        inRange = d.date.isAfter(f, 'day') && d.date.isBefore(t, 'day')
      } else if (hoverEnd && f) {
        inRange = d.date.isAfter(f, 'day') && !d.date.isAfter(hoverEnd, 'day')
      } else if (hoverStart && f) {
        inRange =
          !d.date.isBefore(hoverStart, 'day') && d.date.isBefore(f, 'day')
      }
      return {
        ...d,
        isSelected: false,
        isUnavailable: checkUnavailable(d.date),
        isRangeStart,
        isRangeEnd,
        inRange,
      }
    }),
  )
}

const weeks = computed<CalendarPanelCell[][]>(() =>
  buildRangeWeeks(currentYear.value, currentMonth.value),
)

// ── Dual-pane (right side) ───────────────────────────────────────────────────
// Dual pane only renders for the day-grid view; cycling to month/year falls
// back to a single panel to avoid duplicate selectors.

const isDualPaneActive = computed(() => props.dualPane && view.value === 'date')

const rightAnchor = computed(() =>
  dayjs().year(currentYear.value).month(currentMonth.value).add(1, 'month'),
)
const rightYear = computed(() => rightAnchor.value.year())
const rightMonth = computed(() => rightAnchor.value.month())
const rightWeeks = computed<CalendarPanelCell[][]>(() =>
  buildRangeWeeks(rightYear.value, rightMonth.value),
)

// ── Input commit / selection ─────────────────────────────────────────────────

function commitInput(close = false): void {
  const raw = inputValue.value.trim()
  if (!raw) {
    clearSelection()
    if (close && !shouldKeepOpen.value) isOpen.value = false
    return
  }
  const [f, t] = parseRangeInput(raw)
  if (f && !checkUnavailable(f)) fromDate.value = f.format(DATE_FORMAT)
  if (t && !checkUnavailable(t)) toDate.value = t.format(DATE_FORMAT)
  else if (!t) toDate.value = ''
  ensureOrder()
  emitIfChanged()
  inputValue.value = displayLabel.value
  if (close && !shouldKeepOpen.value && fromDate.value && toDate.value) {
    isOpen.value = false
  }
}

function selectDate(date: string | Date | Dayjs): void {
  const d = dayjs(date as any)
  if (!d.isValid() || checkUnavailable(d)) return
  if (fromDate.value && toDate.value) {
    fromDate.value = d.format(DATE_FORMAT)
    toDate.value = ''
  } else if (fromDate.value && !toDate.value) {
    toDate.value = d.format(DATE_FORMAT)
  } else {
    fromDate.value = d.format(DATE_FORMAT)
  }
  ensureOrder()
}
function ensureOrder() {
  if (fromDate.value && toDate.value) {
    if (dayjs(fromDate.value).isAfter(dayjs(toDate.value))) {
      const tmp = fromDate.value
      fromDate.value = toDate.value
      toDate.value = tmp
    }
  }
}

function handleDateCellClick(date: string | Date | Dayjs) {
  selectDate(date)
  if (fromDate.value && toDate.value) {
    hoverDate.value = null
    emitIfChanged()
    if (!shouldKeepOpen.value) isOpen.value = false
  }
  isTyping.value = false
}

function onCellHover(d: Dayjs | null) {
  hoverDate.value = fromDate.value && !toDate.value ? d : null
}

function serialize(from: string, to: string): string {
  if (!from && !to) return ''
  return `${from},${to}`
}

function emitIfChanged() {
  const next = serialize(fromDate.value, toDate.value)
  if (next === initialValue.value) return
  const payload: DateRangeValue =
    fromDate.value && toDate.value ? [fromDate.value, toDate.value] : []
  emit('update:modelValue', payload)
  emit('change', payload)
  initialValue.value = next
}

function clearSelection() {
  if (!fromDate.value && !toDate.value) return
  fromDate.value = ''
  toDate.value = ''
  hoverDate.value = null
  emitIfChanged()
  inputValue.value = ''
}

function handleClearClick() {
  clearSelection()
  if (!shouldKeepOpen.value) isOpen.value = false
  isTyping.value = false
  resetView()
}

function handleTodayClick() {
  const now = dayjsLocal().startOf('day')
  if (checkUnavailable(now)) return
  fromDate.value = now.format(DATE_FORMAT)
  toDate.value = now.format(DATE_FORMAT)
  emitIfChanged()
  if (!shouldKeepOpen.value) isOpen.value = false
  isTyping.value = false
  resetView()
}

function handleSetRange(range: [string | Date | Dayjs, string | Date | Dayjs]) {
  const a = dayjs(range[0])
  const b = dayjs(range[1])
  if (!a.isValid() || !b.isValid()) return
  if (checkUnavailable(a) || checkUnavailable(b)) return
  fromDate.value = a.format(DATE_FORMAT)
  toDate.value = b.format(DATE_FORMAT)
  ensureOrder()
  hoverDate.value = null
  emitIfChanged()
  focusOn(dayjs(fromDate.value))
  isTyping.value = false
  resetView()
}
</script>
