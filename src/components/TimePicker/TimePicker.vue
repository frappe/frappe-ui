<template>
  <PopoverRoot v-model:open="isOpen">
    <PopoverAnchor :reference="anchorEl" as-child>
      <div v-bind="$attrs">
        <TextInput
          ref="inputRef"
          v-model="displayValue"
          type="text"
          class="w-full cursor-text text-sm"
          :id="id"
          :label="label"
          :description="description"
          :error="error"
          :required="required"
          :variant="variant"
          :size="size"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="isReadonly"
          @pointerdown="recordPointerDown"
          @focus="onFocus"
          @click="onClickInput"
          @blur="onBlur"
          @keydown.enter.prevent="onEnter"
          @keydown.down.prevent="onArrowDown"
          @keydown.up.prevent="onArrowUp"
          @keydown.esc="onEscape"
        >
          <template v-if="$slots.label" #label="slotProps">
            <slot name="label" v-bind="slotProps" />
          </template>
          <template v-if="$slots.description" #description>
            <slot name="description" />
          </template>
          <template v-if="$slots.prefix" #prefix>
            <slot name="prefix" />
          </template>
          <template #suffix>
            <slot
              name="suffix"
              v-bind="{ togglePopover, isOpen }"
            >
              <span
                class="lucide-chevron-down size-4 cursor-pointer"
                aria-hidden="true"
                @mousedown.prevent="togglePopover"
              />
            </slot>
          </template>
        </TextInput>
      </div>
    </PopoverAnchor>

    <PopoverPortal>
      <PopoverContent
        data-slot="content"
        data-selection
        class="z-[100]"
        :side="resolvedSide"
        :align="resolvedAlign"
        :side-offset="resolvedOffset"
        @open-auto-focus.prevent
        @interact-outside="onInteractOutside"
      >
        <div
          ref="panelRef"
          data-slot="content-body"
          :data-motion="motion"
          class="time-picker-panel max-h-48 w-44 overflow-y-auto rounded-lg bg-surface-elevation-2 p-1 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
          style="transform-origin: var(--reka-popover-content-transform-origin)"
          role="listbox"
          :aria-activedescendant="activeDescendantId"
        >
          <button
            v-for="(opt, idx) in displayedOptions"
            :key="opt.value"
            :data-value="opt.value"
            :id="optionId(idx)"
            type="button"
            role="option"
            class="group flex h-7 w-full items-center rounded px-2 text-left tabular-nums"
            :class="rowClass(opt, idx)"
            :aria-selected="canonicalValue === opt.value || undefined"
            @click="selectOption(opt.value)"
            @mouseenter="highlightIndex = idx"
          >
            <span class="truncate">{{ opt.label }}</span>
          </button>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch, watchEffect } from 'vue'
import {
  PopoverAnchor,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
} from 'reka-ui'
import { TextInput } from '../TextInput'
import { usePopoverMotion } from '../../composables/usePopoverMotion'
import '../shared/selection/popoverMotion.css'
import {
  findNearestIndex,
  formatTime,
  generateTimeOptions,
  isOutOfRange,
  minutesFromHHMM,
  normalize24,
  parseFlexibleTime,
  type TimeOption,
} from './utils'
import type {
  PopoverAlign,
  PopoverSide,
  TimePickerEmits,
  TimePickerProps,
  Variant,
} from './types'

const props = withDefaults(defineProps<TimePickerProps>(), {
  modelValue: '',
  interval: 15,
  options: () => [],
  placeholder: 'Select time',
  variant: 'subtle' as Variant,
  format: 'HH:mm',
  disabled: false,
  typeable: true,
  readonly: false,
  openOnFocus: false,
  openOnClick: true,
  // Legacy defaults: `autoClose: true` and `allowCustom: true` so an omitted
  // prop (which Vue's Boolean coercion would otherwise read as `false`) stays
  // distinguishable from an explicit `false` — the only signal that maps to
  // `keepOpen` / `readonly`.
  autoClose: true,
  allowCustom: true,
})

const emit = defineEmits<TimePickerEmits>()

defineSlots<{
  /** Overrides the rendered label content. Receives `{ required }`. */
  label?: (props: { required: boolean }) => any
  /** Overrides the rendered description content. */
  description?: () => any
  /** Rendered inside the trigger input, before the typed value. */
  prefix?: () => any
  /**
   * Rendered inside the trigger input, after the typed value. Defaults to a
   * chevron-down that toggles the popover.
   */
  suffix?: (props: { togglePopover: () => void; isOpen: boolean }) => any
}>()

defineOptions({ inheritAttrs: false })

// ── Prop reconciliation (new wins; legacy aliases preserved with warnings) ──

