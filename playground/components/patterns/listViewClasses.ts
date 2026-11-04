/**
 * The Espresso treatment for `ListView`, shared by every table pattern so the
 * three tables can't drift apart.
 *
 * What it changes, and why:
 *
 * - **Label row.** ListView draws it as a filled, rounded bar with 8px under
 *   it. Espresso draws a plain 32px row sitting straight on the first row: no
 *   fill, no rounding, no gap. (`!h-8` because its own bar lands at 31 — its
 *   label line is 15.)
 *
 * - **The rules.** Espresso runs every rule the full width of the row, with
 *   the checkbox sitting 8px inside it. ListView insets the rules between rows
 *   by 8px (`h-px border-t mx-2`) while the label row's `border-b` ran full
 *   width, so the label rule poked out at each end. Both are pinned to the
 *   row's own edges here — the label rule as a pseudo-element, since the label
 *   row carries padding the rule must ignore.
 *
 * - **Row hover.** ListView washes an unselected row in `surface-sidebar`,
 *   which is pure black in the dark theme — darker than the page, so the hover
 *   reads as nothing. `surface-gray-1` lifts in both themes.
 *   A row that carries its own controls is never a click target, so it gets no
 *   hover at all — use `espressoListViewStatic` there.
 *
 * Every class is spelled out: Tailwind's scanner reads this file as text, so a
 * name assembled from a variable would never be generated.
 */
const base = [
  '[&_.grid.rounded-4.bg-surface-gray-2]:!mb-0',
  '[&_.grid.rounded-4.bg-surface-gray-2]:!h-8',
  '[&_.grid.rounded-4.bg-surface-gray-2]:!rounded-none',
  '[&_.grid.rounded-4.bg-surface-gray-2]:!bg-transparent',
  '[&_.grid.rounded-4.bg-surface-gray-2]:relative',
  "[&_.grid.rounded-4.bg-surface-gray-2]:after:content-['']",
  '[&_.grid.rounded-4.bg-surface-gray-2]:after:absolute',
  '[&_.grid.rounded-4.bg-surface-gray-2]:after:inset-x-0',
  '[&_.grid.rounded-4.bg-surface-gray-2]:after:bottom-0',
  '[&_.grid.rounded-4.bg-surface-gray-2]:after:border-t',
  '[&_.grid.rounded-4.bg-surface-gray-2]:after:border-outline-gray-1',
  // The rules between rows arrive inset 8px; Espresso runs them full width.
  '[&_.h-px.border-t]:!mx-0',

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


  // A selected row is treated the same way as a hovered one: it lifts out of
  // the list, so the rules that would cut it off disappear — the one it draws
  // under itself, and the one belonging to the row above it. A run of selected
  // rows therefore reads as a single block; ListView rounds its ends already.
  '[&_.transition-all.bg-surface-gray-2_.h-px]:opacity-0',
  '[&_.transition-all:has(+.transition-all.bg-surface-gray-2)_.h-px]:opacity-0',

  // ListView fades a row over 300ms, which makes a hover read as an event.
  // Espresso's tables barely move: the fill arrives, it doesn't animate in.
  '[&_.transition-all]:!duration-75',

  // The "N rows selected" bar floats over the table, so it has to sit above
  // the page rather than on it: ListView gives it `surface-base`, which is
  // the page's own colour and disappears in the dark theme.
  '[&_.shadow-2xl]:!bg-surface-elevation-1',

  // Its close button ends 16px from the edge against 8px above and below,
  // because the bar is padded for text. Trim the side it sits on.
  '[&_.shadow-2xl]:!pr-2',

  // `--elevation-*` is only ever emitted in its light form (see
  // tailwind/colorPalette.js — `generateEffectVariables` writes
  // `effects.elevation.light` to `:root` and never writes the dark set), so in
  // the dark theme every raised surface wears a 16% white inner highlight
  // meant for a white card. This is the design system's own dark 2xl.
  'dark:[&_.shadow-2xl]:!shadow-[inset_0_0.5px_1.5px_0.5px_#ffffff0f,0_0_14px_10px_#0000001f,0_44px_52px_-4px_#0000006b]',

  // Its checkbox is disabled — it reports the selection, it doesn't take a
  // click — but it is drawn greyed out, which reads as "unavailable" rather
  // than "checked". Only the fill is corrected: a checked box has no border
  // of its own, so nothing is drawn around it. `cursor-default` so it doesn't
  // advertise a click either.
  '[&_.shadow-2xl_input]:!text-[--surface-gray-10]',
  '[&_.shadow-2xl_input]:!cursor-default',

  // The label row's rule belongs to the first row the way every other rule
  // belongs to the row above it: when that row is selected, it goes too, so
  // the block is never cut off at the top. The hover half of this lives in
  // `espressoListView` — a table with no row hover must not lose its label
  // rule to one, which reads as the border flickering out under the cursor
  // with nothing else happening.
  '[&_.grid.rounded-4.bg-surface-gray-2:has(+*>.transition-all:first-child.bg-surface-gray-2)]:after:opacity-0',
]

/**
 * For a table whose rows are click targets.
 *
 * The hovered row lifts out of the list: a rounded block, with the rules on
 * either side of it taken away. Each row draws its own rule underneath itself,
 * so "the rule above" belongs to the row before — hence the `:has(+ …:hover)`.
 * They go to `opacity-0` rather than `hidden`, so nothing shifts by a pixel as
 * the cursor moves down the table.
 *
 * The rule is a *descendant* of the row, not a child: ListRow wraps everything
 * in a `<button>` and the rule sits inside that, beside the cell grid.
 *
 * `:not(.bg-surface-gray-2)` leaves selected rows alone: they have their own
 * hover, and their corners are already set by the block they sit in.
 */
