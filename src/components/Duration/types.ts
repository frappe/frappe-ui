import type {
  InputExposed,
  InputSize,
  InputVariant,
} from '../../composables/inputTypes'
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

/** The biggest unit the `short` and `long` presets use. `hour` folds days into hours. */
export type DurationLargestUnit = 'day' | 'hour'

/** The smallest unit the `short` and `long` presets use. `minute` rounds the seconds. */
export type DurationSmallestUnit = 'minute' | 'second'

/** The unit range of the `short` and `long` presets and of the edit text. */
export interface DurationUnits {
  largestUnit?: DurationLargestUnit
  smallestUnit?: DurationSmallestUnit
}

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

  /**
   * The biggest unit of the `short` and `long` presets and of the edit text.
   * `day` shows 93784 as `1d 2h 3m 4s`. Defaults to `hour` (`26h 3m 4s`).
   */
  largestUnit?: DurationLargestUnit

  /**
   * The smallest unit of the `short` and `long` presets and of the edit text.
   * `minute` rounds to the nearest minute, and a typed value is saved rounded.
   * Defaults to `second`.
   */
  smallestUnit?: DurationSmallestUnit

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

export interface DurationExposed extends InputExposed {}
