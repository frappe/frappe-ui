<template>
  <Popover
    class="inline-block"
    :placement="placement"
    @open="initFromValue"
    @close="handleClose"
    ref="popoverRef"
  >
    <template #target="{ togglePopover, isOpen }">
      <slot
        name="target"
        v-bind="{ togglePopover, isOpen, displayLabel, inputValue }"
      >
        <TextInput
          v-model="inputValue"
          type="text"
          class="cursor-text w-full"
          :class="props.inputClass"
          :label="props.label"
          :variant="props.variant"
          :placeholder="props.placeholder"
          :disabled="props.disabled"
          :readonly="props.readonly || !props.allowCustom"
          @focus="activateInput(isOpen, togglePopover)"
          @click="activateInput(isOpen, togglePopover)"
          @blur="onBlur"
          @keydown.enter.prevent="onEnter(togglePopover)"
        >
          <template v-if="$slots.prefix" #prefix>
            <slot
              name="prefix"
              v-bind="{ togglePopover, isOpen, displayLabel, inputValue }"
            />
          </template>
          <template #suffix>
            <slot
              name="suffix"
              v-bind="{ togglePopover, isOpen, displayLabel, inputValue }"
            >
              <FeatherIcon
                name="chevron-down"
                class="h-4 w-4 cursor-pointer"
                @mousedown.prevent="togglePopover"
              />
            </slot>
          </template>
        </TextInput>
      </slot>
    </template>
    <template #body="{ togglePopover }">
      <div
        ref="popoverContentRef"
        class="w-fit min-w-60 select-none text-base text-ink-gray-9 rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5 mt-2"
      >
        <!-- Header / Navigation -->
        <div class="flex items-center justify-between p-2 pb-0 gap-1">
          <Button
            variant="ghost"
            size="sm"
            class="text-sm font-medium text-ink-gray-7"
            @click="cycleView"
          >
            <span v-if="view === 'date'">
              {{ months[currentMonth] }} {{ currentYear }}
            </span>
            <span v-else-if="view === 'month'">{{ currentYear }}</span>
            <span v-else>{{ yearRangeStart }} - {{ yearRangeStart + 11 }}</span>
          </Button>
          <div class="flex items-center">
            <Button
              variant="ghost"
              icon="chevron-left"
              class="size-7"
              @click="prev"
            />
            <Button
              variant="ghost"
              class="text-xs"
              :label="'Today'"
              @click="() => handleTodayClick(togglePopover)"
            />
            <Button
              variant="ghost"
              icon="chevron-right"
              class="size-7"
              @click="next"
            />
          </div>
        </div>
        <!-- Content -->
        <div class="p-2">
          <!-- Date Grid -->
          <div v-if="view === 'date'">
            <div
              class="flex items-center text-xs font-medium uppercase text-ink-gray-4 mb-1"
            >
              <div
                v-for="d in ['S', 'M', 'T', 'W', 'T', 'F', 'S']"
                :key="d"
                class="flex h-6 w-8 items-center justify-center"
              >
                {{ d }}
              </div>
            </div>
            <div v-for="(week, wi) in weeks" :key="wi" class="flex" role="row">
              <button
                v-for="dateObj in week"
                type="button"
                :key="dateObj.key"
                class="flex h-8 w-8 items-center justify-center rounded cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-outline-gray-2"
                :class="[
                  dateObj.inMonth ? 'text-ink-gray-8' : 'text-ink-gray-3',
                  dateObj.isToday ? 'font-extrabold text-ink-gray-9' : '',
                  dateObj.isRangeStart || dateObj.isRangeEnd
                    ? 'bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6'
                    : dateObj.inRange
                      ? 'bg-surface-gray-3 rounded-none'
                      : 'hover:bg-surface-gray-2',
                  dateObj.isRangeStart && !dateObj.isRangeEnd
                    ? 'rounded-l-md rounded-r-none'
                    : '',
                  dateObj.isRangeEnd && !dateObj.isRangeStart
                    ? 'rounded-r-md rounded-l-none'
                    : '',
                  dateObj.isRangeStart && dateObj.isRangeEnd
                    ? 'rounded-md'
                    : '',
                ]"
                role="gridcell"
                :aria-selected="
                  dateObj.isRangeStart || dateObj.isRangeEnd ? 'true' : 'false'
                "
                :aria-label="
                  dateObj.date.format('YYYY-MM-DD') +
                  (dateObj.isToday ? ' (Today)' : '')
                "
                @click="handleDateCellClick(dateObj.date, togglePopover)"
              >
                {{ dateObj.date.date() }}
              </button>
            </div>
          </div>
          <!-- Month Grid -->
          <div
            v-else-if="view === 'month'"
            class="grid grid-cols-3 gap-1"
            role="grid"
            aria-label="Select month"
          >
            <button
              v-for="(m, i) in months"
              type="button"
              :key="m"
              class="py-2 text-sm rounded cursor-pointer text-center hover:bg-surface-gray-2 focus:outline-none focus:ring-2 focus:ring-brand-6"
              :class="{
                'bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6':
                  i === currentMonth,
              }"
              :aria-selected="i === currentMonth ? 'true' : 'false'"
              @click="selectMonth(i)"
            >
              {{ m.slice(0, 3) }}
            </button>
          </div>
          <!-- Year Grid -->
          <div
            v-else
            class="grid grid-cols-3 gap-1"
            role="grid"
            aria-label="Select year"
          >
            <button
              v-for="y in yearRange"
              type="button"
              :key="y"
              class="py-2 text-sm rounded cursor-pointer text-center hover:bg-surface-gray-2 focus:outline-none focus:ring-2 focus:ring-brand-6"
              :class="{
                'bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6':
                  y === currentYear,
              }"
              :aria-selected="y === currentYear ? 'true' : 'false'"
              @click="selectYear(y)"
            >
              {{ y }}
            </button>
          </div>
        </div>
        <div
          v-if="fromDate && toDate"
          class="flex justify-end gap-1 p-2 border-t"
        >
          <Button
            size="sm"
            variant="outline"
            :label="'Clear'"
            @click="() => handleClearClick(togglePopover)"
          />
        </div>
      </div>
    </template>
  </Popover>
