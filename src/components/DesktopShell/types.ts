export interface DesktopShellProps {
  /**
   * Whether the content area scrolls as one page. Defaults to `true`.
   *
   * Pass `false` for a multi-pane layout where the panes own their own
   * overflow — a list-and-detail split, or a board whose columns scroll
   * separately. The content area then fills the remaining height and never
   * page-scrolls, instead of the app faking it with `absolute inset-0` or a
   * hardcoded `h-[calc(100vh-3rem)]`.
   *
   * `false` also means there is no shell scroll element, so
   * `shellScrollContainer` stays `null` and `useShellScrolled()` stays `false`.
   */
  scroll?: boolean
  /**
   * The physical edge the navigation (rail and sidebar) sits on. Defaults to
   * `'left'`.
   *
   * `'right'` draws the shell right to left with `flex-row-reverse`. The DOM
   * order stays rail, sidebar, content, so Tab reaches the navigation first on
   * both sides. `SidebarRailItem` reads the value: its tooltip opens away from
   * the navigation and its active bar sits on the outer edge.
   *
   * It is a physical side and assumes a left-to-right page. Map "start" and
   * "end" onto it in the app. `SidebarRailItem` and a collapsed
   * `SidebarItem` read it for their tooltips. Borders and handles are not
   * mirrored.
   */
  navSide?: 'left' | 'right'
}
