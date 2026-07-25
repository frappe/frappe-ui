# Selection components

The contract for the three components that pick a value: `Select`,
`Combobox`, and `MultiSelect`. They share an option shape, a slot
vocabulary, a set of styling hooks, and their popover behavior. Where a rule
below is not marked as component-specific, it holds for all three.

Each component also has its own spec with the full prop and slot list:
[`select.md`](./select.md), [`combobox.md`](./combobox.md),
[`multiselect.md`](./multiselect.md).

## Choosing one

| Use | When |
| --- | --- |
| `Select` | A short, fixed list. No search box. One value. |
| `Combobox` | The list is long or comes from a server. One value. |
| `MultiSelect` | Same as `Combobox`, but several values. |

Two related components sit outside this contract:

- [`Dropdown`](./dropdown.md) is an action menu. Reach for it when the rows
  run code rather than set a value, even if one row is marked as current.
- [`ItemListRow`](./item-list-row.md) is the row shell all three pickers
  render inside. You only touch it directly when building your own list.

## Options

An option is a label, a value, and optional extras:

```ts
{
  label: string
  value: string | number
  disabled?: boolean
  icon?: string | Component
  description?: string
  slot?: string
  slots?: { prefix?, label?, suffix?, item? }
}
```

Any extra fields you add are passed through untouched to slot props, so an
option can carry the whole record it came from.

Values are `string | number`. An empty string is a real value, not "nothing" —
use it for a "None" or "Any" row and it round-trips correctly. Nothing selected
is `undefined` on `Select`, `null` on `Combobox`, and `[]` on `MultiSelect`.

`icon` takes a Vue component, or a string. Strings starting with `lucide-`
render as that Lucide icon (`icon: 'lucide-trash-2'`), sized and colored by the
component. Write the class out in full — a name built at runtime
(`` `lucide-${x}` ``) is invisible to Tailwind's scanner and renders nothing.

`Combobox` and `MultiSelect` accept groups. A group is `{ group, options }`,
with an optional `key` and `hideLabel`. `Select` takes a flat list only.

`Combobox` also accepts an action row: `{ type: 'custom', key, label, onClick }`,
with an optional `condition` deciding when it shows and `keepOpen` to leave the
popover open after a click. Both callbacks receive `{ query }`.

## Binding state

- `v-model` — the selected value.
- `v-model:open` — whether the popover is showing.
- `v-model:query` — the search text (`Combobox` and `MultiSelect`).

All three are optional. Unbound, the component holds the state itself.

A bound query belongs to you. The component never clears it — not on open, not
on close, not on mount — so a query you seed filters the list on first render
and survives the popover closing. Left unbound, the query clears every time the
popover opens. On `Combobox` in its default input mode the query doubles as the
value display, so it follows the committed option's label either way.

Every trigger and footer slot hands you `setOpen(boolean)` to open or close the
popover and `clear()` to empty the selection. They exist because slot content
has no reference to the state the parent owns. They complement `v-model:open`
rather than replace it: one drives the component from outside, the other from
inside.

A template ref on any of the three gives you `{ clear, focus }`:

```vue
<script setup>
const picker = useTemplateRef('picker')
</script>

<template>
  <Combobox ref="picker" />
</template>
```

## Customizing the trigger

`#trigger` replaces the whole trigger. `#prefix` and `#suffix` fill the space
before and after the value while keeping the standard trigger. `#suffix`
replaces the default chevron, so render your own when your content is
conditional, and stop the `click` and `pointerdown` events on anything
interactive you put there.

`MultiSelect` adds `#summary`, which overrides just the trigger's text. It
receives the default text (`"3 selected"`, a single label, or the placeholder)
as `summary`, so you can fall back to it.

All of these receive the same shape: `open`, `disabled`, the selected option or
options, `clear`, and `setOpen`. `Combobox` and `MultiSelect` add `query`, and
`Combobox` adds `displayValue`.

## Customizing rows

The component owns the row: spacing, height, hover, selected and disabled
styling, and the three regions inside it. You fill the regions.

- `#item-prefix`, `#item-label`, `#item-suffix` — one region across every row.
- `#item` — replaces the entire row, shell included.
- An option's `slot: 'member'` sends that one row's label region to a
  `#item-member` slot.
- An option's `slots` object supplies the same four regions as functions,
  for lists built in JavaScript where no template is in reach. Keys are
  `prefix`, `label`, `suffix`, `item`. `Combobox` and `MultiSelect` only.

```ts
const options = users.map((user) => ({
  label: user.full_name,
  value: user.name,
  slots: {
    prefix: ({ item }) => h(Avatar, { image: item.image, class: 'size-4' }),
  },
}))
```

Precedence, per region, first match wins:

1. an option's `slot`, matching an `#item-<name>` template slot
2. the matching template slot (`#item`, `#item-prefix`, …)
3. the matching `slots` function on the option
4. the default rendering

So a template always beats a `slots` function, and a per-option `slot` beats
both. Whole-row and per-region are mutually exclusive: once something replaces
the row, the regions are not rendered.

Group labels use `#group-label`, which receives `{ group }`. `#footer` pins
content below the scrollable list and receives the same shape as `#trigger`,
plus `selectAll` on `MultiSelect`.

## Search and filtering

