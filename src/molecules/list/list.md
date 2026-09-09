# List

Composition-based list primitives under the `frappe-ui/list` subpath. Every list
surface is one column grid: a feed row is just the default column template, a
table is an explicit one. The family owns geometry — columns, dividers, hover
surfaces, selection and sort chrome — and nothing readable: cell contents
(typography, avatars, badges, unread emphasis) are entirely app-authored.

Not to be confused with the config-driven `ListView` in `frappe-ui/experimental`
— that stays untouched; import from `frappe-ui/list` for this family.

## Feed mode

The default template (`auto`, `minmax(0,1fr)`, `auto`) fits leading media,
content, and a right-aligned trailing cell. Rows with `to` render as
RouterLinks, rows with a click listener as buttons — real interactive elements,
so a row is clickable _or_ carries inline action buttons, never both (nested
interactive controls are invalid HTML); [row actions](#row-actions) shows how to
combine them. `selectable` reveals the animated checkbox column and switches row
click from navigate to toggle; selected values surface through
`v-model:selection`. When a `ListHeader` is present, a select-all checkbox
appears in it automatically — checked when every row is selected, mixed when
only some are, and toggling all rows on or off. It reasons over the full
`ListRows` items, so it covers virtualized rows too. `ListRows` resolves each
row's identity once and exposes it as the scoped `value` prop. The identity
defaults to the item's `name`/`id`; pass `row-key` (a field name or
`(item, index) => key`) when the row should use a different field.

Dividers default to `inset`: they start at the content column (the text edge) by
construction, never render above the first row, and hide around a hovered row so
the rounded hover surface floats free.

<ComponentPreview name="List-Feed" />

## Row actions

A row that needs a whole-row click _and_ inline action buttons keeps the row
static and stacks the two layers itself: a button with `absolute inset-0`
stretched over the row (rows are `position: relative`) is the whole-row target,
and every control that handles its own pointer events — action buttons, tooltip
triggers — gets `relative`, lifting it above the overlay. Which cells they live
in doesn't matter; DOM order does: the overlay first, the layered controls after
it. And because those controls are the overlay's siblings, not its children,
their clicks never reach it — no `stopPropagation`. Give the overlay
`type="button"` so it doesn't submit a surrounding form, and the row's own
radius so the focus outline follows the row's corners. A static row brings no
hover surface or content inset of its own, so add the hover/active classes and
`list-row-px-3` to keep the interactive look. One gap remains: dividers hide
around a hovered row only for interactive rows, so here the hover surface keeps
the rule at its top edge — live with it, or pass `divider="none"`. The Files and
Tasks recipes show the pattern at scale.

<ComponentPreview name="List-RowActions" />

## Active row

A master–detail list (a mail inbox, a file browser) tracks one open row. Bind
`v-model:active` to a row `value` and the List owns the rest: it highlights that
row and hides the dividers hugging it — above and below — so its rounded surface
floats free, like a hovered row but persistent. Clicking a row sets `active`;
unlike `selectable`, activation is additive, so the row's own `@click` and `to`
navigation still run. It's single-select and independent of the multi-select
checkbox `selection` — and works in feed or column mode.

```vue
<List v-model:active="openId">
  <ListRows :items="threads" v-slot="{ value }">
    <ListRow :value="value">…</ListRow>
  </ListRows>
</List>
```

## Column mode

Pass explicit `columns` and a `ListHeader`. The List resolves one template and
the header and every row read it, so the two grids can never drift.

Use deterministic track sizes. Every row is its own grid, so `auto` tracks size
against that row's content alone and nothing lines up — the intrinsic sizing a
real `<table>` shares across rows has no equivalent here. `minmax(0, 1fr)` for
the content column and fixed widths (or `fr` ratios) for the rest is the shape
that stays aligned.

`ListHeaderCell` is a plain label with optional `#prefix` / `#suffix`
adornments. Sortable columns use `ListHeaderCellSort` instead — a controlled
sort button: you hand it the active `direction` (`asc` / `desc` / `null`) and
update your own sort state in its `click` handler. Your code owns the state,
toggle rules, direction glyphs (via the scoped `#suffix="{ direction }"` slot),
and whether ordering happens client-side or through `useList` orderBy. The cell
keeps only the behavioral chrome: a real button, `aria-sort`, the tooltip, and
revealing an inactive column's suffix on hover. Both variants render the same
`data-slot="list-header-cell"` geometry, so mixing them in one header is
seamless.

<ComponentPreview name="List-Columns" />

## Responsive columns

A table that fits a desktop rarely fits a phone. Pass `columns` as an object
keyed by breakpoint and the List switches templates with the viewport:

```vue
<List
  :columns="{
    base: ['minmax(0,1fr)', '80px', '64px'],
    md: ['minmax(0,1fr)', '140px', '100px'],
    lg: ['minmax(0,2fr)', '180px', '120px'],
  }"
>
```

`base` is required and applies from zero width. Every other key names a
breakpoint from your own Tailwind `screens` and applies from that width upward,
until the next supplied breakpoint — `sm` and `xl` are missing above, so `sm`
keeps the `base` template and `xl` keeps the `lg` one.

Each breakpoint replaces the **whole** template. Nothing is merged track by
track, so a breakpoint is free to change the track count as well as the widths.

