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
    :content-class="contentClass"
    @blur="commitInput()"
    @enter="commitInput(true)"
    @open="onShellOpen"
    @close="onShellClose"
    @request-focus="onShellRequestFocus"
  >
    <template v-if="$slots.trigger" #trigger="ts"><slot name="trigger" v-bind="ts" /></template>
    <template v-if="$slots.target" #target="ts"><slot name="target" v-bind="ts" /></template>
    <template v-if="$slots.prefix" #prefix="ts"><slot name="prefix" v-bind="ts" /></template>
    <template v-if="$slots.suffix" #suffix="ts"><slot name="suffix" v-bind="ts" /></template>

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
              selected,
              setDate: handleDateCellClick,
              clear: handleClearClick,
              close,
            }"
          />
        </aside>
        <CalendarPanel
          ref="panelRef"
          :view="view"
          :current-year="currentYear"
          :current-month="currentMonth"
          :year-range-start="yearRangeStart"
          :year-range="yearRange"
          :weeks="weeks"
          today-label="Today"
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
          @navigate="onPanelNavigate"
        />
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
  DatePickerProps,
  DatePickerEmits,
  DatePickerSlots,
} from './types'

const props = withDefaults(defineProps<DatePickerProps>(), {
  value: '',
  modelValue: '',
  variant: 'subtle',
  placeholder: 'Select date',
  typeable: true,
  readonly: false,
  allowCustom: true,
  disabled: false,
  clearable: true,
  openOnFocus: false,
  openOnClick: true,
  // Legacy default kept; see `useKeepOpen` for why.
  autoClose: true,
})
const emit = defineEmits<DatePickerEmits>()

const slots = defineSlots<DatePickerSlots>()

const POPOVER_CLASSES =
  'rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5'
const contentClass = computed(() =>
  slots.actions ? `w-fit ${POPOVER_CLASSES}` : `w-56 ${POPOVER_CLASSES}`,
)

// Cast strips @deprecated markers so internal back-compat reads don't trigger TS6385.
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
  if (isTyping.value) {
    commitInput()
    isTyping.value = false
  }
  // Drop the focused-date so the next open re-seeds it from today/selected
  // rather than resuming on a stale arrow-key target.
  focusedDate.value = null
}

const panelRef = ref<{ focusInitialCell: () => void } | null>(null)
const focusedDate = ref<Dayjs | null>(null)

function seedFocusedDate() {
  if (focusedDate.value) return
  if (selected.value) {
    const d = dayjs(selected.value)
    if (!checkUnavailable(d)) {
      focusedDate.value = d
      return
    }
  }
  const today = dayjsLocal()
  if (!checkUnavailable(today)) {
    focusedDate.value = today
    return
  }
  const first = weeks.value.flat().find((c) => c.inMonth && !c.isUnavailable)
  if (first) focusedDate.value = first.date
}

function onShellRequestFocus() {
  // Seed synchronously *before* the reactive flush so the CalendarPanel
  // mounts with `props.focusedDate` already set — that way the focused cell
  // has `tabindex=0` on first render and `focusInitialCell` (queued for
  // next tick) finds it.
  seedFocusedDate()
  nextTick(() => panelRef.value?.focusInitialCell())
}

function onPanelNavigate(target: Dayjs) {
  // Single-pane: target dictates the view. focusedDate stays in sync via
  // CalendarPanel's `update:focusedDate` (already wired via v-model).
  focusOn(target)
}

defineExpose({
  open: () => shellRef.value?.open(),
})

// ── Positioning / keepOpen / deprecations ────────────────────────────────────

const { resolvedSide, resolvedAlign, resolvedOffset } = usePopoverPositioning(
  props,
  dp,
)
const shouldKeepOpen = useKeepOpen(props, dp)
const inputReadonly = useTypeable(props, dp)
useDeprecationWarnings('DatePicker', dp, {
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
const selected = ref<string>('')
const initialValue = ref(props.modelValue || props.value || '')

const checkUnavailable = makeUnavailableCheck(
  () => props.min,
  () => props.max,
  () => props.isDateUnavailable,
)

const coerceToDayjs = useDateCoercion(() => props.format)

function syncFromValue(val?: string): void {
  if (!val) {
    if (!props.clearable) {
      const today = dayjsLocal()
      focusOn(today)
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
  focusOn(d)
  selected.value = d.format(DATE_FORMAT)
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

// ── Calendar grid ────────────────────────────────────────────────────────────

const weeks = computed<CalendarPanelCell[][]>(() =>
  generateWeeks(currentYear.value, currentMonth.value, selected.value).map(
    (week) =>
      week.map((d) => ({
        ...d,
        isUnavailable: checkUnavailable(d.date),
      })),
  ),
)

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
  focusOn(d)

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
  resetView()
}

function handleDateCellClick(date: string | Date | Dayjs) {
  selectDate(date)
  if (!shouldKeepOpen.value) isOpen.value = false
  isTyping.value = false
}

function handleTodayClick() {
  handleDateCellClick(dayjsLocal())
}

function handleClearClick() {
  clearSelection()
  if (!shouldKeepOpen.value) isOpen.value = false
  isTyping.value = false
  resetView()
}
</script>