export const espressoListView = [
  // A clickable row's wrapper button is the full width of the table, which is
  // also the width of the scroll container — so a ring drawn outside it is cut
  // at both ends. On a full-bleed row the ring belongs inside anyway.
  '[&_.transition-all.flex-col>button:focus-visible]:!outline-offset-[-3px]',
  '[&_.grid.rounded-4.bg-surface-gray-2:has(+*>.transition-all:first-child:hover)]:after:opacity-0',
  '[&_.transition-all.flex-col:not(.bg-surface-gray-2):hover]:!bg-surface-gray-1',
  '[&_.transition-all.flex-col:not(.bg-surface-gray-2):hover]:!rounded-4',
  '[&_.transition-all.flex-col:hover_.h-px]:opacity-0',
  '[&_.transition-all.flex-col:has(+.transition-all:hover)_.h-px]:opacity-0',
  ...base,
].join(' ')

/**
 * For a table whose rows carry their own controls, so nothing is hoverable.
 * Nothing in here responds to `:hover` at all — not the row, and not the
 * label row's rule above it.
 */
export const espressoListViewStatic = [
  // `options.getRowRoute: () => null` (see `espressoStaticOptions`) turns the
  // row wrapper from a <button> into a div, so a row with its own controls is
  // neither a tab stop nor a button nested in a button — and there is no
  // full-width focus ring left to be clipped. Passing a route getter does make
  // ListView think the row is hoverable, so the fill and the pointer go here.
  '[&_.transition-all.flex-col]:!cursor-default',
  '[&_.transition-all.flex-col:hover]:!bg-transparent',
  ...base,
].join(' ')

/** Pair with `espressoListViewStatic`: no selection, no route, no tooltips. */
export const espressoStaticOptions = {
  selectable: false,
  showTooltip: false,
  getRowRoute: () => null,
}

/**
 * The Espresso treatment for ListView's *grouped* rows, on top of
 * `espressoListView`. ListView goes into this mode on its own as soon as
 * every row carries `{ group, rows }`, and draws a group as three siblings:
 * the header (a chevron button plus whatever the `#group-header` slot puts
 * after it), a rule, and the rows.
 *
 * Measured off the file (node 35171:100039):
 *
 * - **The header row is 32px**, the same as the label row, with its rule as
 *   the last pixel inside it rather than a 33rd underneath. ListView leaves
 *   the row to be as tall as its 24px chevron button and hangs the rule below.
 *   The `#group-header` slot does *not* replace ListGroupHeader's own
 *   `w-full py-1.5 pe-2` wrapper — `ListGroups` renders that slot through
 *   `list.slots`, inside the wrapper, not in place of it — so the 6px above
 *   and below still apply and push the content to 33, half a pixel out of the
 *   row at each end. Its padding goes, and the row centres the line itself.
 *
 * - **The chevron sits where the checkbox sits** — 8px in — with the label 8
 *   after it. ListView's `ms-[3px] me-[11px]` puts the glyph at 7 and leaves
 *   12, so both margins go to 4: the button is 24 wide around a 16px glyph,
 *   which is 4 of padding on each side.
 *
 * - **Nothing between the header and the first row**, 20 to the next group.
 *   ListView puts both on the rows themselves (`mt-2 mb-5`), so the 20 goes
 *   with them when a group is collapsed and the next heading lands against
 *   this one's rule. The gap moves to the group itself, and skips the last
 *   one so the table doesn't end on 20px of nothing.
 *
 * - **16px between the label row and the first group**, which is 16 more than
 *   ListView leaves.
 *
 * - **A group's last row draws no rule.** The 20px gap ends the group; a rule
 *   as well reads as a line left hanging. ListView would draw one on every
 *   row here — its `isLastRow` compares a row against `rows[last]`, which in
 *   this mode is a *group*, so it is never true.
 *
 * - The header's rule belongs to the first row under it, the same way the
 *   label row's rule belongs to the first row of an ungrouped table: it goes
 *   when that row is hovered or selected, so the block is never cut off.
 */
export const espressoListViewGroups = [
  '[&_.overflow-y-auto>div>.flex.items-center]:!h-8',
  '[&_.overflow-y-auto>div>.flex.items-center>.w-full]:!py-0',
  '[&_.border-outline-elevation-2]:!-mt-px',
  '[&_.border-outline-elevation-2]:!border-outline-gray-1',

  '[&_.overflow-y-auto>div>.flex.items-center>button]:!ms-1',
  '[&_.overflow-y-auto>div>.flex.items-center>button]:!me-1',
  '[&_.overflow-y-auto>div>.flex.items-center>button>svg]:!text-ink-gray-9',

  '[&_.mb-5]:!mt-0',
  '[&_.mb-5]:!mb-0',
  '[&_.overflow-y-auto>div:not(:last-child)]:!mb-5',
  '[&_.overflow-y-auto>div:first-child>.flex.items-center]:!mt-4',
  '[&_.mb-5>:last-child_.h-px]:!hidden',

  '[&_.border-outline-elevation-2:has(+.mb-5>.transition-all:first-child:hover)]:opacity-0',
  '[&_.border-outline-elevation-2:has(+.mb-5>.transition-all:first-child.bg-surface-gray-2)]:opacity-0',
].join(' ')
