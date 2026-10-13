/**
 * Changes to make in frappe UI — on hold until the team approves them, the
 * same arrangement as the two files under `v1/` and `v2/`. The Sidebar
 * entries are measured against the sidebar in node 35188:99065.
 *
 * Each value reproduces, from the outside, one change proposed for the
 * component itself, so the shell shows the proposed look while the library
 * stays untouched. When a change lands, delete its entry and the binding that
 * uses it; the render should not move.
 *
 * Measured against the sidebar in node 35188:99065.
 */

/**
 * `SidebarHeader` puts 2px between its title and its subtitle (`mt-0.5`).
 * Espresso's header cell is a 4px vertical stack: a 16.1px title line, 4, and
 * a 14.95px subtitle, which is the 35px the cell's body measures.
 *
 * Addressed as "the div after the first one" inside the header's text column,
 * because `mt-0.5` can't be written as a Tailwind variant without escaping the
 * dot in its own class name.
 */
export const headerTextGap =
  '[&_[data-slot=sidebar-header]_.flex-col>div+div]:!mt-1'

/**
 * The sidebar has no padding of its own, and `SidebarHeader` is a 48px region
 * with its 40px row centred — so the row starts 4px down. Espresso pads the
 * sidebar by 8 at the top (and 10 at the bottom), which is where the header
 * cell begins. `pt-1` makes up the difference; the 4px already in the header's
 * own region does the rest.
 */
export const sidebarTopPadding = 'pt-1'

/**
 * Select, ghost variant: the focus fill is `:focus`, not `:focus-visible`.
 *
 * `src/components/Select/utils.ts` gives the ghost trigger
 * `focus:bg-surface-gray-3`, so the grey stays on after a *mouse* click too —
 * open the menu, pick a role, and the control keeps a filled, focused look
 * with the pointer nowhere near it. Only a keyboard should leave that mark.
 *
 * These sit on the trigger itself — with no label, `Select` passes the class
 * straight to its button rather than to a wrapper — so the selectors are
 * `&:focus`, not `&_button:focus`. `:focus-visible` is doubled so it outranks
 * the library's `focus:` rule whatever order the two land in.
 */
export const ghostSelectFocus = [
  '[&:focus]:!bg-transparent',
  '[&:focus-visible:focus-visible]:!bg-surface-gray-3',
].join(' ')
