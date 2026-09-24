import type { InputExposed } from '../../composables/inputTypes'
import type { RouteDestination } from '../shared/route'
import type {
  TabIcon,
  TabsEdge,
  TabsSize,
  TabsVariant,
  TabValue,
} from '../Tabs/types'

export type TabButtonValue = TabValue
export type TabButtonIcon = TabIcon
export interface TabButton {
  value: TabButtonValue
  label: string
  /** Icon-only tab; `label` becomes accessibility text. */
  icon?: TabButtonIcon
  /** Leading accent icon, rendered next to the visible label. */
  iconLeft?: TabButtonIcon
  disabled?: boolean
  /** Renders the tab as a `<RouterLink>` to the given target. */
  route?: RouteDestination
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

  /**
   * browser-tab + vertical only: the edge of the list the tabs attach to.
   * `start` is the left edge in left-to-right text.
   */
  edge?: TabsEdge

  /** Buttons stretch to fill the container width. */
  fluid?: boolean
}

export interface TabButtonsEmits {
  'update:modelValue': [value: TabButtonValue]
}

/**
 * What a `<TabButtons>` template ref hands back. `focus()` moves focus to the
 * selected option, or to the first enabled one when nothing is selected —
 * the same element a `Tab` press reaches, since the group is one tabstop.
 * A group with no options, or with every option disabled, has nothing to
 * focus and the call does nothing.
 */
export interface TabButtonsExposed extends InputExposed {}

export interface TabButtonsSlots {
  /** Slot before the tab button label. */
  prefix?: (props: {
    button: TabButton
    active: boolean
    disabled: boolean
  }) => any
  /** Slot after the tab button label. */
  suffix?: (props: {
    button: TabButton
    active: boolean
    disabled: boolean
  }) => any
}