</template>

<script setup lang="ts">
import { ref, computed, watch, toRefs } from 'vue'
import { Popover } from '../Popover'
import { Button } from '../Button'
import { TextInput } from '../TextInput'
// @ts-ignore - Vue SFC without explicit types
import FeatherIcon from '../FeatherIcon.vue'
import { dayjs, dayjsLocal } from '../../utils/dayjs'
import { months, monthStart, generateWeeks, getDateValue } from './utils'
import type { Dayjs } from 'dayjs/esm'
import type {
  DatePickerEmits,
  DateRangePickerProps,
  DatePickerViewMode as ViewMode,
} from './types'

const props = withDefaults(defineProps<DateRangePickerProps>(), {
  value: '',
  modelValue: '',
  placement: 'bottom-start',
  variant: 'subtle',
  placeholder: 'Select range',
  readonly: false,
  allowCustom: true,
  autoClose: true,
  disabled: false,
})
const emit = defineEmits<DatePickerEmits>()

const { autoClose } = toRefs(props)

const view = ref<ViewMode>('date')
const currentYear = ref<number>(dayjs().year())
const currentMonth = ref<number>(dayjs().month()) // 0-index
const DATE_FORMAT = 'YYYY-MM-DD'

const fromDate = ref<string>('')
const toDate = ref<string>('')
// Track whether user typed
const isTyping = ref(false)
const inputValue = ref('')

// Display label helpers (placed early so functions below can use them safely)
function formatDisplay(from: string, to: string): string {
  if (!from && !to) return ''
  if (from && !to) return formatOne(from)
  return `${formatOne(from)} to ${formatOne(to)}`
}
function formatOne(dateStr: string): string {
  if (!dateStr) return ''
  const d = dayjs(dateStr)
  if (!d.isValid()) return dateStr
  return props.format ? d.format(props.format) : dateStr
}
const displayLabel = computed<string>(() =>
  formatDisplay(fromDate.value, toDate.value),
)

