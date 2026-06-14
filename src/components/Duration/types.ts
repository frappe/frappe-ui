import type { InputSize, InputVariant } from '../../composables/inputTypes'
import type { InputLabelingProps } from '../../composables/useInputLabeling'

/**
 * Named display presets (smart zero-omission; `long` also pluralizes):
 *   short — "1h 30m 45s"
 *   long  — "1 hour 30 minutes 45 seconds"
 *   colon — "1:30:45"
 */
export type DurationFormatPreset = 'short' | 'long' | 'colon'

/**
 * How a duration is rendered: a named preset, or a token template string
 * rendered literally — `h`/`hh`, `m`/`mm`, `s`/`ss`, with single-quoted text
 * taken as a literal (e.g. `h'h' m'm' s's'` → "2h 2m 3s", `hh:mm:ss` → "02:02:03").
 */
// `string & {}` keeps preset autocomplete while still accepting any template.
export type DurationFormat = DurationFormatPreset | (string & {})

export interface DurationProps extends InputLabelingProps {
  /** The duration value in seconds (two-way via `v-model`). */
  modelValue?: number | null

  /** Placeholder shown when the input is empty. Defaults to `1h 30m 45s`. */
  placeholder?: string

  /**
   * How the saved value is rendered when not focused: a named preset
   * (`short` | `long` | `colon`) or a token template (e.g. `h'h' m'm' s's'`,
   * `hh:mm:ss`). Defaults to `short`.
   */
  format?: DurationFormat

  /** Visual size of the input. Forwarded to the underlying `TextInput`. */
  size?: InputSize

  /** Style variant of the input. Forwarded to the underlying `TextInput`. */
  variant?: InputVariant

  /** Disables the input when true. */
  disabled?: boolean
}

export interface DurationEmits {
  /** Fired when the model value changes. */
  'update:modelValue': [value: number | null]
}

export interface DurationExposed {
  /** Focuses the underlying text input. */
  focus: () => void
}