const resolvedSide = computed<PopoverSide>(
  () =>
    props.side ?? ((props.placement?.split('-')[0] as PopoverSide) ?? 'bottom'),
)
const resolvedAlign = computed<PopoverAlign>(() => {
  if (props.align !== undefined) return props.align
  return (props.placement?.split('-')[1] as PopoverAlign) ?? 'start'
})
const resolvedOffset = computed(() => props.offset ?? 4)

const shouldKeepOpen = computed(
  () => props.keepOpen === true || props.autoClose === false,
)

const isReadonly = computed(
  () =>
    props.typeable === false ||
    props.readonly === true ||
    props.allowCustom === false,
)

if (import.meta.env.DEV) {
  const warned = {
    value: false,
    placement: false,
    autoClose: false,
    allowCustom: false,
    readonly: false,
    scrollMode: false,
    minTime: false,
    maxTime: false,
  }
  watchEffect(() => {
    if (props.value && !warned.value) {
      console.warn(
        '[TimePicker] `value` is deprecated. Use `v-model` / `modelValue` instead.',
      )
      warned.value = true
    }
    if (props.placement !== undefined && !warned.placement) {
      console.warn(
        '[TimePicker] `placement` is deprecated. Use `side` and `align` instead.',
      )
      warned.placement = true
    }
    if (props.autoClose === false && !warned.autoClose) {
      console.warn(
        '[TimePicker] `autoClose: false` is deprecated. Use `keepOpen: true` instead.',
      )
      warned.autoClose = true
    }
    if (props.allowCustom === false && !warned.allowCustom) {
      console.warn(
        '[TimePicker] `allowCustom: false` is deprecated. Use `typeable: false` instead.',
      )
      warned.allowCustom = true
    }
    if (props.readonly === true && !warned.readonly) {
      console.warn(
        '[TimePicker] picker-level `readonly: true` is deprecated. Use `typeable: false` instead.',
      )
      warned.readonly = true
    }
    if (props.scrollMode !== undefined && !warned.scrollMode) {
      console.warn(
        '[TimePicker] `scrollMode` is deprecated. Scrolling is always centered now.',
      )
      warned.scrollMode = true
    }
    if (props.minTime !== undefined && !warned.minTime) {
      console.warn(
        '[TimePicker] `minTime` is deprecated. Use `min` instead.',
      )
      warned.minTime = true
    }
    if (props.maxTime !== undefined && !warned.maxTime) {
      console.warn(
        '[TimePicker] `maxTime` is deprecated. Use `max` instead.',
      )
      warned.maxTime = true
    }
  })
}

// ── State ──

const inputRef = ref<{ el: HTMLElement | null } | null>(null)
const anchorEl = computed(() => inputRef.value?.el ?? undefined)
const panelRef = ref<HTMLElement | null>(null)

// Reka treats anything outside `PopoverContent` as "outside" — including our
// own trigger — so a click on the input fires interact-outside and closes the
// popover, then the click handler reopens it. Suppress the close when the
// pointerdown originated inside the input's row (which holds the input and
// any suffix like the chevron); those elements have their own click logic.
function onInteractOutside(event: Event) {
  const target = event.target as Node | null
  const triggerRow = inputRef.value?.el?.parentElement
  if (target && triggerRow?.contains(target)) {
    event.preventDefault()
  }
}
const uid = Math.random().toString(36).slice(2, 9)

const isOpen = ref(false)
const { motion, onPointerDown: recordPointerDown } = usePopoverMotion(isOpen)

// Canonical 24-hour value (`HH:mm` or `HH:mm:ss`) — the source of truth.
const canonicalValue = ref<string>(
  normalize24(props.modelValue || props.value || '', props.format),
)

// What the user sees / can edit in the trigger input. Synced from
// canonicalValue when not actively typing.
const displayValue = ref<string>(formatTime(canonicalValue.value, props.format))

const isTyping = ref(false)
const highlightIndex = ref<number>(-1)
let invalid = false

function optionId(idx: number): string {
  return `tp-${uid}-${idx}`
}

const activeDescendantId = computed<string | undefined>(() =>
  highlightIndex.value > -1 ? optionId(highlightIndex.value) : undefined,
)

// ── Options ──

const minMinutes = computed(() =>
  minutesFromHHMM(props.min ?? props.minTime ?? ''),
)
const maxMinutes = computed(() =>
  minutesFromHHMM(props.max ?? props.maxTime ?? ''),
)