function coerceToDayjs(val?: string | null): Dayjs | null {
  if (!val) return null
  const raw = String(val).trim()
  if (!raw) return null
  if (props.format) {
    const dStrict = dayjs(raw, props.format, true)
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

function normalizeIncoming(val?: string | string[] | null) {
  if (!val) return ['', '']
  let parts: string[] = []
  if (Array.isArray(val)) parts = val
  else if (typeof val === 'string') {
    const cleaned = val.replace(/ to /i, ',').replace(/ - /g, ',')
    parts = cleaned
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
  }
  const from = coerceToDayjs(parts[0] || '')
  const to = coerceToDayjs(parts[1] || '')
  return [from?.format(DATE_FORMAT) || '', to?.format(DATE_FORMAT) || '']
}

function syncFromValue(val?: string | string[]) {
  const [f, t] = normalizeIncoming(val as any)
  fromDate.value = f
  toDate.value = t
  if (f) {
    const d = dayjs(f)
    currentYear.value = d.year()
    currentMonth.value = d.month()
  }
  // reflect in input if not typing
  if (!isTyping.value) updateInputValue()
}

const initialValue = props.modelValue || props.value || ''
syncFromValue(initialValue as any)

function initFromValue(): void {
  syncFromValue(props.modelValue || props.value || '')
}

watch(
  () => [props.modelValue, props.value],
  ([m, v]) => {
    const val = (m || v) as any
    syncFromValue(val)
  },
)

function updateInputValue() {
  inputValue.value = displayLabel.value
}
updateInputValue()

watch(displayLabel, (val) => {
  if (!isTyping.value) inputValue.value = val
})

function parseRangeInput(raw: string): [Dayjs | null, Dayjs | null] {
  if (!raw.trim()) return [null, null]
  let normalized = raw.replace(/\s+to\s+/i, ',').replace(/\s+-\s+/g, ',')
  const parts = normalized
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
  if (!parts.length) return [null, null]
  const first = coerceToDayjs(parts[0])
  const second = coerceToDayjs(parts[1])
  return [first, second]
}

function maybeClose(togglePopover?: () => void, condition = true) {
  if (condition && autoClose.value && togglePopover) togglePopover()
}

function commitInput(close = false, togglePopover?: () => void) {
  const raw = inputValue.value.trim()
  if (!raw) {
    clearSelection()
    maybeClose(togglePopover, close)
    return
  }
  const [f, t] = parseRangeInput(raw)
  if (f) fromDate.value = f.format(DATE_FORMAT)
  if (t) toDate.value = t.format(DATE_FORMAT)
  if (!t) toDate.value = ''
  ensureOrder()
  emitIfComplete()
  updateInputValue()
  maybeClose(togglePopover, close && !!fromDate.value && !!toDate.value)
}

const popoverContentRef = ref<HTMLElement | null>(null)

function onBlur(e: FocusEvent) {
  const next = e.relatedTarget as Node | null
  if (next && popoverContentRef.value?.contains(next)) return
  commitInput()
  isTyping.value = false
}
function onEnter(togglePopover: () => void) {
  commitInput(true, togglePopover)
  isTyping.value = false
}
function activateInput(isOpen: boolean | undefined, togglePopover: () => void) {
  isTyping.value = true
  if (!isOpen) togglePopover()
}

// Weeks with range annotations
interface RangeDateObj {
  date: Dayjs
  key: string
  inMonth: boolean
  isToday: boolean
  isRangeStart: boolean
  isRangeEnd: boolean
  inRange: boolean
}

const weeks = computed<RangeDateObj[][]>(() => {
  const raw = generateWeeks(currentYear.value, currentMonth.value, '')
  const f = dayjs(fromDate.value)
  const t = dayjs(toDate.value)
  return raw.map((week) =>
    week.map((d) => {
      const isRangeStart = f.isValid() && d.date.isSame(f, 'day')
      const isRangeEnd = t.isValid() && d.date.isSame(t, 'day')
      const inRange =
        f.isValid() &&
        t.isValid() &&
        d.date.isAfter(f, 'day') &&
        d.date.isBefore(t, 'day')
      return {
        date: d.date,
        key: d.key,
        inMonth: d.inMonth,
        isToday: d.isToday,
        isRangeStart,
        isRangeEnd,
        inRange,
      }
    }),
  )
})

function selectDate(date: string | Date | Dayjs): void {
  const d = dayjs(date as any)
  if (!d.isValid()) return
  if (fromDate.value && toDate.value) {
    fromDate.value = d.format(DATE_FORMAT)
    toDate.value = ''
  } else if (fromDate.value && !toDate.value) {
    toDate.value = d.format(DATE_FORMAT)
  } else {
    fromDate.value = d.format(DATE_FORMAT)
  }
  ensureOrder()
  updateInputValue()
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

function handleDateCellClick(
  date: string | Date | Dayjs,
  togglePopover: () => void,
) {
  selectDate(date)
  if (autoClose.value && fromDate.value && toDate.value) {
    emitIfComplete()
    maybeClose(togglePopover, true)
  }
  isTyping.value = false
}

function emitIfComplete() {
  if (fromDate.value && toDate.value) {
    const val = `${fromDate.value},${toDate.value}`
    emit('update:modelValue', val)
    emit('change', val)
  }
  if (!fromDate.value && !toDate.value) {
    emit('update:modelValue', '')
    emit('change', '')
  }
}

function clearSelection() {
  fromDate.value = ''
  toDate.value = ''
  emitIfComplete()
  updateInputValue()
}
function handleClearClick(togglePopover: () => void) {
  clearSelection()
  maybeClose(togglePopover)
  isTyping.value = false
  view.value = 'date'
}
// Backwards compatibility helper (maps to preset)
function handleTodayClick(togglePopover?: () => void) {
  const now = dayjsLocal().startOf('day')
  fromDate.value = now.format(DATE_FORMAT)
  toDate.value = now.format(DATE_FORMAT)
  emitIfComplete()
  updateInputValue()
  if (autoClose.value && togglePopover) togglePopover()
  view.value = 'date'
  isTyping.value = false
}

function selectMonth(i: number): void {
  currentMonth.value = i
  view.value = 'date'
}
function selectYear(y: number): void {
  currentYear.value = y
  view.value = 'month'
}
function prev(): void {
  if (view.value === 'date') {
    const m = monthStart(currentYear.value, currentMonth.value).subtract(
      1,
      'month',
    )
    currentYear.value = m.year()
    currentMonth.value = m.month()
  } else if (view.value === 'month') {
    currentYear.value -= 1
  } else {
    currentYear.value -= 12
  }
}
function next(): void {
  if (view.value === 'date') {
    const m = monthStart(currentYear.value, currentMonth.value).add(1, 'month')
    currentYear.value = m.year()
    currentMonth.value = m.month()
  } else if (view.value === 'month') {
    currentYear.value += 1
  } else {
    currentYear.value += 12
  }
}
function cycleView(): void {
  if (view.value === 'date') view.value = 'month'
  else if (view.value === 'month') view.value = 'year'
  else view.value = 'date'
}
function handleClose() {
  view.value = 'date'
  if (isTyping.value) {
    commitInput()
    isTyping.value = false
  }
}

const yearRangeStart = computed(
  () => currentYear.value - (currentYear.value % 12),
)
const yearRange = computed<number[]>(() =>
  Array.from({ length: 12 }, (_, i) => yearRangeStart.value + i),
)

defineExpose({
  open: () => popoverRef.value?.open(),
})

// Popover ref for external open
const popoverRef = ref<InstanceType<typeof Popover> | null>(null)
</script>
