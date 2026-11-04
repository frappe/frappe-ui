/**
 * The settings modal's tables on `ListView`, matching what the `List` family
 * drew before them — same 40px label row, same 65.9px content-height rows,
 * same flush left edge, same 8px column gaps, same rule under every row.
 *
 * `ListView`'s own shape has to be undone in four places:
 *
 * - **The label row** is a filled, rounded `surface-gray-2` bar with 8px of
 *   padding and 8px under it. Here it is a plain 40px row, unfilled, flush at
 *   both ends, with a single `outline-gray-1` rule along its bottom.
 *
 * - **The row grid** carries `gap-4` and `px-2`. The settings tables sit flush
 *   with the pattern's left edge and space their columns by 8.
 *   `:not(.rounded-4)` keeps these off the label row, which shares the same
 *   three classes and needs `p-0` instead.
 *
 * - **The last row draws no rule.** `ListRow` omits it on `isLastRow`, so it
 *   can't be styled back in; the rows container carries it instead.
 *
 * - **Hover.** These rows hold their own controls, so nothing about them is a
 *   click target. `options.getRowRoute` returning `null` for every row is what
 *   stops `ListRow` wrapping its cells in a `<button>` — a button around a
 *   Select or a Switch is invalid, and makes every row a tab stop — but it
 *   also makes `isHoverable` true, so the fill and the pointer both go here.
 */
export const settingsListView = [
  '[&_.grid.rounded-4.bg-surface-gray-2]:!mb-0',
  '[&_.grid.rounded-4.bg-surface-gray-2]:!h-10',
  // The label row is a flex item in a column that ListView gives `flex-1`, so
  // without this it shrinks off its 40 to whatever the container has spare.
  '[&_.grid.rounded-4.bg-surface-gray-2]:!shrink-0',
  '[&_.grid.rounded-4.bg-surface-gray-2]:!rounded-none',
  '[&_.grid.rounded-4.bg-surface-gray-2]:!bg-transparent',
  '[&_.grid.rounded-4.bg-surface-gray-2]:!p-0',
  '[&_.grid.rounded-4.bg-surface-gray-2]:!gap-2',
  '[&_.grid.rounded-4.bg-surface-gray-2]:relative',
  "[&_.grid.rounded-4.bg-surface-gray-2]:after:content-['']",
  '[&_.grid.rounded-4.bg-surface-gray-2]:after:absolute',
  '[&_.grid.rounded-4.bg-surface-gray-2]:after:inset-x-0',
  '[&_.grid.rounded-4.bg-surface-gray-2]:after:bottom-0',
  '[&_.grid.rounded-4.bg-surface-gray-2]:after:border-t',
  '[&_.grid.rounded-4.bg-surface-gray-2]:after:border-outline-gray-1',

  '[&_.grid.items-center.gap-4:not(.rounded-4)]:!gap-2',
  '[&_.grid.items-center.gap-4:not(.rounded-4)]:!px-0',
  '[&_.grid.items-center.gap-4:not(.rounded-4)]:!py-3',

  // The rule sits on the row's last pixel rather than adding one to it: the
  // List version drew 65.9px rows *including* their rule, and without this
  // every row but the last comes out a pixel taller than the last.
  '[&_.h-px.border-t]:!mx-0',
  '[&_.h-px.border-t]:!-mt-px',

  // A focus ring is an `outline` drawn 3px outside the control, and ListView
  // nests three boxes that clip it: each cell is `overflow-x-hidden` (which
  // makes the y axis `auto` too), the rows container is `overflow-y-auto`
  // (same effect on x), and the width wrapper is `overflow-y-hidden`. Any
  // control that fills its cell — a select, a switch, a menu button — has its
  // ring cut on every side. None of the three is holding anything in: the
  // cells' own content truncates itself.
  '[&_.overflow-x-hidden]:!overflow-visible',
  // A control in the first or last column sits flush with the table's own
  // edge, which is also the edge of the scroll container — and a scroller has
  // to clip, so a ring drawn outside it is cut on that side. Those two
  // columns draw their ring inside instead. Nothing moves: only the focus
  // state differs, and only where it would otherwise be sliced.
  '[&_.grid>*:first-child_button:focus-visible]:!outline-offset-[-3px]',
  '[&_.grid>*:last-child_button:focus-visible]:!outline-offset-[-3px]',
  '[&_.grid>*:first-child_input:focus-visible]:!outline-offset-[-3px]',
  '[&_.grid>*:last-child_input:focus-visible]:!outline-offset-[-3px]',
  '[&_.grid>*:first-child:focus-visible]:!outline-offset-[-3px]',
  '[&_.grid>*:last-child:focus-visible]:!outline-offset-[-3px]',

  '[&_.h-full.overflow-y-auto]:!overflow-visible',
  // The width wrapper is the element ListView puts this very class list
  // on, so it frees itself rather than a descendant.
  '!overflow-visible',

  // …and the rule the last row doesn't draw is painted on the rows container
  // as a pseudo-element, so it lands on that row's last pixel instead of
  // adding a 371st to the block.
  '[&_.h-full.overflow-y-auto]:relative',
  "[&_.h-full.overflow-y-auto]:after:content-['']",
  '[&_.h-full.overflow-y-auto]:after:absolute',
  '[&_.h-full.overflow-y-auto]:after:inset-x-0',
  '[&_.h-full.overflow-y-auto]:after:bottom-0',
  '[&_.h-full.overflow-y-auto]:after:border-t',
  '[&_.h-full.overflow-y-auto]:after:border-outline-gray-1',

  '[&_.transition-all.flex-col]:!cursor-default',
  '[&_.transition-all.flex-col:hover]:!bg-transparent',
].join(' ')

