import type { Component, ComputedRef, InjectionKey } from 'vue'
import { RouteLocationRaw } from 'vue-router'
import type { AlertAction } from '../Alert'
import type { StatusTheme } from '../shared/statusIcon'

/**
 * Read-only collapsed state, provided by `Sidebar` and consumed by
 * `SidebarItem` / `SidebarLabel` / `SidebarHeader` to shrink to icon-only.
 */
export const sidebarCollapsedKey: InjectionKey<ComputedRef<boolean>> =
  Symbol('sidebarCollapsed')

/**
 * Toggles the sidebar's collapsed state, provided by `Sidebar` and consumed by
 * `SidebarCollapseToggle`. Kept separate from {@link sidebarCollapsedKey} so
 * existing read-only consumers need no change.
 */
export const sidebarToggleKey: InjectionKey<() => void> =
  Symbol('sidebarToggle')

export type SidebarProps = {
  /** Disables collapsing entirely (fixed width, no built-in toggle). */
  disableCollapse?: boolean

  /** Expanded width as a CSS length. Applied inline so apps can override it. */
  width?: string

  /** Collapsed width as a CSS length. */
  collapsedWidth?: string
}

export interface SidebarItemProps {
  /** Row label. Used as the accessible name and the default slot fallback. */
  label?: string

  /** `accesskey` attribute for a keyboard shortcut. */
  accessKey?: string

  /**
   * Leading icon: a CSS class (e.g. `lucide-box`), plain text, or a component.
   * Ignored when the `#prefix` slot is used.
   */
  icon?: string | Component

  /** Trailing text. Ignored when the `#suffix` slot is used. */
  suffix?: string

  /**
   * Navigation target. When set the row's main area renders as a router link;
   * otherwise it renders as a button. A click still invokes `onClick`.
   */
  to?: RouteLocationRaw

  /**
   * Marks the row active (`data-state="active"`). When omitted, active state is
   * inferred by matching `to` against the current route.
   */
  active?: boolean

  /** Click handler. Bound from `@click`. */
  onClick?: (event: MouseEvent) => void
}

export interface SidebarLabelProps {
  /**
   * When true, collapses to a horizontal divider while the sidebar is collapsed
   * (matches the previous `SidebarSection` label behavior).
   */
  divider?: boolean
}

export type SidebarHeaderProps = {
  /** Workspace or app title. */
  title: string
  /** Secondary line under the title, e.g. a domain or workspace slug. */
  subtitle?: string
  /** Leading logo: an image URL, or a component. Overridden by the `#prefix` slot. */
  logo?: string | Component
  /**
   * Whether to render the leading logo/avatar box. Defaults to `true`. Set to
   * `false` when workspace identity is already shown elsewhere (e.g. a left
   * rail) to avoid a duplicate avatar; the title then sits flush-left. Best
   * paired with a non-collapsing sidebar, since a collapsed header with no logo
   * has nothing to show.
   */
  showLogo?: boolean
  /** Options rendered in the trigger's dropdown — the same shape `Dropdown` itself takes. */
  menuItems?: {
    label: string
    icon?: string | Component
    onClick?: () => void
  }[]
}

/**
 * Promotional or onboarding card for the sidebar footer — a trial notice, an
 * upgrade prompt, a "what's new" pointer. Stateless: `dismiss` is an event and
 * the parent owns hiding the card.
 */
export interface SidebarCardProps {
  /** Main heading text of the card. Optional when the `#title` slot is used */
  title?: string

  /** Supporting text below the title */
  description?: string

  /** Color theme of the icon and the tinted action button; the white container never changes with theme */
  theme?: StatusTheme

  /** Icon next to the title: unset shows the theme's auto icon (gray shows the info glyph in black ink), `false` hides it, a `lucide-*` string or Component renders a custom theme-colored glyph */
  icon?: boolean | string | Component

  /** The full-width tinted action button (`ButtonProps` plus `onClick({ dismiss })`) */
  action?: AlertAction

  /** Shows the dismiss (×) button, which emits `dismiss` */
  dismissible?: boolean
}

export interface SidebarCardEmits {
  /** Fired when the user dismisses the card — the × button or the action's `context.dismiss()`. The parent owns hiding. */
  dismiss: []
}

/** Scoped payload for the card's `#actions` slot. */
export interface SidebarCardActionsSlotProps {
  /** Emits the card's `dismiss` event. */
  dismiss: () => void
}

export interface SidebarCardSlots {
  /** Overrides the icon area next to the title */
  prefix?: () => any

  /** Rich title content (overrides the `title` prop) */
  title?: () => any

  /** Rich description content (overrides the `description` prop) */
  description?: () => any

  /** Replaces the auto-rendered action button; receives `{ dismiss }` */
  actions?: (props: SidebarCardActionsSlotProps) => any
}

/**
 * Building block for a collapsible group of `SidebarItem`s. Compose children
 * in the default slot — `SidebarSection` owns only the label + collapse
 * chrome, not the rows inside it.
 */
export type SidebarSectionProps = {
  /** Section label. Renders nothing when omitted (a label-less group). */
  label?: string
  /** Whether clicking the label toggles the group's visibility. */
  collapsible?: boolean
}
