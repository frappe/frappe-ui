import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export type TabValue = string | number
export type TabsVariant = 'underline' | 'subtle' | 'ghost' | 'browser-tab'
export type TabsSize = 'sm' | 'md'
export type TabsSide = 'left' | 'right'

/** A `lucide-*` class string or a Vue component. */
export type TabIcon = string | Component

export interface TabsProps {
  /** Currently selected tab value. */
  modelValue?: TabValue

  /** Renders tabs vertically instead of horizontally. */
  vertical?: boolean

  /** Forces layout direction; defaults to the resolved document direction. */
  dir?: 'ltr' | 'rtl'

  /** Shorthand mode only: items to generate triggers (and panels) from. */
  tabs?: TabItem[]

  /** Shorthand mode only; forwarded to the generated TabList. */
  variant?: TabsVariant

  /** Shorthand mode only; forwarded to the generated TabList. */
  size?: TabsSize

  /** Shorthand mode only; forwarded to the generated TabList. */
  side?: TabsSide
}

export interface TabsEmits {
  /** Fired when the selected tab changes. */
  'update:modelValue': [value: TabValue]
}

export interface TabListProps {
  /** Visual variant. */
  variant?: TabsVariant

  /** Size of the triggers. */
  size?: TabsSize

  /** browser-tab + vertical only: which edge the tabs attach to. */
  side?: TabsSide
}

export interface TabTriggerProps {
  value: TabValue

  /** Text shown in the label region. */
  label?: string

  /** Icon-only trigger; `label` becomes the accessible name. */
  icon?: TabIcon

  /** Leading accent icon, rendered next to the visible label. */
  iconLeft?: TabIcon

  disabled?: boolean

  /** Renders the trigger as a RouterLink. See route mode in the spec. */
  route?: RouteLocationRaw
}

export type TabTriggerSlotProps = { selected: boolean; disabled: boolean }

export interface TabPanelProps {
  value: TabValue
}

/** Item for the `tabs` shorthand on the `Tabs` root. */
export interface TabItem {
  value: TabValue
  label?: string
  icon?: TabIcon
  iconLeft?: TabIcon
  disabled?: boolean
  route?: RouteLocationRaw
  /** Item renders only while this returns true. */
  condition?: () => boolean
  /**
   * App-defined extras, passed to the shorthand slots as `tab.data`. Fields
   * live here rather than on the item itself so a misspelled `label` or
   * `route` is still a type error.
   */
  data?: Record<string, unknown>
}
