import type { Component } from 'vue'
import type { ToggleSize } from '../../composables/inputTypes'
import type { InputLabelingProps } from '../../composables/useInputLabeling'

export interface SwitchProps extends InputLabelingProps {
  /** Size of the switch control */
  size?: ToggleSize

  /** Wraps the control and label in a clickable surface with hover, active and focus states — useful for settings rows and menu items. */
  padded?: boolean

  /** Position of the control relative to the label, along the inline axis (RTL-aware). `start` is the leading side, `end` the trailing side. Defaults to `end`, so the switch trails the label. */
  controlPosition?: 'start' | 'end'

  /** Disables the switch and prevents interaction */
  disabled?: boolean

  /** Optional icon rendered alongside the label. Strings starting with `lucide-` are rendered via the shared Lucide Tailwind utility; component values are rendered with `<component :is>`. */
  icon?: string | Component
}
