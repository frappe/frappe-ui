import type { Component } from 'vue'
import type { Theme } from '../../utils/theme'

export interface ThemeSwitcherProps {
  /**
   * Controlled selected theme. Bind with `v-model`. When omitted, the global
   * frappe-ui theme (`useTheme`) is used, so `<ThemeSwitcher />` works and
   * drives `<html data-theme>` with no wiring.
   */
  modelValue?: Theme

  /**
   * Heading rendered above the options. Pass a translated string.
   * @default "Theme"
   */
  label?: string

  /**
   * Helper text rendered below the heading. Pass a translated string.
   * @default "Switch between light, dark, or system theme"
   */
  description?: string

  /**
   * Brand logo shown inside each preview. A string is treated as an image
   * `src`; a Component is rendered via `<component :is>` (e.g. an inline SVG
   * or icon component).
   */
  logo?: string | Component

  /** Brand name shown inside each preview. */
  name?: string

  /**
   * Overrides the per-option labels, e.g. for translation.
   * @default { light: "Light", dark: "Dark", system: "System" }
   */
  themeLabels?: Partial<Record<Theme, string>>
}
