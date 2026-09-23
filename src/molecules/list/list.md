# List

A list or table built from parts, imported from `frappe-ui/list`. It is not
the config-driven `ListView` in `frappe-ui/experimental`, which is a separate
component.

<ComponentPreview name="List-Feed" />

## Anatomy

`List` holds the column template, the selection and the active row.
`ListHeader` is an optional header row. `ListRows` renders one row per item,
and each `ListRow` holds one `ListCell` per column. `ListGroup` puts a label
above a set of rows. The list draws the columns, dividers, hover surfaces,
checkboxes and sort buttons. You write everything inside the cells: text,
avatars, badges and unread emphasis.

```vue
<List v-model:selection="selection" :columns="['minmax(0,1fr)', '8rem']" selectable>
  <ListHeader>
    <ListHeaderCellSort :direction="direction" @click="toggleSort">
      Name
    </ListHeaderCellSort>
    <ListHeaderCell>Role</ListHeaderCell>
  </ListHeader>

  <ListGroup label="Admins">
    <ListRows :items="admins" v-slot="{ item, value }">
      <ListRow :value="value">
        <ListCell>{{ item.name }}</ListCell>
        <ListCell>{{ item.role }}</ListCell>
      </ListRow>
    </ListRows>
  </ListGroup>
</List>
```

## Examples

### Member table

Explicit `columns` and a `ListHeader` turn the list into a table.
`ListHeaderCellSort` makes a column sortable, and `v-model:active` highlights
the row that was clicked last.

<ComponentPreview name="List-Columns" />

### Documents with a star button

Each row opens its document on click and has a star button. A row cannot be a
link or button and also hold buttons, so the rows stay static and a stretched
button covers each one.

<ComponentPreview name="List-RowActions" />

### Table on a phone

`columns` keyed by breakpoint gives the table two columns on a phone and three
from `md` up. Resize the window to see it switch.

<ComponentPreview name="List-Responsive" />

### A thousand tasks

`virtual` on `ListRows` mounts only the rows near the visible part of the
scroll area.

<ComponentPreview name="List-Virtual" csr="true" />

## Behavior

### Feed and column layouts

Every list is a grid, and the header and every row read one column template.
Without `columns`, the list uses the feed template `auto`, `minmax(0,1fr)`,
`auto`: leading media, the content, and a right-aligned trailing cell.

Pass `columns` for a table. Use fixed track sizes. Each row is its own grid,
so an `auto` track sizes to that row's content alone, and the columns do not
line up across rows. Use `minmax(0, 1fr)` for the content column and fixed
widths or `fr` ratios for the rest.

Cells are flex containers with `items-center`. Align their content with
justify classes, such as `class="justify-end"` for a number column.

### What a row renders

A row with `route` renders a router link, a row with `href` a plain link that
opens in the same tab, and a row with a click listener a button. Any other
row is a plain `div`.

A link or button cannot hold other buttons, so a row is either clickable or
holds inline buttons, not both.

### Clickable rows with buttons

To have both, keep the row static and put two layers in it. The first is a
button with `absolute inset-0`, which stretches over the row because rows are
`position: relative`. It is the whole-row target. Every control after it that
handles its own clicks, such as action buttons and tooltip triggers, gets the
`relative` class, which lifts it above the stretched button.

The cells these controls sit in do not matter, but the order does: the
stretched button first, the other controls after it. The controls are its
siblings, not its children, so their clicks never reach it and you do not
need `stopPropagation`. Give the stretched button `type="button"` so it does
not submit a surrounding form, and the row's corner radius so its focus
outline follows the row's corners.

A static row has no hover surface or content inset of its own, so add hover
and active classes as the documents example does. Dividers hide around a
hovered row only when the row itself is clickable, so here the divider stays
at the top of the hover surface. Leave it, or pass `divider="none"`.

### Dividers

`divider` is `inset`, `full` or `none`. It defaults to `inset` in the feed
layout and `full` when `columns` is set. An `inset` divider starts at the
content column, the text edge. There is no divider above the first row, and
the dividers around a hovered clickable row hide so its rounded surface
stands apart.

### Selection

`selectable` shows a checkbox column and makes a row click toggle the row
instead of opening it. `v-model:selection` holds the selected row values.

With a `ListHeader`, a select-all checkbox appears in the header. It is
checked when every row is selected and mixed when only some are, and it
selects or clears all rows. It counts every item passed to `ListRows`, so it
covers rows that virtual scrolling has not mounted.

### Active row

