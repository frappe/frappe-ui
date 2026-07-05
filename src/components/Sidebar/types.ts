import type {
  Component,
  ComputedRef,
  InjectionKey,
  MaybeRefOrGetter,
} from 'vue'
import { RouteLocationRaw } from 'vue-router'

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
  /**
   * @deprecated Config-object header. Prefer composing your own header in the
   * default slot. Kept for one release for backward compatibility.
   */
  header?: SidebarHeaderProps

  /**
   * @deprecated Config-object sections. Prefer composing `SidebarLabel` +
   * `SidebarItem` in the default slot. Kept for one release.
   */
  sections?: SidebarSectionProps[]

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

  /** @deprecated Use `active`. Alias kept for the config-object path. */
  isActive?: boolean

  /**
   * Click handler. Bound from `@click` in composition and from `item.onClick`
   * in the config-object path — both resolve to this prop.
   */
  onClick?: (event: MouseEvent) => void

  /** @deprecated Config-object visibility flag; filtered by the legacy adapter. */
  condition?: MaybeRefOrGetter<boolean>
}

export interface SidebarLabelProps {
  /**
   * When true, collapses to a horizontal divider while the sidebar is collapsed
   * (matches the previous `SidebarSection` label behavior).
   */
  divider?: boolean
}

export type SidebarHeaderProps = {
  title: string
  subtitle?: string
  logo?: string | Component
  /**
   * Whether to render the leading logo/avatar box. Defaults to `true`. Set to
   * `false` when workspace identity is already shown elsewhere (e.g. a left
   * rail) to avoid a duplicate avatar; the title then sits flush-left. Best
   * paired with a non-collapsing sidebar, since a collapsed header with no logo
   * has nothing to show.
   */
  showLogo?: boolean
  menuItems?: {
    label: string
    icon?: string | Component
    onClick?: () => void
  }[]
}

/**
 * @deprecated Legacy config-object section shape. Rendered by the internal
 * `SidebarSection` adapter for `Sidebar`'s `sections` prop. New code composes
 * `SidebarLabel` + `SidebarItem` directly.
 */
export type SidebarSectionProps = {
  label?: string
  items: SidebarItemProps[]
  collapsible?: boolean
}
