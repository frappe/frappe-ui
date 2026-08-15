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
interactive controls are invalid HTML). For a row that needs both, keep the row
static: put the actions in a trailing cell and stretch the primary action over
the row from another cell — a button with `absolute inset-0` (rows are
`position: relative`) — layering the action buttons above it with `relative`.
The Files recipe shows the pattern. `selectable` reveals the animated checkbox
column and switches row click from navigate to toggle; selected values surface
through `v-model:selection`. When a `ListHeader` is present, a select-all
checkbox appears in it automatically — checked when every row is selected, mixed
when only some are, and toggling all rows on or off. It reasons over the full
`ListRows` items, so it covers virtualized rows too. `ListRows` resolves each
row's identity once and exposes it as the scoped `value` prop. The identity
defaults to the item's `name`/`id`; pass `row-key` (a field name or
`(item, index) => key`) when the row should use a different field.

Dividers default to `inset`: they start at the content column (the text edge) by
construction, never render above the first row, and hide around a hovered row so
the rounded hover surface floats free.

<ComponentPreview name="List-Feed" />

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

Pass explicit `columns` (deterministic track sizes — `auto` tracks size
independently per row) and a `ListHeader`. Header and rows share one
`--list-columns` template, so they can never drift.

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

`--list-columns`, `--list-gap` (default `0.5rem`) and `--list-row-padding-x` are
the list's public CSS hooks. Set them with plain (responsive) classes on the
`List` — or on any ancestor, to theme every list in a subtree. Their defaults
live in `var()` fallbacks, so a consumer value always wins, even over the
`columns` prop — which is how people-style lists collapse to a feed on mobile
with no dedicated API:

```vue
<List
  :columns="['minmax(8rem,1fr)', '5.5rem', '5.5rem']"
  class="max-sm:[--list-columns:auto_minmax(0,1fr)_auto]"
>
```

with `max-sm:hidden` on the numeric cells and the `ListHeader`.

`--list-row-padding-x` is the inline content inset, and its default is
asymmetric on purpose: interactive rows get `0.75rem` so the rounded hover
surface clears their content, while static rows, the header and group headers
sit flush at `0` — a header can't tell whether its sibling rows are interactive.
Setting the hook gives every row and the header the same value. A column-mode
list with clickable rows and a header should always set it (`list-row-px-3`) so
the header labels stay aligned with the cell text below them. The checkbox
column follows the same rule: in a `selectable` list with a header, the hook is
also what lines the select-all checkbox up with the row checkboxes.

For `--list-gap` and `--list-row-padding-x`, the frappe-ui Tailwind preset ships
spacing-scale utilities — `list-gap-*` and `list-row-px-*` — so the usual
authoring form is `max-sm:list-gap-3 sm:list-gap-4` rather than raw
`[--list-gap:0.75rem]` properties. `list-cols-[…]` is the same sugar for
`--list-columns`, arbitrary values only — track templates have no meaningful
scale. Both forms hit the same CSS vars.

The prop/hook split follows one rule: knobs that drive behavior are props
(`columns` also flips the divider default, `rowHeight` also feeds `virtual`
windowing), knobs that are pure geometry are CSS hooks. Row height is
deliberately a prop alone — a per-breakpoint height var would silently desync
virtual windowing; in non-virtual lists, set responsive heights with height
classes on the rows. Vars with a `--_list` prefix are internal carriers, not API
— they can change in any release, and they reset at every `List`, so a nested
list never inherits an outer list's props.

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
