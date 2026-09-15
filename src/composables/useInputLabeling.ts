import { computed } from 'vue'
import { useId } from '../utils/useId'
import { errorLines as toErrorLines } from '../utils/errorLines'
import type { ErrorMessageValue } from '../utils/errorLines'
import { useSlotTick } from './useSlotTick'
import type { InputSize, InputVariant, ToggleSize } from './inputTypes'

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
   * `aria-invalid="true"` and `data-state="invalid"`. Takes a string, an
   * array of strings, or an `Error` whose `messages` are rendered as stacked
   * lines (with `Error.message` as the fallback). This is the same value
   * `ErrorMessage.message` takes. An empty array and an empty string both
   * mean no error.
   */
  error?: ErrorMessageValue

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

  // What renders is what counts as an error: an empty array, an empty string
  // and an `Error` with neither `message` nor `messages` all report none.
  const errorLines = computed<string[]>(() => toErrorLines(props.error))

  const hasError = computed(() => errorLines.value.length > 0)

  const showDescription = computed(() => {
    return Boolean(props.description) && !hasError.value
  })

  // Without this, a slot behind a `v-if` leaves the reference wrong in both
  // directions: added, the element renders and nothing points at it; removed,
  // the reference outlives its element and dangles.
  const slotTick = useSlotTick()

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
