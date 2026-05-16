<template>
  <PopoverRoot v-model:open="isOpen">
    <PopoverAnchor :reference="anchorEl" as-child>
      <div class="inline-block" :style="triggerStyle">
        <slot name="trigger" v-bind="triggerSlotProps">
          <slot name="target" v-bind="triggerSlotProps">
            <TextInput
              ref="textInputRef"
              v-model="inputValue"
              type="text"
              :class="dp.inputClass"
              :id="props.id"
              :label="props.label"
              :description="props.description"
              :error="props.error"
              :required="props.required"
              :size="props.size"
              :variant="props.variant"
              :placeholder="props.placeholder"
              :disabled="props.disabled"
              :readonly="props.readonly || dp.allowCustom === false"
              @pointerdown="onPointerDown"
              @focus="onFocus"
              @click="onClick"
              @blur="onBlur"
              @keydown.enter.prevent="onEnter"
            >
              <template v-if="$slots.prefix" #prefix>
                <slot name="prefix" v-bind="triggerSlotProps" />
              </template>
              <template #suffix>
                <slot name="suffix" v-bind="triggerSlotProps">
                  <LucideChevronDown
                    class="h-4 w-4 cursor-pointer"
                    @mousedown.prevent="togglePopover"
                  />
                </slot>
              </template>
            </TextInput>
          </slot>
        </slot>
      </div>
    </PopoverAnchor>
    <PopoverPortal>
      <PopoverContent
        data-slot="content"
        class="z-[100]"
        :side="resolvedSide"
        :align="resolvedAlign"
        :side-offset="resolvedOffset"
        @open-auto-focus.prevent
        @interact-outside="onInteractOutside"
      >
        <div
          ref="popoverContentRef"
          data-slot="content-body"
          :data-motion="motion"
          class="w-fit rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5"
        >
          <div
            class="flex"
            :class="isDualPaneActive ? 'divide-x divide-outline-gray-2' : ''"
          >
            <CalendarPanel
              :view="view"
              :current-year="currentYear"
              :current-month="currentMonth"
              :year-range-start="yearRangeStart"
              :year-range="yearRange"
              :weeks="weeks"
              :today-label="isDualPaneActive ? '' : 'Today'"
              :hide-next="isDualPaneActive"
              :hide-out-of-month="isDualPaneActive"
              @prev="prev"
              @next="next"
              @today="handleTodayClick"
              @cycle-view="cycleView"
              @select-month="selectMonth"
              @select-year="selectYear"
              @select-date="handleDateCellClick"
              @hover-cell="onCellHover"
            />
            <CalendarPanel
              v-if="isDualPaneActive"
              :view="view"
              :current-year="rightYear"
              :current-month="rightMonth"
              :year-range-start="yearRangeStart"
              :year-range="yearRange"
              :weeks="rightWeeks"
              hide-prev
              hide-today
              hide-out-of-month
              @next="next"
              @cycle-view="cycleView"
              @select-date="handleDateCellClick"
              @hover-cell="onCellHover"
            />
          </div>
          <div
            v-if="$slots.actions || (props.clearable && (fromDate || toDate))"
            class="flex flex-wrap items-center gap-1 p-2 border-t"
          >
            <slot
              v-if="$slots.actions"
              name="actions"
              v-bind="{
                fromDate,
                toDate,
                setDate: handleDateCellClick,
                clear: handleClearClick,
                close: closePopover,
              }"
            />
            <Button
              v-else-if="props.clearable && (fromDate || toDate)"
              size="sm"
              variant="outline"
              class="ml-auto"
              :label="'Clear'"
              @click="handleClearClick"
            />
          </div>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  PopoverAnchor,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
} from 'reka-ui'
import { Button } from '../Button'
import { TextInput } from '../TextInput'
import LucideChevronDown from '~icons/lucide/chevron-down'
import { usePopoverMotion } from '../../composables/usePopoverMotion'
import { dayjs, dayjsLocal } from '../../utils/dayjs'
import { generateWeeks } from './utils'
import CalendarPanel, { type CalendarPanelCell } from './CalendarPanel.vue'
import {
  useCalendarView,
  usePopoverPositioning,
  useKeepOpen,
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
  DatePickerTriggerSlotProps,
} from './types'

const props = withDefaults(defineProps<DateRangePickerProps>(), {
  value: () => [],
  modelValue: () => [],
  variant: 'subtle',
  placeholder: 'Select range',
  readonly: false,
  allowCustom: true,
  disabled: false,
  clearable: true,
  dualPane: false,
  openOnFocus: true,
  openOnClick: true,
  // Legacy default kept; see `useKeepOpen` for why.
  autoClose: true,
})
const emit = defineEmits<DateRangePickerEmits>()

const slots = defineSlots<DateRangePickerSlots>()

const dp = props as unknown as LegacyDatePickerProps

