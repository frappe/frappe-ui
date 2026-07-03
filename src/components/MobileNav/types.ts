import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

/**
 * `MobileNav` (the bar) has no props — it's a grid frame for `MobileNavItem`s.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface MobileNavProps {}

export interface MobileNavItemProps {
  /** Label under the icon; also the accessible name. */
  label: string

  /**
   * Icon CSS class, e.g. `lucide-home`, or a component. Ignored when the
   * default slot is used (for a custom glyph or an avatar).
   */
  icon?: string | Component

  /**
   * Navigation target. Renders a router link. Tapping the item while it is
   * already the current route scrolls the shell to the top instead of
   * re-navigating.
   */
  to?: RouteLocationRaw

  /**
   * Highlight this item. Independent of the current route so one tab can stay
   * lit across a whole section (e.g. Home across community routes). Defaults to
   * whether `to` resolves to the current route.
   */
  active?: boolean
}