const displayedOptions = computed<TimeOption[]>(() => {
  if (props.options?.length) {
    return props.options.map((o) => {
      const value = normalize24(o.value) || o.value
      return { value, label: o.label || formatTime(value, props.format) }
    })
  }
  return generateTimeOptions({
    interval: props.interval,
    format: props.format,
    minMinutes: minMinutes.value,
    maxMinutes: maxMinutes.value,
  })
})

/**
 * Highlight target while the user is typing: either an exact match for the
 * typed text, or the option nearest to it in minutes. Drives both the
 * highlighted row and the scroll-into-view target.
 */
const typingTarget = computed<{ exact: TimeOption | null; nearest: TimeOption | null }>(() => {
  const list = displayedOptions.value
  if (!list.length) return { exact: null, nearest: null }
  const parsed = parseFlexibleTime(displayValue.value, props.format)
  if (!parsed.valid) return { exact: null, nearest: null }
  const candidate = parsed.ss
    ? `${parsed.hh24}:${parsed.mm}:${parsed.ss}`
    : `${parsed.hh24}:${parsed.mm}`
  const base = candidate.length === 8 ? candidate.slice(0, 5) : candidate
  const exact = list.find((o) => o.value === base) ?? null
  if (exact) return { exact, nearest: null }
  const idx = findNearestIndex(parsed.total, list)
  return { exact: null, nearest: idx > -1 ? list[idx] : null }
})

function rowClass(opt: TimeOption, idx: number): string {
  if (idx === highlightIndex.value) return 'bg-surface-gray-3 text-ink-gray-8'
  if (isTyping.value) {
    const { exact, nearest } = typingTarget.value
    if (exact && exact.value === opt.value)
      return 'bg-surface-gray-3 text-ink-gray-8'
    if (nearest && nearest.value === opt.value)
      return 'bg-surface-gray-2 italic text-ink-gray-7'
    return 'text-ink-gray-6 hover:bg-surface-gray-2 hover:text-ink-gray-8'
  }
  if (canonicalValue.value && opt.value === baseCompare(canonicalValue.value))
    return 'bg-surface-gray-3 text-ink-gray-8'
  return 'text-ink-gray-6 hover:bg-surface-gray-2 hover:text-ink-gray-8'
}

function baseCompare(val: string): string {
  return val.length === 8 ? val.slice(0, 5) : val
}

// ── Model sync ──

watch(
  () => [props.modelValue, props.value] as const,
  ([m, v]) => {
    const nv = normalize24(m || v || '', props.format)
    if (nv === canonicalValue.value) return
    canonicalValue.value = nv
    if (!isTyping.value) displayValue.value = formatTime(nv, props.format)
  },
)

// Reformat the displayed value when the display format changes.
watch(
  () => props.format,
  () => {
    if (!isTyping.value) {
      displayValue.value = formatTime(canonicalValue.value, props.format)
    }
  },
)

// User typing in the input — mark typing mode so option highlight + class
// logic switches to the "nearest match" affordance.
watch(displayValue, () => {
  if (!isOpen.value) return
  // The model→display sync above (re)writes displayValue while not typing —
  // distinguish user keystrokes from that programmatic write by only
  // toggling when the value diverges from the formatted canonical.
  const formatted = formatTime(canonicalValue.value, props.format)
  if (displayValue.value !== formatted) {
    isTyping.value = true
    highlightIndex.value = -1
  }
})

function setInvalid(next: boolean) {
  if (invalid === next) return
  invalid = next
  emit('invalid-change', next)
}

function commit(value: string) {
  const prev = canonicalValue.value
  canonicalValue.value = value
  displayValue.value = formatTime(value, props.format)
  isTyping.value = false
  emit('update:modelValue', value)
  if (value !== prev) emit('change', value)
  setInvalid(false)
}

function commitTyped(raw: string) {
  if (!raw) {
    commit('')
    return
  }
  const formattedCurrent = formatTime(canonicalValue.value, props.format)
  if (raw === formattedCurrent) {
    displayValue.value = formattedCurrent
    isTyping.value = false
    setInvalid(false)
    return
  }
  const parsed = parseFlexibleTime(raw, props.format)
  if (
    !parsed.valid ||
    isOutOfRange(parsed.total, minMinutes.value, maxMinutes.value)
  ) {
    emit('input-invalid', raw)
    setInvalid(true)
    // Revert visible text to the last good value.
    displayValue.value = formatTime(canonicalValue.value, props.format)
    isTyping.value = false
    return
  }
  const canonical = parsed.ss
    ? `${parsed.hh24}:${parsed.mm}:${parsed.ss}`
    : `${parsed.hh24}:${parsed.mm}`
  if (isReadonly.value) {
    const inList = displayedOptions.value.some(
      (o) => o.value === baseCompare(canonical),
    )
    if (!inList) {
      const idx = findNearestIndex(parsed.total, displayedOptions.value)
      if (idx > -1) {
        const nearest = displayedOptions.value[idx].value
        commit(
          canonical.length === 8 && nearest.length === 5
            ? `${nearest}${canonical.slice(5)}`
            : nearest,
        )
        return
      }
    }
  }
  commit(canonical)
}

