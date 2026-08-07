import type { ComputedRef, InjectionKey } from 'vue'
import type { ToggleSize } from '../../composables/inputTypes'
import type { InputLabelingProps } from '../../composables/useInputLabeling'

/** The value a radio represents within its group. */
export type RadioValue = string | number | boolean

export interface RadioGroupProps extends InputLabelingProps {
  /** The selected value of the group. */
  modelValue?: RadioValue

  /** Size of every radio in the group. */
  size?: ToggleSize

  /** Wraps each option in a clickable surface with hover, active and focus states — useful for selection lists and menu items. */
  padded?: boolean

  /** Disables every radio in the group. */
  disabled?: boolean

  /** Layout of the options. Also decides which arrow keys move the selection: up/down when vertical, left/right when horizontal. */
  orientation?: 'vertical' | 'horizontal'

  /** When `true`, arrow-key navigation wraps from the last option back to the first. */
  loop?: boolean

  /** Native `name` for the hidden form input, so the group submits with a form. Auto-generated when omitted. */
  name?: string
}

export interface RadioGroupEmits {
  /** Fired when the selected value changes. */
  'update:modelValue': [value: RadioValue]
}

// `required` and `error` are intentionally omitted: a radio is one option within
// a group, so the asterisk and the error message belong on the group, not on
// each option. Set them on `<RadioGroup>` instead.
//
// `size` and `padded` are likewise group-level — mixing sizes within one group
// has no design meaning, so they are inherited rather than per-option.
export interface RadioProps extends Omit<
  InputLabelingProps,
  'required' | 'error'
> {
  /** The value this option represents within its group. */
  value: RadioValue

  /** Disables this option only. The group's `disabled` still wins when set. */
  disabled?: boolean
}

/** Group-level state that each `Radio` reads instead of taking as its own prop. */
export interface RadioGroupContext {
  size: ComputedRef<ToggleSize>
  padded: ComputedRef<boolean>
  disabled: ComputedRef<boolean>
}

export const RadioGroupContextKey: InjectionKey<RadioGroupContext> =
  Symbol('RadioGroupContext')
