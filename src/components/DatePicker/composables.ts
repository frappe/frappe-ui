import { ref, computed, watchEffect, type Ref } from 'vue'
import type { Dayjs } from 'dayjs/esm'
import { dayjs } from '../../utils/dayjs'
import { monthStart, getDateValue } from './utils'
import type {
  CommonDatePickerProps,
  DatePickerPlacement,
  PopoverAlign,
  PopoverSide,
  DatePickerViewMode as ViewMode,
} from './types'

// View + month/year navigation state shared by all three pickers.
export function useCalendarView() {
  const view = ref<ViewMode>('date')
  const currentYear = ref<number>(dayjs().year())
  const currentMonth = ref<number>(dayjs().month())

  const yearRangeStart = computed(
    () => currentYear.value - (currentYear.value % 12),
  )
  const yearRange = computed<number[]>(() =>
    Array.from({ length: 12 }, (_, i) => yearRangeStart.value + i),
  )

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
      const m = monthStart(currentYear.value, currentMonth.value).add(
        1,
        'month',
      )
      currentYear.value = m.year()
      currentMonth.value = m.month()
    } else if (view.value === 'month') {
      currentYear.value += 1
    } else {
      currentYear.value += 12
    }
  }

  function cycleView(): void {
    if (view.value === 'date') view.value = 'month'
    else if (view.value === 'month') view.value = 'year'
    else view.value = 'date'
  }

  function selectMonth(i: number): void {
    currentMonth.value = i
    view.value = 'date'
  }

  function selectYear(y: number): void {
    currentYear.value = y
    view.value = 'month'
  }

  function focusOn(d: Dayjs): void {
    currentYear.value = d.year()
    currentMonth.value = d.month()
  }

  function resetView(): void {
    view.value = 'date'
  }

  return {
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
  }
}

// Positioning resolution: `side`/`align`/`offset` with legacy `placement` fallback.
export function usePopoverPositioning(
  props: CommonDatePickerProps,
  legacy: { placement?: DatePickerPlacement },
) {
  const resolvedSide = computed<PopoverSide>(
    () =>
      props.side ?? ((legacy.placement?.split('-')[0] as PopoverSide) ?? 'bottom'),
  )
  const resolvedAlign = computed<PopoverAlign>(() => {
    if (props.align !== undefined) return props.align
    const fromPlacement = legacy.placement?.split('-')[1] as
      | PopoverAlign
      | undefined
    return fromPlacement ?? 'start'
  })
  const resolvedOffset = computed(() => props.offset ?? 4)
  return { resolvedSide, resolvedAlign, resolvedOffset }
}

// `typeable` resolution: new prop wins; legacy `readonly: true` and
// `allowCustom: false` both map to `typeable: false`.
//
// Returns the readonly state to apply to the underlying TextInput (the inverse
// of typeable). HTML `readonly` is still the correct attribute on the trigger
// element — `typeable` is the picker-level vocabulary that wraps it.
export function useTypeable(
  props: { typeable?: boolean },
  legacy: { readonly?: boolean; allowCustom?: boolean },
) {
  return computed<boolean>(
    () =>
      props.typeable === false ||
      legacy.readonly === true ||
      legacy.allowCustom === false,
  )
}

// `keepOpen` resolution with legacy `autoClose` inverse fallback.
//
// Vue coerces omitted Boolean props to `false` (indistinguishable from an
// explicit `false`), so we anchor on `autoClose: true` as the legacy default
// and treat `autoClose === false` as the only meaningful legacy signal.
// This requires callers to set `autoClose: true` in their `withDefaults`.
export function useKeepOpen(
  props: CommonDatePickerProps,
  legacy: { autoClose?: boolean },
) {
  return computed(
    () => props.keepOpen === true || legacy.autoClose === false,
  )
}

// Coerce arbitrary string input to a Dayjs, respecting an optional explicit format.
export function useDateCoercion(getFormat: () => string | undefined) {
  return function coerceToDayjs(val?: string | null): Dayjs | null {
    if (!val) return null
    const raw = String(val).trim()
    if (!raw) return null
    const format = getFormat()
    if (format) {
      const dStrict = dayjs(raw, format, true)
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
}

// Build an `isDateUnavailable` checker from minDate/maxDate/isDateUnavailable props.
export function makeUnavailableCheck(
  getMinDate: () => string | undefined,
  getMaxDate: () => string | undefined,
  getIsUnavailable: () => ((d: Dayjs) => boolean) | undefined,
) {
  return function checkUnavailable(d: Dayjs): boolean {
    const minDate = getMinDate()
    const maxDate = getMaxDate()
    const isUnavailable = getIsUnavailable()
    if (minDate && d.isBefore(dayjs(minDate), 'day')) return true
    if (maxDate && d.isAfter(dayjs(maxDate), 'day')) return true
    if (isUnavailable?.(d)) return true
    return false
  }
}

// Dev-mode deprecation warnings shared by all pickers.
export type LegacyDatePickerProps = {
  value?: string | string[]
  placement?: DatePickerPlacement
  autoClose?: boolean
  allowCustom?: boolean
  readonly?: boolean
  inputClass?: string | Array<string> | Record<string, boolean>
}

export function useDeprecationWarnings(
  componentName: string,
  legacy: LegacyDatePickerProps,
  options: { hasTargetSlot?: boolean | Ref<boolean> } = {},
): void {
  if (!import.meta.env.DEV) return

  const warned = {
    value: false,
    placement: false,
    autoClose: false,
    allowCustom: false,
    readonly: false,
    inputClass: false,
    targetSlot: false,
  }

  const hasTargetSlot = options.hasTargetSlot
  const targetSlotPresent = () =>
    typeof hasTargetSlot === 'object' && hasTargetSlot !== null
      ? hasTargetSlot.value
      : !!hasTargetSlot

  watchEffect(() => {
    if (targetSlotPresent() && !warned.targetSlot) {
      console.warn(
        `[${componentName}] \`#target\` slot is deprecated. Use \`#trigger\` instead.`,
      )
      warned.targetSlot = true
    }
    if (legacy.value && !warned.value) {
      console.warn(
        `[${componentName}] \`value\` is deprecated. Use \`v-model\` / \`modelValue\` instead.`,
      )
      warned.value = true
    }
    if (legacy.placement !== undefined && !warned.placement) {
      console.warn(
        `[${componentName}] \`placement\` is deprecated. Use \`side\` and \`align\` instead.`,
      )
      warned.placement = true
    }
    if (legacy.autoClose === false && !warned.autoClose) {
      console.warn(
        `[${componentName}] \`autoClose: false\` is deprecated. Use \`keepOpen: true\` instead.`,
      )
      warned.autoClose = true
    }
    if (legacy.allowCustom === false && !warned.allowCustom) {
      console.warn(
        `[${componentName}] \`allowCustom: false\` is deprecated. Use \`typeable: false\` instead.`,
      )
      warned.allowCustom = true
    }
    if (legacy.readonly === true && !warned.readonly) {
      console.warn(
        `[${componentName}] picker-level \`readonly: true\` is deprecated. Use \`typeable: false\` instead.`,
      )
      warned.readonly = true
    }
    if (legacy.inputClass && !warned.inputClass) {
      console.warn(
        `[${componentName}] \`inputClass\` is deprecated. Apply \`class\` directly to the component element to control width.`,
      )
      warned.inputClass = true
    }
  })
}
