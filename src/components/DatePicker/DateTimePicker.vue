<template>
  <PopoverRoot v-model:open="isOpen">
    <PopoverAnchor :reference="anchorEl" as-child>
      <div class="inline-block">
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
      >
        <div
          ref="popoverContentRef"
          data-slot="content-body"
          :data-motion="motion"
          class="w-56 rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5"
        >
          <CalendarPanel
            :view="view"
            :current-year="currentYear"
            :current-month="currentMonth"
            :year-range-start="yearRangeStart"
            :year-range="yearRange"
            :weeks="weeks"
            today-label="Now"
            @prev="prev"
            @next="next"
            @today="handleNowClick"
            @cycle-view="cycleView"
            @select-month="selectMonth"
            @select-year="selectYear"
            @select-date="handleDateCellClick"
          />
          <div class="flex flex-col gap-2 p-2 pt-0">
            <TimePicker
              :modelValue="timeValue"
              :readonly="props.allowCustomTime === false"
              side="bottom"
              align="start"
              placeholder="Select time"
              :minTime="computedMinTime"
              :maxTime="computedMaxTime"
              @change="onTimeChange"
            />
          </div>
          <div
            v-if="$slots.actions || (props.clearable && selectedDate)"
            class="flex flex-wrap items-center gap-1 p-2 border-t"
          >
            <slot
              v-if="$slots.actions"
              name="actions"
              v-bind="{
                selected: selectedDate,
                time: timeValue,
                setDate: handleDateCellClick,
                clear: handleClearClick,
                close: closePopover,
              }"
            />
            <Button
              v-else-if="props.clearable && selectedDate"
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
import TimePicker from '../TimePicker/TimePicker.vue'
import LucideChevronDown from '~icons/lucide/chevron-down'
import { usePopoverMotion } from '../../composables/usePopoverMotion'
import { dayjs, dayjsLocal, dayjsSystem } from '../../utils/dayjs'
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
  DateTimePickerProps,
  DateTimePickerEmits,
  DateTimePickerSlots,
  DatePickerTriggerSlotProps,
} from './types'

const props = withDefaults(defineProps<DateTimePickerProps>(), {
  value: '',
  modelValue: '',
  variant: 'subtle',
  placeholder: 'Select date & time',
  readonly: false,
  allowCustom: true,
  disabled: false,
  clearable: true,
  allowCustomTime: true,
  // Legacy default kept; see `useKeepOpen` for why.
  autoClose: true,
})
const emit = defineEmits<DateTimePickerEmits>()

const slots = defineSlots<DateTimePickerSlots>()

const dp = props as unknown as LegacyDatePickerProps

const textInputRef = ref<{ el: HTMLElement | null } | null>(null)
const anchorEl = computed(() => {
  if (slots.trigger || slots.target) return undefined
  return textInputRef.value?.el ?? undefined
})

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

let justClosed = false

function onPointerDown() {
  recordPointerDown()
  justClosed = false
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
    justClosed = false
    initFromValue()
  }
  if (!open && wasOpen) {
    justClosed = true
    handleClose()
  }
})

// ── Positioning / keepOpen / deprecations ────────────────────────────────────

