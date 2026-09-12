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
        class="flex w-fit"
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
        <DateRangeCalendar
          ref="calendarRef"
          :model-value="[fromDate, toDate]"
          :dual-pane="props.dualPane"
          today-label="Today"
          :min="props.min"
          :max="props.max"
          :is-date-unavailable="props.isDateUnavailable"
          @select="handleRangeSelect"
          @today="handleRangeSelect"
        />
      </div>
    </template>
  </PickerShell>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { dayjs } from '../../utils/dayjs'
import { orderRange, rangeKey, stepRange } from './utils'
import DateRangeCalendar from './DateRangeCalendar.vue'
import PickerShell from '../shared/picker/PickerShell.vue'
import {
  usePopoverPositioning,
  useKeepOpen,
  useTypeable,
  useDateCoercion,
  makeUnavailableCheck,
} from './composables'
import type { Dayjs } from 'dayjs/esm'
import type {
  DateRangePickerProps,
  DateRangePickerEmits,
  DateRangePickerSlots,
  DateRangeValue,
} from './types'
import type { DateRangeCalendarExposed } from './calendarTypes'

const props = withDefaults(defineProps<DateRangePickerProps>(), {
  modelValue: () => [],
  variant: 'subtle',
  placeholder: 'Select range',
  typeable: true,
  disabled: false,
  clearable: true,
  dualPane: false,
  openOnFocus: false,
  openOnClick: true,
})
const emit = defineEmits<DateRangePickerEmits>()

defineSlots<DateRangePickerSlots>()

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

const calendarRef = ref<DateRangeCalendarExposed | null>(null)

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

// ── Range state ──────────────────────────────────────────────────────────────

const DATE_FORMAT = 'YYYY-MM-DD'
const fromDate = ref<string>('')
const toDate = ref<string>('')

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
  return props.modelValue && props.modelValue.length ? props.modelValue : []
}

function syncFromValue(val?: string[]): void {
  const [f, t] = normalizeIncoming(val)
  fromDate.value = f
  toDate.value = t
}

const initialValue = ref<string>('')
syncFromValue(pickIncoming())
initialValue.value = rangeKey([fromDate.value, toDate.value])

function initFromValue(): void {
  syncFromValue(pickIncoming())
}

watch(
  () => props.modelValue,
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
  setOrdered([fromDate.value, toDate.value])
  emitIfChanged()
  inputValue.value = displayLabel.value
  if (close && !shouldKeepOpen.value && fromDate.value && toDate.value) {
    isOpen.value = false
  }
}

// The calendar reports every click, including the half-open range after the
// first one. Emit and close only once both ends are set.
function handleRangeSelect(range: DateRangeValue) {
  fromDate.value = range[0] ?? ''
  toDate.value = range[1] ?? ''
  if (fromDate.value && toDate.value) {
    emitIfChanged()
    if (!shouldKeepOpen.value) isOpen.value = false
  }
  isTyping.value = false
}

function handleDateCellClick(date: string | Date | Dayjs) {
  const d = dayjs(date as any)
  if (!d.isValid() || checkUnavailable(d)) return
  handleRangeSelect(stepRange([fromDate.value, toDate.value], d))
}

function setOrdered(range: [string, string]): void {
  const [from, to] = orderRange(range)
  fromDate.value = from
  toDate.value = to
}

function emitIfChanged() {
  const next = rangeKey([fromDate.value, toDate.value])
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
  emitIfChanged()
  inputValue.value = ''
}

function handleClearClick() {
  clearSelection()
  if (!shouldKeepOpen.value) isOpen.value = false
  isTyping.value = false
}

function handleSetRange(range: [string | Date | Dayjs, string | Date | Dayjs]) {
  const a = dayjs(range[0])
  const b = dayjs(range[1])
  if (!a.isValid() || !b.isValid()) return
  if (checkUnavailable(a) || checkUnavailable(b)) return
  setOrdered([a.format(DATE_FORMAT), b.format(DATE_FORMAT)])
  emitIfChanged()
  isTyping.value = false
}
</script>