A list with a detail pane, such as a mail inbox or a file browser, tracks one
open row. Bind `v-model:active` to a row `value`. The list highlights that row
and hides the dividers above and below it.

Clicking a row sets `active`, and the row's own `@click` and `route` still
run. Only one row is active at a time. It is separate from the checkbox
`selection`, and works in both layouts.

```vue
<List v-model:active="openId">
  <ListRows :items="threads" v-slot="{ value }">
    <ListRow :value="value">…</ListRow>
  </ListRows>
</List>
```

### Row values

Selection and the active row use each row's `value`. `ListRows` works out the
value once per item and passes it to its slot as `value`. It reads the item's
`name`, then `id`, then falls back to the index. Pass `row-key` to use another
field, or a function `(item, index) => key`.

The `ListRows` slot receives `{ item, index, value, selected, active }`.
`selected` and `active` are separate states.

### Sorting

`ListHeaderCell` is a plain label, with optional `#prefix` and `#suffix`
slots. A sortable column uses `ListHeaderCellSort` instead. It is controlled:
pass the current `direction` (`asc`, `desc` or `null`) and update your own
sort state in its `click` handler. Your code decides the toggle rules and
whether rows are sorted in the browser or through `useList`'s `orderBy`.

The `#sort-indicator` slot receives `{ direction }` and draws the direction
icon. The cell renders a real button with a tooltip ("Order by name"), and
shows an inactive column's indicator on hover. `align="end"` right-aligns the
cell for a number column and moves the indicator before the label, so the
label lines up with the values below. Plain and sortable cells can sit in the
same header.

### Responsive columns

Pass `columns` as an object keyed by breakpoint to change the template with
the viewport width:

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
breakpoint from your Tailwind `screens` and applies from that width up, until
the next key. A breakpoint you leave out keeps the template below it: above,
`sm` uses `base` and `xl` uses `lg`.

Each breakpoint replaces the whole template. Nothing is merged track by track,
so a breakpoint can change the number of tracks as well as their widths.

The switch happens in CSS, at your app's breakpoint values, so the list's
columns and your `md:hidden` classes change at the same width. The markup
rendered on the server is already correct: there is no viewport measurement
and no flash on first paint.

A key can be any kind of Tailwind screen. A `{ min, max }` screen gives a
template that ends where the screen ends, a `{ max }` screen one that applies
below a width, and a `{ raw }` screen one that applies wherever its media
query matches. Each template applies in the same places as that screen's own
classes. Where two screens match at once, the template that wins is the one
whose classes win.

A key that is not one of your screens is ignored. `{ base: […], medium: […] }`
uses `base` at every width, because `medium` names no breakpoint. The type
cannot reject the key, because apps can define their own screens. A
development build warns instead, names the key and lists the screens it could
have been:

```
[frappe-ui] List: `columns` key `medium` is not one of this app's Tailwind
screens (base, sm, md, lg, xl), so its template is ignored and the list keeps
the one below it.
```

Production builds leave the warning out. It needs frappe-ui's Tailwind preset,
which tells the list which screens your app defines. Without the preset every
key above `base` is ignored, and the warning says so.

Fewer tracks never hide a cell. Hide it yourself, with the same classes on the
header cell and the row cells:

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

### Nested lists

Each `List` has its own columns. A list inside another list uses its own
`columns` prop, or the feed template when it has none. It never takes the outer
list's template.

### Row height

`rowHeight` sets a fixed row height in pixels. Without it, rows size to their
content. It is one number at every width, because virtual scrolling depends on
it. For a list that is not virtual, set responsive heights with height classes
on the rows.

### Virtual rows

With `virtual`, `ListRows` mounts only the rows near the visible part of the
scroll area. The row height comes from the parent `List`'s `rowHeight`.
`overscan` sets how many extra rows mount on each side, and defaults to `6`.

The list scrolls inside the nearest scrollable parent, such as a settings
panel or the page, and keeps that parent's scrollbar.

### Groups

`ListGroup` puts a label row above its rows. Pass the text as `label`, or
replace it with the `#label` slot. `sticky` pins the label to the top of the
scroll area while its rows scroll under it.

## Accessibility

The roles follow the header. Without a `ListHeader`, the list has
`role="list"` and each row `listitem`. With one, it has `table`, `row`,
`columnheader` and `cell`, and a sorted column has `aria-sort`.

The active row has `aria-current`. The select-all checkbox is named "Select
all" and reports a mixed state when only some rows are selected. A
`ListGroup` has `role="rowgroup"` and is named by its label.

<!-- @include: ./list.api.md -->
