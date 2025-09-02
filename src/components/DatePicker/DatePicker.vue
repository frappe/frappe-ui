<template>
  <Popover
    class="inline-block"
    :placement="placement"
    @open="initFromValue"
    @close="handleClose"
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
          @focus="onFocusInput(isOpen, togglePopover)"
          @click="onClickInput(isOpen, togglePopover)"
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
        <!-- Navigation / Label -->
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
            <span v-else>
              {{ yearRangeStart }} - {{ yearRangeStart + 11 }}
            </span>
          </Button>
          <div class="flex items-center">
            <Button
              variant="ghost"
              icon="chevron-left"
              class="size-7"
              @click="prev"
            />
            <Button
              v-if="!clearable"
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
        <!-- Views -->
        <div class="p-2">
          <!-- Date grid -->
          <div v-if="view === 'date'" role="grid" aria-label="Calendar dates">
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
                  dateObj.isSelected
                    ? 'bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6'
                    : 'hover:bg-surface-gray-2',
                ]"
                role="gridcell"
                :aria-selected="dateObj.isSelected ? 'true' : 'false'"
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
          <!-- Month grid -->
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
          <!-- Year grid -->
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
        <!-- Footer actions -->
        <div
          v-if="props.clearable"
          class="flex items-center justify-between gap-1 p-2 border-t"
        >
          <div class="flex gap-1">
            <Button
              variant="outline"
              :label="'Today'"
              @click="() => handleTodayClick(togglePopover)"
            />
            <Button
              variant="outline"
              :label="'Tomorrow'"
              @click="() => handleTomorrowClick(togglePopover)"
            />
          </div>
          <Button
            v-if="selected"
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
import FeatherIcon from '../FeatherIcon.vue'
import { dayjs, dayjsLocal } from '../../utils/dayjs'
import { months, monthStart, generateWeeks, getDateValue } from './utils'
import type { Dayjs } from 'dayjs/esm'
import type {
  DatePickerProps,
  DatePickerEmits,
  DatePickerViewMode as ViewMode,
  DatePickerDateObj as DateObj,
} from './types'

// Props & Emits
const props = withDefaults(defineProps<DatePickerProps>(), {
  value: '',
  modelValue: '',
  placement: 'bottom-start',
  variant: 'subtle',
  placeholder: 'Select date',
  readonly: false,
  allowCustom: true,
  autoClose: true,
  disabled: false,
  clearable: true,
})
const emit = defineEmits<DatePickerEmits>()

const { autoClose } = toRefs(props)

// State
const view = ref<ViewMode>('date')
const currentYear = ref<number>(dayjs().year())
const currentMonth = ref<number>(dayjs().month()) // 0-index
const DATE_FORMAT = 'YYYY-MM-DD'

// Internal selected date is always stored in DATE_FORMAT
const selected = ref<string>('')
const initialValue = props.modelValue || props.value || ''

if (initialValue) {
  if (props.format) {
    const _d = dayjs(initialValue, props.format, true)
    if (_d.isValid()) {
      selected.value = _d.format(DATE_FORMAT)
    } else {
      // fallback attempt generic parse
      const d1 = dayjs(initialValue)
      if (d1.isValid()) selected.value = d1.format(DATE_FORMAT)
      else selected.value = initialValue // keep raw (will show as-is)
    }
  } else {
    const d = dayjs(initialValue)
    if (d.isValid()) selected.value = d.format(DATE_FORMAT)
    else selected.value = initialValue
  }
} else {
  selected.value = ''
}

function syncFromValue(val?: string): void {
  let d: Dayjs | null = null

  if (!val) {
    if (!props.clearable) {
      d = dayjsLocal()
    } else {
      selected.value = ''
      return
    }
  }

  if (props.format) {
    const _d = dayjs(val, props.format, true)
    if (_d.isValid()) d = _d
  }

  if (!d) {
    const _d = dayjs(val)
    if (_d.isValid()) d = _d
  }

  if (!d) {
    selected.value = ''
    return
  }

  currentYear.value = d.year()
  currentMonth.value = d.month()
  selected.value = d.format(DATE_FORMAT)
}

function initFromValue(): void {
  syncFromValue(props.modelValue || props.value)
}

watch(
  () => [props.modelValue, props.value],
  ([m, v]) => {
    const val = m || v
    syncFromValue(val)
  },
)