`Combobox` searches from its trigger by default. Set `trigger="button"` and the
search box moves into the popover, where `hideSearch` can remove it and
`#search-prefix` / `#search-suffix` can decorate it. `MultiSelect` always
searches from inside the popover and supports the same three.

Search slots receive `{ query, setQuery, disabled, focus }`. They live inside
the search row, so `hideSearch` removes them along with it.

Filtering is client-side: the component substring-matches the options you
passed. When the options come back from a server search, set
`filterable="false"`. The server already decided what matched; filtering again
on the client drops fuzzy, ranked, and id-based results without telling anyone.
This switches off query filtering only. A custom row's `condition` is your own
visibility rule, not filtering, so it keeps running either way.

## Disabled, loading, and empty

A disabled option is skipped by keyboard navigation, cannot be clicked, emits
nothing, gets the muted disabled styling and a `data-disabled` attribute. It
also does not count for `MultiSelect`'s Select All. An option that becomes
disabled while selected stays selected — it only stops being interactive.

`loading` on `Combobox` and `MultiSelect` swaps the results for a loading
state. `Select` has no `loading`; its list is static.

`emptyText` sets the copy shown when there is nothing to display, and `#empty`
replaces it entirely — it receives `{ query }` on the two searchable
components. `Select` defaults to `"No options"`, the other two to
`"No results"`.

## Positioning

Four props place the popover:

| Prop | Default | Meaning |
| --- | --- | --- |
| `side` | `'bottom'` | Which side of the trigger it opens on. |
| `align` | `'start'` | How it lines up along that side. |
| `offset` | `4` | Gap in px between trigger and popover. |
| `portalTo` | `'body'` | Where the popover is teleported. |

`start` and `end` are direction-aware and flip under `dir="rtl"`.

`Select` is the exception. Its menu is item-aligned by default — anchored over
the trigger so the selected row lands on the value, macOS-style. Setting `side`,
`align`, or `offset` switches it to ordinary placement below the trigger, and
whichever of the three you left out falls back to the defaults above.
`portalTo` applies in both modes.

## Motion

The popover scales in from the trigger, not from the middle of the screen.
Pointer opens play it; keyboard opens skip it, because a picker opened from the
keyboard is on the critical path between one keystroke and the next. The
component works out which happened and publishes the answer as
`data-motion="animated"` or `"instant"` on the content element, and the CSS
reads that. `prefers-reduced-motion: reduce` turns the animation off.

## Styling hooks

Every part of a picker carries a `data-slot`, so you can style it from outside
without replacing anything:

| Value | Element |
| --- | --- |
| `trigger` | the trigger |
| `chevron` | the default trailing chevron |
| `content` | the positioned popover |
| `content-body` | the scrollable body inside it (`MultiSelect`) |
| `search` | the in-popover search row |
| `input` | a search or trigger input |
| `group` | a group of options |
| `group-label` | a group's heading |
| `item` | one option row |
| `item-list-row` | the row shell inside an option row |
| `item-prefix` | the row's leading region |
| `item-label` | the row's label region |
| `item-suffix` | the row's trailing region |
| `loading` | the loading indicator |
| `empty` | the empty state |
| `footer` | the pinned footer below the list |

State comes through separate attributes: `data-state` (`open`/`closed` on the
popover, `checked`/`unchecked` on rows), `data-disabled` on rows, `data-motion`
on the popover, and `data-size` / `data-variant` where the component has those
props. `MultiSelect` also marks its popover with `data-selection` and
`data-loading`.

These names are as public as prop names. After `1.0.0` one cannot be renamed or
dropped without a major version. Adding one is free and can happen any time.
(`Select` also marks an invisible value overlay it needs for item-aligned
measurement; that one is plumbing and not part of this contract.)

## What differs between the three

|  | `Select` | `Combobox` | `MultiSelect` |
| --- | --- | --- | --- |
| Value | one | one | many |
| Grouped options | no | yes | yes |
| Search | no | yes | yes |
| `v-model:query` | — | yes | yes |
| `loading` | no | yes | yes |
| `filterable` | — | yes | yes |
| `hideSearch` | — | button mode only | yes |
| `#summary` | no | no | yes |
| Selected-option emit | — | `update:selectedOption` | `update:selectedOptions` |
| Extra props | — | `trigger`, `openOnFocus`, `openOnClick`, `allowCustomValue` | — |
| Extra slot props | — | `displayValue` | `selectAll` in `#footer` |

Grouping `Select` later would be additive and would use the same
`{ group, options }` shape.

All three share `size` (`sm`/`md`/`lg`/`xl`), `variant`
(`subtle`/`outline`/`ghost`), `placeholder`, `disabled`, `emptyText`, the
labeling props, and the four positioning props.

## What this family does not do

- One component that does all three jobs. The boundaries are the point.
- A public set of low-level parts to assemble a picker from. `ItemListRow` is
  the one shared piece, and it is a row, not a kit.
- A custom filter function. `filterable` is on or off; the server filters when
  the client should not. A function can be added later without breaking anyone.
- Rich chip inputs, token editors, or people pickers with per-row actions.
  Build those on top of `MultiSelect` rather than inside it.
- A trigger shared with `Dropdown`. A menu button and a form control mean
  different things to a screen reader, and they stay apart.
