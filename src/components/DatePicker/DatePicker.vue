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
        @interact-outside="onInteractOutside"
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
            today-label="Today"
            @prev="prev"
            @next="next"
            @today="handleTodayClick"
            @cycle-view="cycleView"
            @select-month="selectMonth"
            @select-year="selectYear"
            @select-date="handleDateCellClick"
          />
          <div
            v-if="$slots.actions || (props.clearable && selected)"
            class="flex flex-wrap items-center gap-1 p-2 border-t"
          >
            <slot
              v-if="$slots.actions"
              name="actions"
              v-bind="{
                selected,
                setDate: handleDateCellClick,
                clear: handleClearClick,
                close: closePopover,
              }"
            />
            <Button
              v-else-if="props.clearable && selected"
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
  DatePickerProps,
  DatePickerEmits,
  DatePickerSlots,
  DatePickerTriggerSlotProps,
} from './types'

const props = withDefaults(defineProps<DatePickerProps>(), {
  value: '',
  modelValue: '',
  variant: 'subtle',
  placeholder: 'Select date',
  readonly: false,
  allowCustom: true,
  disabled: false,
  clearable: true,
  openOnFocus: true,
  openOnClick: true,
  // Legacy default kept; see `useKeepOpen` for why.
  autoClose: true,
})
const emit = defineEmits<DatePickerEmits>()

const slots = defineSlots<DatePickerSlots>()

// Cast strips @deprecated markers so internal back-compat reads don't trigger TS6385.
const dp = props as unknown as LegacyDatePickerProps

// Anchor the popover to the input element itself, not the labeling wrapper, so
// it sits below the input rather than below the description text.
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
  () => props.minDate,
  () => props.maxDate,
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

const triggerSlotProps = computed<DatePickerTriggerSlotProps>(() => ({
  togglePopover,
  isOpen: isOpen.value,
  displayLabel: displayLabel.value,
  inputValue: inputValue.value,
}))

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

// ── Date selection ───────────────────────────────────────────────────────────

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

function closePopover() {
  isOpen.value = false
}

function handleClearClick() {
  clearSelection()
  if (!shouldKeepOpen.value) isOpen.value = false
  isTyping.value = false
  resetView()
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

@keyframes datepicker-enter {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes datepicker-exit {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.96) translateY(4px);
  }
}

@keyframes datepicker-instant-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
