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
    :display-label="displayLabel"
    @blur="commitInput()"
    @enter="commitInput(true)"
    @open="onShellOpen"
    @close="onShellClose"
    @request-focus="onShellRequestFocus"
  >
    <template v-if="$slots.trigger" #trigger="ts"
      ><slot name="trigger" v-bind="ts"
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
        :class="
          $slots.actions ? 'w-fit divide-x divide-outline-gray-2' : 'w-56'
        "
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
              selected: selectedDate,
              time: timeValue,
              setDate: handleDateCellClick,
              clear: handleClearClick,
              close,
            }"
          />
        </aside>
        <div class="flex flex-col">
          <DateCalendar
            ref="calendarRef"
            :model-value="selectedDate"
            today-label="Now"
            :min="resolvedMin"
            :max="resolvedMax"
            :is-date-unavailable="props.isDateUnavailable"
            @select="handleDateCellClick"
            @today="handleNowClick"
          />
          <div class="flex flex-col gap-2 p-2 pt-0">
            <TimePicker
              ref="timePickerRef"
              :modelValue="timeValue"
              :typeable="props.allowCustomTime"
              side="bottom"
              align="start"
              placeholder="Select time"
              :min="computedMinTime"
              :max="computedMaxTime"
              @change="onTimeChange"
            />
          </div>
        </div>
      </div>
    </template>
  </PickerShell>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import TimePicker from '../TimePicker/TimePicker.vue'
import { dayjs, dayjsLocal, dayjsSystem } from '../../utils/dayjs'
import DateCalendar from './DateCalendar.vue'
import PickerShell from '../shared/picker/PickerShell.vue'
import {
  usePopoverPositioning,
  useKeepOpen,
  useTypeable,
  useDateCoercion,
} from './composables'
import type { Dayjs } from 'dayjs/esm'
import type {
  DateTimePickerProps,
  DateTimePickerEmits,
  DateTimePickerSlots,
} from './types'
import type { DateCalendarExposed } from './calendarTypes'

const props = withDefaults(defineProps<DateTimePickerProps>(), {
  modelValue: '',
  variant: 'subtle',
  placeholder: 'Select date & time',
  typeable: true,
  disabled: false,
  clearable: true,
  allowCustomTime: true,
  openOnFocus: false,
  openOnClick: true,
})
const emit = defineEmits<DateTimePickerEmits>()

defineSlots<DateTimePickerSlots>()

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
}

function onShellClose() {
  if (isTyping.value) {
    commitInput()
    isTyping.value = false
  }
}

defineExpose({
  open: () => shellRef.value?.open(),
})

const calendarRef = ref<DateCalendarExposed | null>(null)
const timePickerRef = ref<{ focus: () => void } | null>(null)

function onShellRequestFocus() {
  // The calendar only mounts with the popover, so wait a tick for it.
  nextTick(() => calendarRef.value?.focus())
}

// ── Positioning / keepOpen ────────────────────────────────────────────────────

const { resolvedSide, resolvedAlign, resolvedOffset } =
  usePopoverPositioning(props)
const shouldKeepOpen = useKeepOpen(props)
const inputReadonly = useTypeable(props)

// ── Calendar state ───────────────────────────────────────────────────────────

const DATE_FORMAT = 'YYYY-MM-DD'
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

const selectedDate = ref<string>('')
const timeValue = ref<string>('')

const initialValue = ref(props.modelValue || '')

const coerceToDayjs = useDateCoercion(() => props.format)

// ── Constraints ──────────────────────────────────────────────────────────────

// `min`/`max` accept either a date (`YYYY-MM-DD`) or a date-time
// (`YYYY-MM-DD HH:mm:ss`); date-only values parse as midnight, which gives
// day-level semantics for free under the second-level check below.
const resolvedMin = computed<string | undefined>(() => props.min)
const resolvedMax = computed<string | undefined>(() => props.max)

const minDT = computed<Dayjs | null>(() =>
  resolvedMin.value ? coerceToDayjs(resolvedMin.value) : null,
)
const maxDT = computed<Dayjs | null>(() =>
  resolvedMax.value ? coerceToDayjs(resolvedMax.value) : null,
)

function checkUnavailable(d: Dayjs): boolean {
  if (props.isDateUnavailable?.(d)) return true
  if (minDT.value && d.endOf('day').isBefore(minDT.value)) return true
  if (maxDT.value && d.startOf('day').isAfter(maxDT.value)) return true
  return false
}

// ── Value sync ───────────────────────────────────────────────────────────────

function syncFromValue(val?: string): void {
  if (!val) {
    if (!props.clearable) {
      const now = dayjsLocal()
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
  selectedDate.value = d.format(DATE_FORMAT)
  timeValue.value = d.format('HH:mm:ss')
}

syncFromValue(initialValue.value)

function initFromValue(): void {
  syncFromValue(props.modelValue)
}

watch(
  () => props.modelValue,
  (m) => {
    syncFromValue(m)
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

// ── Input commit / selection ─────────────────────────────────────────────────

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

function selectDate(date: string | Date | Dayjs): void {
  const d = dayjs(date as any)
  if (!d.isValid() || checkUnavailable(d)) return
  selectedDate.value = d.format(DATE_FORMAT)
}

function handleDateCellClick(date: string | Date | Dayjs) {
  selectDate(date)
  emitChange()
  isTyping.value = false
  // A date alone is half a selection. Keep the popover open and move focus to
  // the TimePicker.
  nextTick(() => timePickerRef.value?.focus?.())
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

// Now commits date and time together, in one emit.
function handleNowClick(date: string) {
  selectDate(date)
  timeValue.value = dayjsLocal().format('HH:mm:ss')
  emitChange()
  isTyping.value = false
  if (!shouldKeepOpen.value) isOpen.value = false
}

function handleClearClick() {
  clearSelection()
  if (!shouldKeepOpen.value) isOpen.value = false
  isTyping.value = false
}
</script>
