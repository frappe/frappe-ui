import type { Component } from 'vue'
import type { ToggleSize } from '../../composables/inputTypes'
import type { InputLabelingProps } from '../../composables/useInputLabeling'

export interface SwitchProps extends InputLabelingProps {
  /** Size of the switch control */
  size?: ToggleSize

  /**
   * Visual style of the switch row.
   * `padded` wraps the control and label in a clickable surface with hover,
   * active and focus states — useful for settings rows and menu items.
   */
  variant?: 'default' | 'padded'

  /**
   * Position of the switch control relative to the label.
   * Defaults to automatic — `left` for label-only rows and `right` when a
   * `description` is present. Pass `left` or `right` to override.
   */
  switchPosition?: 'left' | 'right'

  /** Disables the switch and prevents interaction */
  disabled?: boolean

  /**
   * Optional icon rendered alongside the label.
   * Strings starting with `lucide-` are rendered via the shared Lucide
   * Tailwind utility; component values are rendered with `<component :is>`.
   */
  icon?: string | Component

  /**
   * Custom classes applied to the label element.
   * @deprecated Use `data-*` styling hooks instead.
   */
  labelClasses?: string
}

