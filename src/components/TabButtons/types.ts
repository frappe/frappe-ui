import type { RouteLocationRaw } from 'vue-router'
import type {
  TabIcon,
  TabsSide,
  TabsSize,
  TabsVariant,
  TabValue,
} from '../Tabs/types'

export type TabButtonValue = TabValue
export type TabButtonIcon = TabIcon
export interface TabButton {
  value: TabButtonValue
  label?: string | number
  /** Icon-only tab; `label` becomes accessibility text. */
  icon?: TabButtonIcon
  /** Leading accent icon, rendered next to the visible label. */
  iconLeft?: TabButtonIcon
  disabled?: boolean
  tooltip?: string
  /** Renders the tab as a `<RouterLink>` to the given target. */
  route?: RouteLocationRaw
  /** Renders the tab as an `<a href>`, opens in a new tab. */
  href?: string
  onClick?: (event: MouseEvent) => void
}

export interface TabButtonsProps {
  /** List of options to render. */
  options?: TabButton[]

  modelValue?: TabButtonValue

  /** Visual variant, shared with the Tabs family. */
  variant?: TabsVariant

  size?: TabsSize

  vertical?: boolean

  /** Edge the active browser tab attaches to. Only used when `variant='browser-tab'` and `vertical`. */
  side?: TabsSide

  /** Buttons stretch to fill the container width. */
  fluid?: boolean
}

export interface TabButtonsEmits {
  'update:modelValue': [value: TabButtonValue]
}
