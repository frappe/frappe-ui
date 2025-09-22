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
        <div class="p-2">
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
// @ts-ignore - Vue SFC without explicit types
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

const view = ref<ViewMode>('date')
const currentYear = ref<number>(dayjs().year())
const currentMonth = ref<number>(dayjs().month()) // 0-index
const DATE_FORMAT = 'YYYY-MM-DD'

const selected = ref<string>('')
const initialValue = ref(props.modelValue || props.value || '')

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

function syncFromValue(val?: string): void {
  if (!val) {
    if (!props.clearable) {
      const today = dayjsLocal()
      currentYear.value = today.year()
      currentMonth.value = today.month()
      selected.value = today.format(DATE_FORMAT)
    } else {
      selected.value = ''
    }
    return
  }
  const d = coerceToDayjs(val)
  if (!d) {
    selected.value = ''
    return
  }
  currentYear.value = d.year()
  currentMonth.value = d.month()
  selected.value = d.format(DATE_FORMAT)
}

syncFromValue(initialValue.value)

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

const inputValue = ref<string>(displayLabel.value)
const isTyping = ref(false)

watch(displayLabel, (val) => {
  if (!isTyping.value) inputValue.value = val
})

function maybeClose(togglePopover?: () => void, condition = true) {
  if (condition && autoClose.value && togglePopover) togglePopover()
}

function clearSelection() {
  if (!selected.value) return
  selected.value = ''
  emit('update:modelValue', '')
  emit('change', '')
  initialValue.value = ''
  inputValue.value = ''
}

function commitInput(close = false, togglePopover?: () => void): void {
  const raw = inputValue.value.trim()
  if (!raw) {
    if (!props.clearable) {
      selectDate(dayjsLocal())
      maybeClose(togglePopover, close)
    } else {
      clearSelection()
      maybeClose(togglePopover, close)
    }
    return
  }
  const d = coerceToDayjs(raw)
  if (d) {
    selectDate(d)
    maybeClose(togglePopover, close)
  }
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

  if (selected.value !== initialValue.value) {
    emit('update:modelValue', selected.value)
    if (selected.value !== prev) emit('change', selected.value)
    initialValue.value = selected.value
  }

  // Reflect new value in input immediately if not typing
  if (!isTyping.value) {
    inputValue.value = props.format
      ? formatter(selected.value, props.format)
      : selected.value
  }
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
function handleDateCellClick(
  date: string | Date | Dayjs,
  togglePopover: () => void,
) {
  selectDate(date)
  if (autoClose.value) togglePopover()
  isTyping.value = false
}

function selectOffset(days = 0, togglePopover: () => void) {
  handleDateCellClick(dayjsLocal().add(days, 'day'), togglePopover)
}
function handleTodayClick(togglePopover: () => void) {
  selectOffset(0, togglePopover)
}
function handleTomorrowClick(togglePopover: () => void) {
  selectOffset(1, togglePopover)
}

function handleClearClick(togglePopover: () => void) {
  clearSelection()
  maybeClose(togglePopover)
  isTyping.value = false
  view.value = 'date'
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
</script>