/** Every settings table is static: no selection, no row click, no tooltips. */
export const settingsListViewOptions = {
  selectable: false,
  showTooltip: false,
  rowHeight: 'auto',
  getRowRoute: () => null,
}

/**
 * The data grid is its own shape: every cell draws its own rules, so none of
 * the row-level treatment above applies. Against `ListView` —
 *
 * - The label row goes to 28 and its cells carry the rules, so the
 *   pseudo-element rule the other tables use is not wanted here.
 * - Row cells are 40 tall with 8px sides and a rule on the bottom and the
 *   right; `ListRow`'s own `h-px` rule is hidden, since the cell borders draw
 *   it. The last row's bottom rule goes too — the wrapper's border is there.
 * - `overflow-visible` on the rows container: `overflow-y-auto` makes a box a
 *   scroll container on *both* axes, which would anchor the frozen column to
 *   the rows rather than to the grid's own horizontal scroll, and nothing
 *   would stick.
 */
export const dataGridListView = [
  'w-max',

  '[&_.grid.rounded-4.bg-surface-gray-2]:!mb-0',
  '[&_.grid.rounded-4.bg-surface-gray-2]:!h-7',
  '[&_.grid.rounded-4.bg-surface-gray-2]:!shrink-0',
  '[&_.grid.rounded-4.bg-surface-gray-2]:!rounded-none',
  '[&_.grid.rounded-4.bg-surface-gray-2]:!bg-transparent',
  '[&_.grid.rounded-4.bg-surface-gray-2]:!p-0',
  '[&_.grid.rounded-4.bg-surface-gray-2]:!gap-0',
  '[&_.grid.rounded-4.bg-surface-gray-2>div]:!h-7',
  '[&_.grid.rounded-4.bg-surface-gray-2>div]:!px-2',
  '[&_.grid.rounded-4.bg-surface-gray-2>div]:border-b',
  '[&_.grid.rounded-4.bg-surface-gray-2>div]:border-r',
  '[&_.grid.rounded-4.bg-surface-gray-2>div]:border-outline-gray-1',
  '[&_.grid.rounded-4.bg-surface-gray-2>div:last-child]:!border-r-0',
  '[&_.grid.rounded-4.bg-surface-gray-2>div:first-child]:sticky',
  '[&_.grid.rounded-4.bg-surface-gray-2>div:first-child]:left-0',
  '[&_.grid.rounded-4.bg-surface-gray-2>div:first-child]:z-20',
  '[&_.grid.rounded-4.bg-surface-gray-2>div:first-child]:bg-surface-base',

  '[&_.grid.items-center.gap-4:not(.rounded-4)]:!gap-0',
  '[&_.grid.items-center.gap-4:not(.rounded-4)]:!px-0',
  '[&_.grid.items-center.gap-4:not(.rounded-4)>div]:!flex',
  '[&_.grid.items-center.gap-4:not(.rounded-4)>div]:!h-10',
  '[&_.grid.items-center.gap-4:not(.rounded-4)>div]:!items-center',
  '[&_.grid.items-center.gap-4:not(.rounded-4)>div]:!px-2',
  '[&_.grid.items-center.gap-4:not(.rounded-4)>div]:border-b',
  '[&_.grid.items-center.gap-4:not(.rounded-4)>div]:border-r',
  '[&_.grid.items-center.gap-4:not(.rounded-4)>div]:border-outline-gray-1',
  '[&_.grid.items-center.gap-4:not(.rounded-4)>div:last-child]:!border-r-0',
  '[&_.grid.items-center.gap-4:not(.rounded-4)>div:first-child]:sticky',
  '[&_.grid.items-center.gap-4:not(.rounded-4)>div:first-child]:left-0',
  '[&_.grid.items-center.gap-4:not(.rounded-4)>div:first-child]:z-10',
  '[&_.grid.items-center.gap-4:not(.rounded-4)>div:first-child]:bg-surface-base',
  '[&_.grid.items-center.gap-4:not(.rounded-4)>div:first-child]:justify-center',

  '[&_.h-px.border-t]:!hidden',
  '[&_.overflow-x-hidden]:!overflow-visible',
  '[&_.h-full.overflow-y-auto]:!overflow-visible',
  // The width wrapper is the element ListView puts this very class list
  // on, so it frees itself rather than a descendant.
  '!overflow-visible',
  '[&_.h-full.overflow-y-auto>:last-child_.grid>div]:!border-b-0',

  '[&_.transition-all.flex-col]:!cursor-default',
  '[&_.transition-all.flex-col:hover]:!bg-transparent',
].join(' ')
