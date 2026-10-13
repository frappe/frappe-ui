/**
 * Changes to make in frappe UI — on hold until the team approves them.
 *
 * Each value below reproduces, from the outside, one change proposed for the
 * frappe-ui components themselves, so the playground shows the proposed look
 * while the library stays untouched. When a change lands in frappe-ui, delete
 * its entry here and the bindings that use it; the render should not move.
 */

/** SettingsDialog: default `size` 4xl → 5xl (1024px, Espresso's modal width). */
export const dialogSize = '5xl' as const

/** SettingsSidebar: bottom padding 8px → 10px (`p-2` → `p-2 pb-2.5`). */
export const sidebar = 'pb-2.5'

/**
 * SettingsSidebar: gap between nav groups 16px → 8px (`space-y-4` →
 * `space-y-2`). The library's own wrapper isn't reachable from outside, so
 * this goes on a plain wrapper around the groups; with one child inside it,
 * the library's `space-y-4` has nothing to space.
 */
export const navGroups = 'space-y-2'

/** SettingsNavGroup: 4px between the group label and its items. */
export const navGroup = 'flex flex-col gap-1'

/**
 * SettingsBody: content inset `px-[4.4rem] pb-16` → `px-[52px] pb-12`.
 * Targets the scroll area's own `data-slot` hook, since SettingsBody has no
 * prop for its viewport padding.
 */
export const body =
  '[&_[data-slot=scroll-area-viewport]]:px-[52px] [&_[data-slot=scroll-area-viewport]]:pb-12'

/**
 * Divider: `outline-gray-2` → `outline-gray-1`, the colour Espresso uses
 * between categories. `!` because the library's own colour class sits on the
 * same element and would otherwise win on stylesheet order.
 */
export const divider = '!border-outline-gray-1'
