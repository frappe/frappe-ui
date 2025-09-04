<template>
  <Popover
    v-model:show="showOptions"
    transition="default"
    :placement="placement"
  >
    <template #target="{ togglePopover, isOpen }">
      <TextInput
        ref="inputRef"
        v-model="displayValue"
        :variant="variant"
        type="text"
        class="text-sm w-full cursor-text"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="!props.allowCustom"
        @focus="onFocus"
        @click="onClickInput(isOpen, togglePopover)"
        @keydown.enter.prevent="onEnter"
        @blur="onBlur"
        @keydown.down.prevent="onArrowDown(togglePopover, isOpen)"
        @keydown.up.prevent="onArrowUp(togglePopover, isOpen)"
        @keydown.esc.prevent="onEscape"
      >
        <template v-if="$slots.prefix" #prefix>
          <slot name="prefix" />
        </template>
        <template #suffix>
          <slot name="suffix" v-bind="{ togglePopover, isOpen }">
            <FeatherIcon
              name="chevron-down"
              class="h-4 w-4 cursor-pointer"
              @mousedown.prevent="togglePopover"
            />
          </slot>
        </template>
      </TextInput>
    </template>
    <template #body="{ isOpen }">
      <div
        v-show="isOpen"
        ref="panelRef"
        class="mt-2 max-h-48 w-44 overflow-y-auto rounded-lg bg-surface-modal p-1 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="listbox"
        :aria-activedescendant="activeDescendantId"
      >
        <button
          v-for="(opt, idx) in displayedOptions"
          :key="opt.value"
          :data-value="opt.value"
          :data-index="idx"
          type="button"
          class="group flex h-7 w-full items-center rounded px-2 text-left"
          :class="buttonClasses(opt, idx)"
          @click="select(opt.value)"
          @mouseenter="highlightIndex = idx"
          role="option"
          :id="optionId(idx)"
          :aria-selected="internalValue === opt.value"
        >
          <span class="truncate">{{ opt.label }}</span>
        </button>
      </div>
    </template>
  </Popover>
</template>

<script setup lang="ts">
import Popover from '../Popover/Popover.vue'
import TextInput from '../TextInput/TextInput.vue'
import FeatherIcon from '../FeatherIcon.vue'
import { ref, computed, watch, nextTick } from 'vue'
import type {
  Option,
  ParsedTime,
  TimePickerProps,
  Placement,
  Variant,
  TimePickerEmits,
} from './types'

const props = withDefaults(defineProps<TimePickerProps>(), {
  value: '',
  modelValue: '',
  interval: 15,
  options: () => [],
  placement: 'bottom-start' as Placement,
  placeholder: 'Select time',
  variant: 'subtle' as Variant,
  allowCustom: true,
  autoClose: true,
  use12Hour: true,
  disabled: false,
  scrollMode: 'center' as const,
  minTime: '',
  maxTime: '',
})

const emit = defineEmits<TimePickerEmits>()

const panelRef = ref<HTMLElement | null>(null)
const isFocused = ref(false)
const showOptions = ref(false)
const highlightIndex = ref<number>(-1)
const hasSelectedOnFirstClick = ref(false)
const isTyping = ref(false)
let navUpdating = false
let invalidState = false

const inputRef = ref<any>(null)
const initial = props.modelValue || props.value || ''
const internalValue = ref<string>(initial)
const displayValue = ref<string>('')
displayValue.value = formatDisplay(internalValue.value)
const uid = Math.random().toString(36).slice(2, 9)
const activeDescendantId = computed<string | undefined>(() =>
  highlightIndex.value > -1 ? optionId(highlightIndex.value) : undefined,
)
function optionId(idx: number): string {
  return `tp-${uid}-${idx}`
}

function minutesFromHHMM(str: string): number | null {
  if (!str) return null
  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(str)) return null
  const [h, m] = str.split(':').map((n) => parseInt(n))
  if (h > 23 || m > 59) return null
  return h * 60 + m
}
const minMinutes = computed<number | null>(() => minutesFromHHMM(props.minTime))
const maxMinutes = computed<number | null>(() => minutesFromHHMM(props.maxTime))