const displayLabel = computed<string>(() =>
  props.format ? formatter(selected.value, props.format) : selected.value,
)

function formatter(dateStr: string, format: string): string {
  const d = dayjs(dateStr)
  if (!d.isValid()) return dateStr
  return d.format(format)
}

// Manual input support
const inputValue = ref<string>(displayLabel.value)
const isTyping = ref(false)

watch(displayLabel, (val) => {
  // update input only if not actively typing
  if (!isTyping.value) inputValue.value = val
})

function parseInput(val: string): Dayjs | null {
  if (!val) return null
  const raw = val.trim()
  const format = props.format || DATE_FORMAT
  let d: Dayjs | null = null

  // Strictly parse using provided format (raw is already in props.format)
  d = dayjs(raw, format, true)
  if (d.isValid()) return d

  // Fallback: use getDateValue to normalize arbitrary input to YYYY-MM-DD (if dayjs can parse it)
  const normalized = getDateValue(raw)
  if (normalized) {
    d = dayjs(normalized)
    if (d.isValid()) return d
  }

  return null
}

function commitInput(close = false, togglePopover?: () => void): void {
  const raw = inputValue.value.trim()

  if (!raw) {
    if (!props.clearable) {
      // Force today
      selectDate(dayjsLocal())
      if (close && autoClose.value && togglePopover) togglePopover()
    } else {
      if (selected.value) {
        selected.value = ''
        emit('update:modelValue', '')
        emit('change', '')
      }
      if (close && autoClose.value && togglePopover) togglePopover()
    }
    return
  }

  const d = parseInput(raw)
  if (d) {
    selectDate(d)
    if (close && autoClose.value && togglePopover) togglePopover()
  }
}

// Ref to popover content for focus containment checks
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
function ensureOpen(isOpen: boolean | undefined, togglePopover: () => void) {
  if (!isOpen) togglePopover()
}
function onFocusInput(isOpen: boolean | undefined, togglePopover: () => void) {
  isTyping.value = true
  ensureOpen(isOpen, togglePopover)
}
function onClickInput(isOpen: boolean | undefined, togglePopover: () => void) {
  isTyping.value = true
  ensureOpen(isOpen, togglePopover)
}
const weeks = computed<DateObj[][]>(() =>
  generateWeeks(currentYear.value, currentMonth.value, selected.value),
)

function selectDate(date: string | Date | Dayjs): void {
  const d = dayjs(date as any)
  if (!d.isValid()) return
  const prev = selected.value
  selected.value = d.format(DATE_FORMAT)
  currentYear.value = d.year()
  currentMonth.value = d.month()
  emit('update:modelValue', selected.value)
  if (selected.value !== prev) emit('change', selected.value)
  else
    inputValue.value = props.format
      ? formatter(selected.value, props.format)
      : selected.value
  view.value = 'date'
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
    yearRangeStart.value -= 12
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
    yearRangeStart.value += 12
  }
}
function handleDateCellClick(
  date: string | Date | Dayjs,
  togglePopover: () => void,
) {
  selectDate(date)
  if (autoClose.value) togglePopover()
  isTyping.value = false
}

function handleTodayClick(togglePopover: () => void) {
  handleDateCellClick(dayjsLocal(), togglePopover)
}

function handleTomorrowClick(togglePopover: () => void) {
  handleDateCellClick(dayjsLocal().add(1, 'day'), togglePopover)
}

function handleClearClick(togglePopover: () => void) {
  if (selected.value) {
    selected.value = ''
    emit('update:modelValue', '')
    emit('change', '')
    inputValue.value = ''
  }
  if (autoClose.value) togglePopover()
  isTyping.value = false

  view.value = 'date'
}

function cycleView(): void {
  if (view.value === 'date') view.value = 'month'
  else if (view.value === 'month') view.value = 'year'
  else view.value = 'date'
}

function handleClose() {
  // Reset view
  view.value = 'date'
  // If user was typing and popover closed (click outside / escape), commit pending input
  if (isTyping.value) {
    commitInput()
    isTyping.value = false
  }
}

const yearRangeStart = ref<number>(currentYear.value - (currentYear.value % 12))
const yearRange = computed<number[]>(() =>
  Array.from({ length: 12 }, (_, i) => yearRangeStart.value + i),
)
watch(currentYear, (y) => {
  if (y < yearRangeStart.value || y > yearRangeStart.value + 11)
    yearRangeStart.value = y - (y % 12)
})
</script>