const textInputRef = ref<{ el: HTMLElement | null } | null>(null)
const anchorEl = computed(() => {
  if (slots.trigger || slots.target) return undefined
  return textInputRef.value?.el ?? undefined
})

// Reka treats anything outside `PopoverContent` as "outside" — including our
// own trigger — so a click on the input fires interact-outside and closes the
// popover, then the click handler reopens it. Suppress the close when the
// pointerdown originated inside the input's row (which holds the input and
// any suffix like the chevron); those elements have their own click logic.
function onInteractOutside(event: Event) {
  const target = event.target as Node | null
  const triggerRow = textInputRef.value?.el?.parentElement
  if (target && triggerRow?.contains(target)) {
    event.preventDefault()
  }
}

// ── Popover open state ───────────────────────────────────────────────────────

const isOpen = ref(false)
const { motion, onPointerDown: recordPointerDown } = usePopoverMotion(isOpen)

watch(
  () => props.open,
  (val) => {
    if (typeof val === 'boolean' && val !== isOpen.value) {
      isOpen.value = val
    }
  },
)

function onPointerDown() {
  recordPointerDown()
}

function togglePopover() {
  isOpen.value = !isOpen.value
}

defineExpose({
  open: () => {
    isOpen.value = true
  },
})

watch(isOpen, (open, wasOpen) => {
  emit('update:open', open)
  if (open && !wasOpen) {
    initFromValue()
  }
  if (!open && wasOpen) {
    handleClose()
  }
})

// ── Positioning / keepOpen / deprecations ────────────────────────────────────

const { resolvedSide, resolvedAlign, resolvedOffset } = usePopoverPositioning(
  props,
  dp,
)
const shouldKeepOpen = useKeepOpen(props, dp)
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
  () => props.minDate,
  () => props.maxDate,
  () => props.isDateUnavailable,
)

const coerceToDayjs = useDateCoercion(() => props.format)

// Reserve trigger width based on the formatted range pattern (e.g.
// `YYYY-MM-DD to YYYY-MM-DD`) so the input stays the same size whether it
// shows the placeholder or a selected range. `ch` scales with the input's
// own font, so the reservation tracks the format prop without hardcoding.
const triggerStyle = computed(() => {
  const fmt = props.format || 'YYYY-MM-DD'
  const chars = fmt.length * 2 + 4 // `<fmt> to <fmt>`
  return { minWidth: `calc(${chars}ch + 3rem)` }
})

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

const triggerSlotProps = computed<DatePickerTriggerSlotProps>(() => ({
  togglePopover,
  isOpen: isOpen.value,
  displayLabel: displayLabel.value,
  inputValue: inputValue.value,
}))

// ── Calendar grid (with range markers) ───────────────────────────────────────

function buildRangeWeeks(year: number, month: number): CalendarPanelCell[][] {
  const raw = generateWeeks(year, month, '')
  const f = fromDate.value ? dayjs(fromDate.value) : null
  const t = toDate.value ? dayjs(toDate.value) : null
  // While picking the end date, the hovered cell and everything between
  // `from` and it render as in-range (light gray) — only committed endpoints
  // get the dark "selected" treatment.
  const hovering = !t && f && hoverDate.value ? hoverDate.value : null
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
        inRange =
          d.date.isAfter(f, 'day') && !d.date.isAfter(hoverEnd, 'day')
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

// ── Input handling ───────────────────────────────────────────────────────────

const popoverContentRef = ref<HTMLElement | null>(null)

function onBlur(e: FocusEvent) {
  const next = e.relatedTarget as Node | null
  if (next && popoverContentRef.value?.contains(next)) return
  commitInput()
  isTyping.value = false
}
function onEnter() {
  commitInput(true)
  isTyping.value = false
}
function onFocus() {
  isTyping.value = true
  if (props.openOnFocus && !isOpen.value) isOpen.value = true
}

function onClick() {
  isTyping.value = true
  if (props.openOnClick && !isOpen.value) isOpen.value = true
}

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

// ── Range selection ──────────────────────────────────────────────────────────

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

function closePopover() {
  isOpen.value = false
}

function handleClose() {
  resetView()
  hoverDate.value = null
  if (isTyping.value) {
    commitInput()
    isTyping.value = false
  }
}
</script>

<style>
[data-slot='content'] {
  animation-fill-mode: both;
}

[data-slot='content'][data-state='open']
  [data-slot='content-body'][data-motion='animated'] {
  animation: datepicker-enter 180ms cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: var(--reka-popover-content-transform-origin);
}

[data-slot='content'][data-state='closed']
  [data-slot='content-body'][data-motion='animated'] {
  animation: datepicker-exit 140ms cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: var(--reka-popover-content-transform-origin);
}

[data-slot='content'][data-state='open']
  [data-slot='content-body'][data-motion='instant'] {
  animation: datepicker-instant-fade 80ms linear;
}
</style>
