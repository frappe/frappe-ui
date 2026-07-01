import type { RouteLocationRaw } from 'vue-router'

export interface RailItemProps {
  /** Tooltip text and the base of the item's accessible label. */
  label: string

  /**
   * Icon CSS class, e.g. `lucide-search`. Rendered centered in the cell.
   * Ignored when the default slot is used (for an image, avatar, or initials).
   */
  icon?: string

  /**
   * Navigation target. When set, the item renders as a router link; otherwise
   * it renders as a button. A `click` event fires in both cases.
   */
  to?: RouteLocationRaw

  /** Marks the item as the current destination (indicator bar / active fill). */
  active?: boolean

  /** Unread count. Drives the badge and folds into the accessible label. */
  badge?: number

  /** How the badge renders: a count pill or a small dot. */
  badgeStyle?: 'count' | 'dot'

  /**
   * Visual treatment.
   * - `tile` (default): a filled cell with a left indicator bar when active —
   *   for image/avatar items like communities or workspaces.
   * - `ghost`: transparent until hovered, a raised highlight when active — for
   *   icon shortcuts like Search or Notifications.
   */
  variant?: 'tile' | 'ghost'
}
