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
}
