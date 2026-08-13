import { computed, onBeforeUpdate, shallowRef } from 'vue'
import { useId } from '../utils/useId'
import type { InputSize, InputVariant, ToggleSize } from './inputTypes'

/**
 * Library-level extension of the standard `Error` type. Frappe's whitelisted
 * methods may return an error with multiple messages on `messages?: string[]`.
 * This is the shape input components render in their error region.
 */
export interface FrappeUIError extends Error {
  messages?: string[]
}

export interface InputLabelingProps {
  /** Label rendered above (or beside, for binary controls) the input. */
  label?: string

  /**
   * Helper text rendered below the input.
   * Hidden when `error` is set. A `#description` slot is not: it renders
   * beside the error, and is referenced alongside it.
   */
  description?: string

  /**
   * Error message rendered below the input. When set, the control receives
   * `aria-invalid="true"` and `data-state="invalid"`. May be either a string
   * or an `Error` object whose `messages?: string[]` is rendered as stacked
   * lines (with `Error.message` as the fallback).
   */
  error?: string | FrappeUIError

  /**
   * Marks the field as required. Renders an asterisk next to the label, with
   * `sr-only` text that announces it, and forwards `required` /
   * `aria-required` to the underlying control where the control's role allows
   * it. `data-required` is set either way.
   */
  required?: boolean

  /** HTML id of the underlying control. Auto-generated via `useId()` if omitted. */
  id?: string
}

export interface InputLabelingSlots {
  /** Overrides the rendered label content. Receives `{ required }`. */
  label?: (props: { required: boolean }) => any

  /** Overrides the rendered description content. */
  description?: () => any
}

interface UseInputLabelingOptions {
  /** Size token for `data-size`. */
  size?: () => InputSize | ToggleSize | undefined
  /** Variant token for `data-variant`. */
  variant?: () => InputVariant | undefined
  /** Disabled state for `data-disabled` and `aria-*`. */
  disabled?: () => boolean | undefined
  /** State token override for `data-state` (e.g. `'checked'`). */
  state?: () => string | undefined
  /**
   * Whether a `#label` slot is filled. The label element renders for the slot
   * as well as for the prop, so without this `labelledBy` points at nothing
   * and the control is left unnamed with a `<label>` sitting right above it.
   */
  hasLabelSlot?: () => boolean
  /** Same for a `#description` slot and `describedBy`. */
  hasDescriptionSlot?: () => boolean
}

export function useInputLabeling(
  props: InputLabelingProps,
  options: UseInputLabelingOptions = {},
) {
  const fallbackId = useId()
  const inputId = computed(() => props.id ?? fallbackId)

  const labelId = computed(() => `${inputId.value}-label`)
  const descriptionId = computed(() => `${inputId.value}-description`)
  const errorMessageId = computed(() => `${inputId.value}-error`)

  const hasError = computed(() => {
    const e = props.error
    if (e == null) return false
    if (typeof e === 'string') return e.length > 0
    return Boolean(e.message || (e.messages && e.messages.length))
  })

  const errorLines = computed<string[]>(() => {
    const e = props.error
    if (!e) return []
    if (typeof e === 'string') return [e]
    if (e.messages && e.messages.length) return e.messages.slice()
    return e.message ? [e.message] : []
  })

  const showDescription = computed(() => {
    return Boolean(props.description) && !hasError.value
  })

  // `useSlots()` returns `instance.slots`, which Vue mutates in place and does
  // not track. A `computed` reading it caches on first evaluation and never
  // re-runs, so a slot behind a `v-if` leaves the reference wrong in both
  // directions: added, the element renders and nothing points at it; removed,
  // the reference outlives its element and dangles.
  //
  // Slot content only ever changes as part of a re-render, and `beforeUpdate`
  // runs after `updateSlots` and before the render function, so bumping here is
  // the invalidation those two computeds are missing.
  const slotTick = shallowRef(0)
  onBeforeUpdate(() => {
    slotTick.value++
  })

  // Both of these follow what actually renders, not what the props say. A
  // `#label` or `#description` slot renders the same element the prop does, so
  // keying off the prop alone paints an element that nothing points at.
  const rendersDescription = computed(() => {
    slotTick.value
    return showDescription.value || Boolean(options.hasDescriptionSlot?.())
  })

  const describedBy = computed(() => {
    const ids: string[] = []
    if (rendersDescription.value) ids.push(descriptionId.value)
    if (hasError.value) ids.push(errorMessageId.value)
    return ids.length ? ids.join(' ') : undefined
  })

  const labelledBy = computed(() => {
    slotTick.value
    return props.label || options.hasLabelSlot?.() ? labelId.value : undefined
  })

  const dataAttrs = computed(() => {
    const size = options.size?.()
    const variant = options.variant?.()
    const disabled = options.disabled?.()
    const explicitState = options.state?.()
    const state = hasError.value ? 'invalid' : (explicitState ?? 'valid')

    const attrs: Record<string, string> = {
      'data-state': state,
    }
    if (size) attrs['data-size'] = size
    if (variant) attrs['data-variant'] = variant
    if (disabled) attrs['data-disabled'] = 'true'
    if (props.required) attrs['data-required'] = 'true'
    return attrs
  })

  return {
    inputId,
    labelId,
    descriptionId,
    errorMessageId,
    labelledBy,
    describedBy,
    hasError,
    errorLines,
    showDescription,
    rendersDescription,
    dataAttrs,
  }
}