The switch happens in CSS, against your app's breakpoint values — a `md` you
redefined moves the list's tracks and your `md:hidden` utilities together. That
also means the server-rendered markup is already correct: there is no viewport
measurement, no resize listener and no first-paint flash.

A key names a screen, so every shape a Tailwind screen can take works, not only
a plain width: a `{ min, max }` screen gives a tier that ends where the screen
ends, a `{ max }` screen one that applies below a width, and a `{ raw }` screen
one that applies wherever its query matches. In each case the tier is live in
exactly the same places as that screen's own variants. Where two screens match
at once, the tier that wins is the one whose utilities win.

**A key that is not one of your screens is ignored.**
`{ base: […], medium: […] }` renders `base` at every width, because `medium`
names no breakpoint and nothing switches to it. Breakpoint names come from your
Tailwind config, so the type cannot reject the key — the index signature on
`ListColumnsByBreakpoint` has to stay open for apps with custom screens. A
development build warns instead, naming the key and listing the screens it could
have been:

```
[frappe-ui] List: `columns` key `medium` is not one of this app's Tailwind
screens (base, sm, md, lg, xl), so its template is ignored and the list keeps
the one below it.
```

The warning is stripped from production builds. It needs frappe-ui's Tailwind
preset, which is what tells the List which screens your app defines; without the
preset every key above `base` is ignored anyway, and the warning says so.

Changing the track count never hides a cell. Say that part explicitly, with
matching classes on the header and the rows:

```vue
<List
  :columns="{ base: ['minmax(0,1fr)', '64px'], md: ['minmax(0,1fr)', '140px', '100px'] }"
>
  <ListHeader>
    <ListHeaderCell>Member</ListHeaderCell>
    <ListHeaderCell class="max-md:hidden">Role</ListHeaderCell>
    <ListHeaderCell>Since</ListHeaderCell>
  </ListHeader>
  …
</List>
```

Each `List` owns its own columns. A list nested inside another list keeps its
own `columns` prop, or the default feed template when it has none — an outer
template never reaches it.

Row height stays a plain prop. A per-breakpoint height would silently desync
`virtual` windowing, so `rowHeight` is one number at every width; for a
non-virtual list, set responsive heights with height classes on the rows.

<ComponentPreview name="List-Responsive" />

## Virtual rows

`ListRows` iterates items through its scoped slot; with `virtual`, only rows
near the viewport mount. The scoped slot receives `{ item, index, value }`,
where `value` is the string row identity used by select-all and active-row
state. The scroll container is the nearest scrollable ancestor — the list
windows against an app-owned scroll area (a settings body, the page) and keeps
its scrollbar. `itemHeight` defaults to the List's `rowHeight`. The underlying
composable, `useVirtualRows`, is exported for exotic cases.

<ComponentPreview name="List-Virtual" csr="true" />

## Styling hooks

`--list-gap` (default `0.5rem`) and `--list-row-padding-x` are the list's public
CSS hooks. Set them with plain (responsive) classes on the `List` — or on any
ancestor, to theme every list in a subtree. Their defaults live in `var()`
fallbacks, so a consumer value always wins.

Column templates are deliberately not a hook. They come from the `columns` prop
alone, which is what lets every `List` — nested ones included — own its own
grid.

`--list-row-padding-x` is the inline content inset, and its default is
asymmetric on purpose: interactive rows get `0.75rem` so the rounded hover
surface clears their content, while static rows, the header and group headers
sit flush at `0` — a header can't tell whether its sibling rows are interactive.
Setting the hook gives every row and the header the same value. A column-mode
list with clickable rows and a header should always set it (`list-row-px-3`) so
the header labels stay aligned with the cell text below them. The checkbox
column follows the same rule: in a `selectable` list with a header, the hook is
also what lines the select-all checkbox up with the row checkboxes.

For both hooks the frappe-ui Tailwind preset ships spacing-scale utilities —
`list-gap-*` and `list-row-px-*` — so the usual authoring form is
`max-sm:list-gap-3 sm:list-gap-4` rather than raw `[--list-gap:0.75rem]`
properties. Both forms hit the same CSS vars.

The prop/hook split follows one rule: knobs that drive behavior are props
(`columns` also flips the divider default, `rowHeight` also feeds `virtual`
windowing), knobs that are pure geometry are CSS hooks. Vars with a `--_list`
prefix are internal, not API — they can change in any release, and they reset at
every `List`, so a nested list never inherits an outer list's props. The
resolved column template is one of them.

Cells (and plain header cells) are flex containers with `items-center` — align
content with justify utilities (`class="justify-end"` for numeric columns),
responsively if needed. For sortable numeric headers, use
`<ListHeaderCellSort align="end">` so the sort glyph moves to the leading side
and the label stays flush with the column edge.

Slots for CSS targeting:
`data-slot="list | list-header | list-header-cell | list-header-checkbox | list-row | list-cell | list-row-checkbox | list-group | list-group-header | list-divider"`.
Slots not listed here are internal and may change. State:
`data-state="selected"` (checkbox selection), `data-active` (+ `aria-current`,
the `v-model:active` row) and `data-interactive` on rows, `data-sort` on the
active header cell.

Accessibility follows header presence: `role="list"` / `"listitem"` without a
`ListHeader`, `table` / `row` / `columnheader` / `cell` (plus `aria-sort`) with
one.

<!-- @include: ./list.api.md -->