const displayedOptions = computed<Option[]>(() => {
  if (props.options?.length) {
    return props.options.map((o) => {
      const value = normalize24(o.value)
      return {
        value,
        label: o.label || formatDisplay(value),
      }
    })
  }
  const out: Option[] = []
  for (let m = 0; m < 1440; m += props.interval) {
    if (minMinutes.value != null && m < minMinutes.value) continue
    if (maxMinutes.value != null && m > maxMinutes.value) continue
    const hh = Math.floor(m / 60)
      .toString()
      .padStart(2, '0')
    const mm = (m % 60).toString().padStart(2, '0')
    const val = `${hh}:${mm}`
    out.push({
      value: val,
      label: formatDisplay(val),
    })
  }
  return out
})

watch(
  () => [props.modelValue, props.value],
  ([m, v]) => {
    const nv = m || v || ''
    if (nv && nv !== internalValue.value) {
      internalValue.value = normalize24(nv)
      displayValue.value = formatDisplay(internalValue.value)
    } else if (!nv) {
      internalValue.value = ''
      displayValue.value = ''
    }
  },
)

function normalize24(raw: string): string {
  if (!raw) return ''
  if (/^\d{2}:\d{2}$/.test(raw)) return raw
  if (/^\d{2}:\d{2}:\d{2}$/.test(raw)) return raw // keep seconds if present
  const parsed = parseFlexibleTime(raw)
  if (!parsed.valid) return ''
  return parsed.ss
    ? `${parsed.hh24}:${parsed.mm}:${parsed.ss}`
    : `${parsed.hh24}:${parsed.mm}`
}

