# List

Composition-based list primitives under the `frappe-ui/list` subpath. Every
list surface is one column grid: a feed row is just the default column
template, a table is an explicit one. The family owns geometry — columns,
dividers, hover surfaces, selection and sort chrome — and nothing readable:
cell contents (typography, avatars, badges, unread emphasis) are entirely
app-authored.

Not to be confused with the config-driven `ListView` in the main entry —
that stays untouched; import from `frappe-ui/list` for this family.

## Feed mode

The default template (`auto`, `minmax(0,1fr)`, `auto`) fits leading media,
content, and a right-aligned trailing cell. Rows with `to` render as
RouterLinks, rows with a click listener as buttons. `selectable` reveals the
animated checkbox column and switches row click from navigate to toggle;
selected values surface through `v-model:selection`. When a `ListHeader` is
present, a select-all checkbox appears in it automatically — checked when every
row is selected, mixed when only some are, and toggling all rows on or off. It
reasons over the full `ListRows` items, so it covers virtualized rows too. Each
row's identity defaults to its `name`/`id`; if a row's `:value` is something
else, pass `ListRows`' `row-key` (a field name or `(item, index) => key`) so the
select-all universe matches your values.

Dividers default to `inset`: they start at the content column (the text
edge) by construction, never render above the first row, and hide around a
hovered row so the rounded hover surface floats free.

<ComponentPreview name="List-Feed" />

## Active row

A master–detail list (a mail inbox, a file browser) tracks one open row. Bind
`v-model:active` to a row `value` and the List owns the rest: it highlights
that row and hides the dividers hugging it — above and below — so its rounded
surface floats free, like a hovered row but persistent. Clicking a row sets
`active`; unlike `selectable`, activation is additive, so the row's own
`@click` and `to` navigation still run. It's single-select and independent of
the multi-select checkbox `selection` — and works in feed or column mode.

```vue
<List v-model:active="openId">
  <ListRows :items="threads" v-slot="{ item }">
    <ListRow :value="item.name">…</ListRow>
  </ListRows>
</List>
```

## Column mode

Pass explicit `columns` (deterministic track sizes — `auto` tracks size
independently per row) and a `ListHeader`. Header and rows share one
`--list-columns` template, so they can never drift.

`ListHeaderCell` is a plain label with optional `#prefix` / `#suffix`
adornments. Sortable columns use `ListHeaderCellSort` instead — a controlled
sort button: you hand it the active `direction` (`asc` / `desc` / `null`)
and update your own sort state in its `click` handler. Your code owns the
state, toggle rules, direction glyphs (via the scoped `#suffix="{ direction }"`
slot), and whether ordering happens client-side or through `useList`
orderBy. The cell keeps only the behavioral chrome: a real button,
`aria-sort`, the tooltip, and revealing an inactive column's suffix on
hover. Both variants render the same `data-slot="list-header-cell"`
geometry, so mixing them in one header is seamless.

<ComponentPreview name="List-Columns" />

## Virtual rows

`ListRows` iterates items through its scoped slot; with `virtual`, only rows
near the viewport mount. The scroll container is the nearest scrollable
ancestor — the list windows against an app-owned scroll area (a settings
body, the page) and keeps its scrollbar. `itemHeight` defaults to the List's
`rowHeight`. The underlying composable, `useVirtualRows`, is exported for
exotic cases.

<ComponentPreview name="List-Virtual" csr="true" />

## Styling hooks

`--list-columns` and `--list-gap` (default `0.5rem`) are public hooks on the
List — override them with plain classes, responsively if needed. People-style
lists collapse to a feed on mobile with no dedicated API:

```vue
<List
  :columns="['minmax(8rem,1fr)', '5.5rem', '5.5rem']"
  class="max-sm:[--list-columns:auto_minmax(0,1fr)_auto]"
>
```

with `max-sm:hidden` on the numeric cells and the `ListHeader`.

For `--list-gap` and `--list-row-padding-x` (the content inset shared by
interactive rows — default `0.75rem` — and the column header, so setting it
on the `List` aligns both), the frappe-ui Tailwind preset ships spacing-scale
utilities — `list-gap-*` and `list-row-px-*` — so the usual authoring form
is `max-sm:list-gap-3 sm:list-gap-4` rather than raw
`[--list-gap:0.75rem]` properties. Both forms hit the same CSS vars.

Cells (and header cells) are flex containers with `items-center` — align
content with justify utilities (`class="justify-end"` for numeric columns),
responsively if needed. There is no `align` prop.

Slots for CSS targeting: `data-slot="list | list-header | list-header-cell |
list-row | list-cell | list-row-checkbox | list-divider"`. State:
`data-state="selected"` (checkbox selection), `data-active` (+ `aria-current`,
the `v-model:active` row) and `data-interactive` on rows, `data-sort` on the
active header cell.

Accessibility follows header presence: `role="list"` / `"listitem"` without
a `ListHeader`, `table` / `row` / `columnheader` / `cell` (plus `aria-sort`)
with one.

<!-- @include: ./list.api.md -->
