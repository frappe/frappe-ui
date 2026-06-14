import type { Component } from 'vue'
import type { Theme } from '../../utils/theme'

export interface ThemeSwitcherProps {
  /** Selected theme. Falls back to the shared `useTheme` state when unbound. */
  modelValue?: Theme

  /**
   * Heading rendered above the options.
   * @default "Theme"
   */
  label?: string

  /**
   * Helper text rendered below the heading.
   * @default "Switch between light, dark, or system theme"
   */
  description?: string

  /**
   * Brand logo shown inside each preview. A string is treated as an image
   * source; a component value is rendered with `<component :is>`.
   */
  logo?: string | Component

  /** Brand name shown inside each preview. */
  name?: string

  /**
   * Overrides the per-option labels. For richer per-item content, use the
   * `#item-label` slot, which takes precedence over this prop.
   * @default { light: "Light", dark: "Dark", system: "System" }
   */
  themeLabels?: Partial<Record<Theme, string>>
}