function formatDisplay(val24: string): string {
  if (!val24) return ''
  const segs = val24.split(':')
  const h = parseInt(segs[0])
  const m = parseInt(segs[1])
  const s = segs[2]
  const base24 = `${h.toString().padStart(2, '0')}:${m
    .toString()
    .padStart(2, '0')}${s ? `:${s}` : ''}`
  if (!props.use12Hour) return base24
  const am = h < 12
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${m.toString().padStart(2, '0')}${s ? `:${s}` : ''} ${
    am ? 'am' : 'pm'
  }`
}

function parseFlexibleTime(input: string): ParsedTime {
  if (!input) return { valid: false }
  let s = input.trim().toLowerCase()
  s = s.replace(/\./g, '')
  s = s.replace(/(\d)(am|pm)$/, '$1 $2')
  const re = /^(\d{1,2})(?::(\d{1,2}))?(?::(\d{1,2}))?\s*([ap]m)?$/
  const m = s.match(re)
  if (!m) return { valid: false }
  let [, hhStr, mmStr, ssStr, ap] = m
  let hh = parseInt(hhStr)
  if (isNaN(hh) || hh < 0 || hh > 23) return { valid: false }
  if (ssStr && !mmStr) return { valid: false }
  let mm = mmStr != null && mmStr !== '' ? parseInt(mmStr) : 0
  if (isNaN(mm) || mm < 0 || mm > 59) return { valid: false }
  let ss: number | undefined
  if (ssStr) {
    ss = parseInt(ssStr)
    if (isNaN(ss) || ss < 0 || ss > 59) return { valid: false }
  }
  if (ap) {
    if (hh < 1 || hh > 12) return { valid: false }
    if (hh === 12 && ap === 'am') hh = 0
    else if (hh < 12 && ap === 'pm') hh += 12
  }
  return {
    valid: true,
    hh24: hh.toString().padStart(2, '0'),
    mm: mm.toString().padStart(2, '0'),
    ss: ss != null ? ss.toString().padStart(2, '0') : undefined,
    total: hh * 60 + mm,
  }
}

function findNearestIndex(targetMinutes: number, list: Option[]): number {
  if (!list.length) return -1
  const minutesArr = list.map((o) => {
    const [hh, mm] = o.value.split(':').map(Number)
    return hh * 60 + mm
  })
  let lo = 0,
    hi = minutesArr.length - 1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    const val = minutesArr[mid]
    if (val === targetMinutes) return mid
    if (val < targetMinutes) lo = mid + 1
    else hi = mid - 1
  }
  const candidates: number[] = []
  if (lo < minutesArr.length) candidates.push(lo)
  if (lo - 1 >= 0) candidates.push(lo - 1)
  if (!candidates.length) return -1
  return candidates.sort(
    (a, b) =>
      Math.abs(minutesArr[a] - targetMinutes) -
      Math.abs(minutesArr[b] - targetMinutes),
  )[0]
}

function isOutOfRange(totalMinutes: number): boolean {
  if (minMinutes.value != null && totalMinutes < minMinutes.value) return true
  if (maxMinutes.value != null && totalMinutes > maxMinutes.value) return true
  return false
}

function applyValue(val24: string, commit = false) {
  const prev = internalValue.value
  internalValue.value = val24
  displayValue.value = formatDisplay(val24)
  if (commit || !isFocused.value) emit('update:modelValue', val24)
  if (commit && val24 !== prev) emit('change', val24)
  setInvalid(false)
}

function commitInput() {
  const raw = displayValue.value
  const parsed = parseFlexibleTime(raw)
  if (!raw) {
    const prev = internalValue.value
    internalValue.value = ''
    if (!isFocused.value) emit('update:modelValue', '')
    if (prev && prev !== '') emit('change', '')
    setInvalid(false)
    return
  }
  if (!parsed.valid || isOutOfRange(parsed.total)) {
    emit('input-invalid', raw)
    setInvalid(true)
    return
  }
  const normalized = parsed.ss
    ? `${parsed.hh24}:${parsed.mm}:${parsed.ss}`
    : `${parsed.hh24}:${parsed.mm}`
  if (
    !props.allowCustom &&
    !displayedOptions.value.some((o) => {
      const base = normalized.length === 8 ? normalized.slice(0, 5) : normalized
      return o.value === base
    })
  ) {
    const nearestIdx = findNearestIndex(parsed.total, displayedOptions.value)
    if (nearestIdx > -1) {
      const nearestVal = displayedOptions.value[nearestIdx].value
      const committed =
        normalized.length === 8 && nearestVal.length === 5
          ? `${nearestVal}${normalized.slice(5)}`
          : nearestVal
      applyValue(committed, true)
      return
    }
  }
  applyValue(normalized, true)
}

function select(val: string, forceChange = false) {
  const prev = internalValue.value
  applyValue(val, true)
  if (forceChange && prev === internalValue.value) {
    emit('change', internalValue.value)
  }
  if (props.autoClose) showOptions.value = false
}

const selectedAndNearest = computed<{
  selected: Option | null
  nearest: Option | null
}>(() => {
  const list = displayedOptions.value
  if (!list.length) return { selected: null, nearest: null }
  const parsedTyped = parseFlexibleTime(displayValue.value)
  const candidate =
    isTyping.value && parsedTyped.valid
      ? parsedTyped.ss
        ? `${parsedTyped.hh24}:${parsedTyped.mm}:${parsedTyped.ss}`
        : `${parsedTyped.hh24}:${parsedTyped.mm}`
      : internalValue.value || null
  if (!candidate) return { selected: null, nearest: null }
  const candidateCompare =
    candidate && candidate.length === 8 ? candidate.slice(0, 5) : candidate
  const selected = list.find((o) => o.value === candidateCompare) || null
  if (selected) return { selected, nearest: null }
  const parsed = parseFlexibleTime(candidate)
  if (!parsed.valid) return { selected: null, nearest: null }
  const idx = findNearestIndex(parsed.total, list)
  return { selected: null, nearest: idx > -1 ? list[idx] : null }
})

function buttonClasses(opt: Option, idx: number): string {
  if (idx === highlightIndex.value) return 'bg-surface-gray-3 text-ink-gray-8'
  const { selected, nearest } = selectedAndNearest.value
  if (isTyping.value && !selected) {
    if (nearest && nearest.value === opt.value)
      return 'text-ink-gray-7 italic bg-surface-gray-2'
    return 'text-ink-gray-6 hover:bg-surface-gray-2 hover:text-ink-gray-8'
  }
  if (selected && selected.value === opt.value)
    return 'bg-surface-gray-3 text-ink-gray-8'
  if (nearest && nearest.value === opt.value)
    return 'text-ink-gray-7 italic bg-surface-gray-2'
  return 'text-ink-gray-6 hover:bg-surface-gray-2 hover:text-ink-gray-8'
}

watch(
  () => displayedOptions.value,
  () => scheduleScroll(),
)

function scheduleScroll() {
  nextTick(() => {
    if (!panelRef.value || !showOptions.value) return
    let targetEl: HTMLElement | null = null
    if (highlightIndex.value > -1) {
      targetEl = panelRef.value.querySelector(
        `[data-index="${highlightIndex.value}"]`,
      ) as HTMLElement | null
    } else {
      const { selected, nearest } = selectedAndNearest.value
      const target = selected || nearest
      if (target)
        targetEl = panelRef.value.querySelector(
          `[data-value="${target.value}"]`,
        ) as HTMLElement | null
    }
    if (!targetEl) return
    targetEl.scrollIntoView({
      block:
        props.scrollMode === 'center'
          ? 'center'
          : props.scrollMode === 'start'
            ? 'start'
            : 'nearest',
    })
  })
}

watch(showOptions, (open) => {
  if (open) {
    emit('open')
    initHighlight()
    scheduleScroll()
  } else {
    emit('close')
  }
})

watch(
  () => displayValue.value,
  () => {
    if (navUpdating) return
    if (showOptions.value) scheduleScroll()
    isTyping.value = true
    highlightIndex.value = -1
  },
)

function initHighlight() {
  const { selected, nearest } = selectedAndNearest.value
  const target = selected || nearest
  if (!target) {
    highlightIndex.value = -1
    return
  }
  const idx = displayedOptions.value.findIndex((o) => o.value === target.value)
  highlightIndex.value = idx
}

function moveHighlight(delta: number) {
  const list = displayedOptions.value
  if (!list.length) return
  if (highlightIndex.value === -1) initHighlight()
  else
    highlightIndex.value =
      (highlightIndex.value + delta + list.length) % list.length
  const opt = list[highlightIndex.value]
  if (opt) {
    navUpdating = true
    const val =
      internalValue.value.length === 8 && opt.value.length === 5
        ? `${opt.value}${internalValue.value.slice(5)}`
        : opt.value
    applyValue(val, false)
    nextTick(() => {
      navUpdating = false
    })
  }
  isTyping.value = false
  scheduleScroll()
}

function onArrowDown(togglePopover: () => void, isOpen?: boolean) {
  if (!isOpen) togglePopover()
  else moveHighlight(1)
}
function onArrowUp(togglePopover: () => void, isOpen?: boolean) {
  if (!isOpen) togglePopover()
  else moveHighlight(-1)
}

function onEnter() {
  if (!showOptions.value) {
    commitInput()
    blurInput()
    return
  }
  const parsed = parseFlexibleTime(displayValue.value)
  const normalized = parsed.valid
    ? parsed.ss
      ? `${parsed.hh24}:${parsed.mm}:${parsed.ss}`
      : `${parsed.hh24}:${parsed.mm}`
    : null
  const exists = normalized
    ? displayedOptions.value.some((o) => {
        const base =
          normalized.length === 8 ? normalized.slice(0, 5) : normalized
        return o.value === base
      })
    : false
  if (parsed.valid && (!exists || isTyping.value)) {
    commitInput()
    if (props.autoClose) showOptions.value = false
    blurInput()
    return
  }
  if (highlightIndex.value > -1) {
    const opt = displayedOptions.value[highlightIndex.value]
    if (opt) select(opt.value, true)
  } else {
    commitInput()
    if (props.autoClose) showOptions.value = false
  }
  blurInput()
}

function onClickInput(isOpen: boolean | undefined, togglePopover: () => void) {
  if (!isOpen) togglePopover()
  if (props.allowCustom) selectAll()
}

function onFocus() {
  isFocused.value = true
  if (props.allowCustom && !hasSelectedOnFirstClick.value) selectAll()
}

function onBlur() {
  if (showOptions.value) {
    isFocused.value = false
    return
  }
  commitInput()
  isFocused.value = false
}

function selectAll() {
  nextTick(() => {
    const el = inputRef.value?.el || inputRef.value
    if (el && el.querySelector) {
      const input: HTMLInputElement | any = el.querySelector('input') || el
      input?.select?.()
    } else if (el?.select) {
      el.select()
    }
    hasSelectedOnFirstClick.value = true
  })
}

function blurInput() {
  nextTick(() => {
    const el = inputRef.value?.el || inputRef.value
    if (el && el.querySelector) {
      const input: HTMLInputElement | any = el.querySelector('input') || el
      input?.blur?.()
    } else if (el?.blur) {
      el.blur()
    }
    isFocused.value = false
  })
}

function onEscape() {
  if (showOptions.value) showOptions.value = false
  blurInput()
}

function setInvalid(val: boolean) {
  if (invalidState !== val) {
    invalidState = val
    emit('invalid-change', val)
  }
}
</script>
