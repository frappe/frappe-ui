import type { Component } from 'vue'
import type { ToggleSize } from '../../composables/inputTypes'
import type { InputLabelingProps } from '../../composables/useInputLabeling'

export interface SwitchProps extends InputLabelingProps {
  /** Size of the switch control */
  size?: ToggleSize

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

