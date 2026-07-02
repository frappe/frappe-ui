export interface DesktopShellProps {
  /**
   * Classes for the content card that wraps the page header and scroll region.
   * Overrides the default look — radius, background, shadow, borders, and the
   * outer float spacing (the card's margin). The shell always applies the
   * structural classes (`flex min-w-0 flex-1 flex-col overflow-hidden`) on top.
   */
  cardClass?: string
}
