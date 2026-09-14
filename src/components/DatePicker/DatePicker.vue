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
    <template v-if="$slots.trigger" #trigger="ts"><slot name="trigger" v-bind="ts" /></template>
    <template v-if="$slots.prefix" #prefix="ts"><slot name="prefix" v-bind="ts" /></template>
    <template v-if="$slots.suffix" #suffix="ts"><slot name="suffix" v-bind="ts" /></template>

    <template #default="{ close }">
      <div
        class="flex"
        :class="$slots.actions ? 'w-fit divide-x divide-outline-gray-2' : 'w-56'"
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
              selected,
              setDate: handleDateCellClick,
              clear: handleClearClick,
              close,
            }"
          />
        </aside>
        <DateCalendar
          ref="calendarRef"
          :model-value="selected"
          today-label="Today"
          :min="props.min"
          :max="props.max"
          :is-date-unavailable="props.isDateUnavailable"
          @select="handleDateCellClick"
          @today="handleDateCellClick"
        />
      </div>
    </template>
  </PickerShell>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { dayjs, dayjsLocal } from '../../utils/dayjs'
import DateCalendar from './DateCalendar.vue'
import PickerShell from '../shared/picker/PickerShell.vue'
import {
  usePopoverPositioning,
  useKeepOpen,
  useTypeable,
  useDateCoercion,
  makeUnavailableCheck,
} from './composables'
import type { Dayjs } from 'dayjs/esm'
import type { DatePickerProps, DatePickerEmits, DatePickerSlots } from './types'
import type { DateCalendarExposed } from './calendarTypes'

const props = withDefaults(defineProps<DatePickerProps>(), {
  modelValue: '',
  variant: 'subtle',
  placeholder: 'Select date',
  typeable: true,
  disabled: false,
  clearable: true,
  openOnFocus: false,
  openOnClick: true,
})
const emit = defineEmits<DatePickerEmits>()

defineSlots<DatePickerSlots>()

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

const calendarRef = ref<DateCalendarExposed | null>(null)

function onShellRequestFocus() {
  // The calendar only mounts with the popover, so wait a tick for it.
  nextTick(() => calendarRef.value?.focus())
}

defineExpose({
  open: () => shellRef.value?.open(),
})

// ── Positioning / keepOpen ────────────────────────────────────────────────────

const { resolvedSide, resolvedAlign, resolvedOffset } =
  usePopoverPositioning(props)
const shouldKeepOpen = useKeepOpen(props)
const inputReadonly = useTypeable(props)

// ── Calendar state ───────────────────────────────────────────────────────────

const DATE_FORMAT = 'YYYY-MM-DD'
const selected = ref<string>('')
const initialValue = ref(props.modelValue || '')

const checkUnavailable = makeUnavailableCheck(
  () => props.min,
  () => props.max,
  () => props.isDateUnavailable,
)

const coerceToDayjs = useDateCoercion(() => props.format)

function syncFromValue(val?: string): void {
  if (!val) {
    if (!props.clearable) {
      selected.value = dayjsLocal().format(DATE_FORMAT)
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
  selected.value = d.format(DATE_FORMAT)
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

// ── Input commit / selection ─────────────────────────────────────────────────

function clearSelection() {
  if (!selected.value) return
  selected.value = ''
  emit('update:modelValue', '')
  emit('change', '')
  initialValue.value = ''
  inputValue.value = ''
}

function commitInput(close = false): void {
  const raw = inputValue.value.trim()
  if (!raw) {
    if (!props.clearable) {
      selectDate(dayjsLocal())
      if (close && !shouldKeepOpen.value) isOpen.value = false
    } else {
      clearSelection()
      if (close && !shouldKeepOpen.value) isOpen.value = false
    }
    return
  }
  const d = coerceToDayjs(raw)
  if (d && !checkUnavailable(d)) {
    selectDate(d)
    if (close && !shouldKeepOpen.value) isOpen.value = false
  } else {
    inputValue.value = displayLabel.value
  }
}

function selectDate(date: string | Date | Dayjs): void {
  const d = dayjs(date as any)
  if (!d.isValid()) return
  if (checkUnavailable(d)) return
  const prev = selected.value
  selected.value = d.format(DATE_FORMAT)

  if (selected.value !== initialValue.value) {
    emit('update:modelValue', selected.value)
    if (selected.value !== prev) emit('change', selected.value)
    initialValue.value = selected.value
  }

  if (!isTyping.value) {
    inputValue.value = props.format
      ? formatter(selected.value, props.format)
      : selected.value
  }
}

function handleDateCellClick(date: string | Date | Dayjs) {
  selectDate(date)
  if (!shouldKeepOpen.value) isOpen.value = false
  isTyping.value = false
}

function handleClearClick() {
  clearSelection()
  if (!shouldKeepOpen.value) isOpen.value = false
  isTyping.value = false
}
</script>