function selectOption(value: string) {
  commit(value)
  if (!shouldKeepOpen.value) {
    isOpen.value = false
    blurInput()
  }
}

// ── Popover + keyboard wiring ──

function togglePopover() {
  isOpen.value = !isOpen.value
}

function onClickInput() {
  if (props.openOnClick && !isOpen.value) isOpen.value = true
  if (!isReadonly.value) selectAll()
}

function onFocus() {
  if (props.openOnFocus && !isOpen.value) isOpen.value = true
  if (!isReadonly.value) selectAll()
}

function onBlur(e: FocusEvent) {
  // Clicks inside the popover panel re-focus options; treat those as still-focused.
  const next = e.relatedTarget as Node | null
  if (next && panelRef.value?.contains(next)) return
  commitTyped(displayValue.value)
  isOpen.value = false
}

function onEnter() {
  if (isOpen.value && highlightIndex.value > -1 && !isTyping.value) {
    selectOption(displayedOptions.value[highlightIndex.value].value)
    return
  }
  commitTyped(displayValue.value)
  if (!shouldKeepOpen.value) {
    isOpen.value = false
    blurInput()
  }
}

function onArrowDown() {
  if (!isOpen.value) {
    isOpen.value = true
    return
  }
  moveHighlight(1)
}
function onArrowUp() {
  if (!isOpen.value) {
    isOpen.value = true
    return
  }
  moveHighlight(-1)
}

function moveHighlight(delta: number) {
  const list = displayedOptions.value
  if (!list.length) return
  if (highlightIndex.value === -1) {
    // Seed from the current value, or the nearest match if typing.
    const seed = isTyping.value
      ? (typingTarget.value.exact ?? typingTarget.value.nearest)?.value
      : baseCompare(canonicalValue.value)
    const idx = seed ? list.findIndex((o) => o.value === seed) : -1
    highlightIndex.value = idx > -1 ? idx : 0
  } else {
    highlightIndex.value = (highlightIndex.value + delta + list.length) % list.length
  }
  isTyping.value = false
  scrollHighlightedIntoView()
}

function onEscape(e: KeyboardEvent) {
  // Only consume Esc if our own popover (the time-options list) is open.
  // Otherwise, let the event bubble so a wrapping picker (e.g. DateTimePicker)
  // can close its outer popover.
  if (isOpen.value) {
    e.preventDefault()
    isOpen.value = false
    blurInput()
  }
}

function selectAll() {
  nextTick(() => {
    const root = inputRef.value?.el
    if (!root) return
    const input = root.querySelector?.('input') as HTMLInputElement | null
    input?.select?.()
  })
}

function blurInput() {
  nextTick(() => {
    const root = inputRef.value?.el
    if (!root) return
    const input = root.querySelector?.('input') as HTMLInputElement | null
    input?.blur?.()
  })
}

// ── Scroll behavior ──

function scrollHighlightedIntoView() {
  nextTick(() => {
    const panel = panelRef.value
    if (!panel) return
    const el = panel.querySelector<HTMLElement>(
      `[data-value="${displayedOptions.value[highlightIndex.value]?.value}"]`,
    )
    el?.scrollIntoView({ block: 'nearest' })
  })
}

function scrollOnOpen() {
  nextTick(() => {
    const panel = panelRef.value
    if (!panel) return
    const target =
      typingTarget.value.exact?.value ??
      typingTarget.value.nearest?.value ??
      (canonicalValue.value
        ? baseCompare(canonicalValue.value)
        : null)
    if (!target) return
    const el = panel.querySelector<HTMLElement>(`[data-value="${target}"]`)
    el?.scrollIntoView({ block: 'center' })
  })
}

watch(isOpen, (open) => {
  emit('update:open', open)
  if (open) {
    emit('open')
    highlightIndex.value = -1
    scrollOnOpen()
  } else {
    emit('close')
    isTyping.value = false
  }
})

watch(
  () => props.open,
  (val) => {
    if (typeof val === 'boolean' && val !== isOpen.value) {
      isOpen.value = val
    }
  },
)

defineExpose({
  /** Focus the trigger input. Used by DateTimePicker to flow keyboard focus
   *  from the calendar grid into the time picker after a date is picked. */
  focus: () => {
    inputRef.value?.el?.focus?.()
  },
})
</script>