const { resolvedSide, resolvedAlign, resolvedOffset } = usePopoverPositioning(
  props,
  dp,
)
const shouldKeepOpen = useKeepOpen(props, dp)
useDeprecationWarnings('DateTimePicker', dp, {
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
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

const selectedDate = ref<string>('')
const timeValue = ref<string>('')

const initialValue = ref(props.modelValue || props.value || '')

const coerceToDayjs = useDateCoercion(() => props.format)

// ── Constraints ──────────────────────────────────────────────────────────────

const minDT = computed<Dayjs | null>(() =>
  props.minDateTime ? coerceToDayjs(props.minDateTime) : null,
)
const maxDT = computed<Dayjs | null>(() =>
  props.maxDateTime ? coerceToDayjs(props.maxDateTime) : null,
)

const baseCheckUnavailable = makeUnavailableCheck(
  () => props.minDate,
  () => props.maxDate,
  () => props.isDateUnavailable,
)

function checkUnavailable(d: Dayjs): boolean {
  if (baseCheckUnavailable(d)) return true
  if (minDT.value && d.endOf('day').isBefore(minDT.value)) return true
  if (maxDT.value && d.startOf('day').isAfter(maxDT.value)) return true
  return false
}

// ── Value sync ───────────────────────────────────────────────────────────────

function syncFromValue(val?: string): void {
  if (!val) {
    if (!props.clearable) {
      const now = dayjsLocal()
      focusOn(now)
      selectedDate.value = now.format(DATE_FORMAT)
      timeValue.value = now.format('HH:mm:ss')
    } else {
      selectedDate.value = ''
      timeValue.value = ''
    }
    return
  }
  const d = coerceToDayjs(val)
  if (!d) {
    selectedDate.value = ''
    timeValue.value = ''
    return
  }
  focusOn(d)
  selectedDate.value = d.format(DATE_FORMAT)
  timeValue.value = d.format('HH:mm:ss')
}

syncFromValue(initialValue.value)

function initFromValue(): void {
  syncFromValue(props.modelValue || props.value)
}

watch(
  () => [props.modelValue, props.value],
  ([m, v]) => {
    syncFromValue(m || v)
  },
)

// ── Display ──────────────────────────────────────────────────────────────────

const combinedValue = computed<string>(() => {
  if (!selectedDate.value) return ''
  const base = `${selectedDate.value} ${timeValue.value || '00:00:00'}`
  const local = dayjs(base)
  if (!local.isValid()) return ''
  return local.format(DATE_TIME_FORMAT)
})

const displayLabel = computed<string>(() => {
  if (!combinedValue.value) return ''
  if (props.format) return dayjs(combinedValue.value).format(props.format)
  return combinedValue.value
})

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

// ── Calendar grid ────────────────────────────────────────────────────────────

const weeks = computed<CalendarPanelCell[][]>(() =>
  generateWeeks(currentYear.value, currentMonth.value, selectedDate.value).map(
    (week) =>
      week.map((d) => ({
        ...d,
        isUnavailable: checkUnavailable(d.date),
      })),
  ),
)

const computedMinTime = computed<string>(() => {
  if (!minDT.value || !selectedDate.value) return ''
  if (dayjs(selectedDate.value).isSame(minDT.value, 'day'))
    return minDT.value.format('HH:mm:ss')
  return ''
})
const computedMaxTime = computed<string>(() => {
  if (!maxDT.value || !selectedDate.value) return ''
  if (dayjs(selectedDate.value).isSame(maxDT.value, 'day'))
    return maxDT.value.format('HH:mm:ss')
  return ''
})

watch([computedMinTime, computedMaxTime, timeValue, selectedDate], () => {
  if (!selectedDate.value || !timeValue.value) return
  const cur = dayjs(`${selectedDate.value} ${timeValue.value}`)
  if (minDT.value && cur.isBefore(minDT.value))
    timeValue.value = computedMinTime.value || timeValue.value
  if (maxDT.value && cur.isAfter(maxDT.value))
    timeValue.value = computedMaxTime.value || timeValue.value
})

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
  if (justClosed) {
    justClosed = false
    return
  }
  isTyping.value = true
  if (!isOpen.value) isOpen.value = true
}

function onClick() {
  isTyping.value = true
  if (!isOpen.value) isOpen.value = true
}

function commitInput(close = false): void {
  const raw = inputValue.value.trim()
  if (!raw) {
    if (!props.clearable) {
      const now = dayjsLocal()
      selectDate(now)
      timeValue.value = now.format('HH:mm:ss')
      emitChange()
    } else {
      clearSelection()
    }
    if (close && !shouldKeepOpen.value) isOpen.value = false
    return
  }
  const parsed = coerceToDayjs(raw)
  if (parsed && !checkUnavailable(parsed)) {
    selectDate(parsed)
    timeValue.value = parsed.format('HH:mm:ss')
    emitChange()
    if (close && !shouldKeepOpen.value) isOpen.value = false
  } else {
    inputValue.value = displayLabel.value
  }
}

// ── Date selection ───────────────────────────────────────────────────────────

function selectDate(date: string | Date | Dayjs): void {
  const d = dayjs(date as any)
  if (!d.isValid() || checkUnavailable(d)) return
  selectedDate.value = d.format(DATE_FORMAT)
  focusOn(d)
}

function handleDateCellClick(date: string | Date | Dayjs) {
  selectDate(date)
  emitChange()
  if (!shouldKeepOpen.value) isOpen.value = false
  isTyping.value = false
  resetView()
}

function onTimeChange(val: string) {
  timeValue.value = val
  isTyping.value = false
  if (selectedDate.value) emitChange()
}

function emitChange() {
  if (!selectedDate.value) {
    clearSelection()
    return
  }

  const localDateTime = combinedValue.value
  const systemDateTime = dayjsSystem(localDateTime).format(DATE_TIME_FORMAT)

  if (systemDateTime !== initialValue.value) {
    emit('update:modelValue', systemDateTime)
    emit('change', systemDateTime)
    initialValue.value = systemDateTime
  }

  if (!isTyping.value) inputValue.value = displayLabel.value
}

function clearSelection() {
  if (!selectedDate.value && !timeValue.value) return
  selectedDate.value = ''
  timeValue.value = ''
  emit('update:modelValue', '')
  emit('change', '')
  initialValue.value = ''
  inputValue.value = ''
}

function handleNowClick() {
  const now = dayjsLocal()
  selectDate(now)
  timeValue.value = now.format('HH:mm:ss')
  emitChange()
  if (!shouldKeepOpen.value) isOpen.value = false
  isTyping.value = false
}

function handleClearClick() {
  clearSelection()
  if (!shouldKeepOpen.value) isOpen.value = false
  isTyping.value = false
  resetView()
}

function closePopover() {
  isOpen.value = false
}

function handleClose() {
  resetView()
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
