import type { Component } from 'vue'

export interface Tab {
  /** Text shown for the tab. */
  label: string

  /**
   * Optional icon shown with the label. Pass a `lucide-*` class string for
   * the recommended class-based form, or a Vue component for custom icons.
   */
  icon?: string | Component

  /** Optional route to navigate to when the tab is clicked. */
  route?: string
}

export interface TabsProps {
  /** Element/component used to render the tab container. */
  as?: string

  /** List of tabs to render. */
  tabs: Tab[]

  /** Renders tabs vertically instead of horizontally. */
  vertical?: boolean

  /** Currently selected tab value. */
  modelValue?: string | number

  /** Forces layout direction; defaults to `document.documentElement.dir`. */
  dir?: 'rtl' | 'ltr'
}

export interface TabsEmits {
  /** Fired when the selected tab changes. */
  'update:modelValue': [value: string | number]
}
