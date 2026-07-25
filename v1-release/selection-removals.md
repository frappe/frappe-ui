# Members removed from `Select`, `Combobox`, and `MultiSelect`

Upgrade notes for apps moving off the v0 selection API. Under
[ADR-0008](../spec/adr/0008-no-deprecated-members-in-1-0-0.md) each member below
is deleted rather than carried through `1.x` as an alias, so a call site that
still uses one breaks at the tag rather than warning.

All three components are upgraded together — they share an option shape and a
slot vocabulary, and most apps use more than one. The current contract is
[`spec/selection.md`](../spec/selection.md); the generated prop, emit, and slot
lists live in each component's `*.api.md`.

Consumer-facing before/after examples belong in the published migration guide
([`docs/content/docs/migration.md`](../docs/content/docs/migration.md)). This
doc is the complete list behind it.

## The list

Verified against `src/components/{Select,Combobox,MultiSelect}` on 2026-07-26.
Nothing below still exists in the source.

### Select

| Removed | Replaced by |
| --- | --- |
| `#option` slot | `#item-label`, plus `#item-prefix` for the icon half |
| `displayValue` trigger slot prop | `selectedOption.label` |
| `option` item slot prop | `item` |

### Combobox

| Removed | Replaced by |
| --- | --- |
| `slotName` on custom options | `slot`, dispatched to `#item-<slot>` |
| `searchTerm` in the custom-option context | `query` |
| `input` emit | `update:query` |
| `render` on options | `slots` — function form → `slots.item`, object form → `slots` one-to-one |
| `placement` prop, and the `ComboboxPlacement` type | `align` |
| imperative `reset()` | `clear()` |

### MultiSelect

| Removed | Replaced by |
| --- | --- |
| `#option` slot | `#item-label`, plus `#item-prefix` for the icon half |
| `compareFn` prop | nothing — selection is `option.value` against `modelValue` |
| `displayValue` slot prop | `#summary`'s `summary`, or `selectedOptions` |
| `clearAll` slot prop | `clear` |
| `toggleOpen` slot prop | `setOpen(boolean)` |

## Row customization is the big one

Two of the three components lost `#option`, and `Combobox` lost `render`. They
were the same idea — hand the whole row to the consumer — and they are all
replaced by the region slots on a component-owned row shell.

Old, one slot for the entire label area:

```vue
<Select v-model="chartType" :options="options">
  <template #option="{ option }">
    <div class="flex items-center gap-2">
      <component :is="option.icon" class="size-4" />
      <span>{{ option.label }}</span>
    </div>
  </template>
</Select>
```

New, one slot per region:

```vue
<Select v-model="chartType" :options="options">
  <template #item-prefix="{ item }">
    <component :is="item.icon" class="size-4" />
  </template>

  <template #item-label="{ item }">
    {{ item.label }}
  </template>
</Select>
```

An icon is auto-rendered from `option.icon` now, so the common case needs no
slot at all — set `icon` and drop both templates.

`Combobox`'s `render` moves the same way. Function-form `render` becomes
`slots.item` on the option; object-form `render` maps to `slots` key for key.
Both stay available for lists built in JavaScript, where no template is in
reach:

```ts
const users = fetchedUsers.map((user) => ({
  label: user.name,
  value: user.id,
  slots: {
    prefix: ({ item }) => h(Avatar, { image: item.image, class: 'size-4' }),
  },
}))
```

Full-row takeover is still there as `slots.item`, and `#item` is its template
equivalent.

## Custom options on Combobox

Two renames land on the same option object:

```ts
// Old
{
  type: 'custom',
  key: 'create-new',
  label: 'Create new',
  slotName: 'create-new',
  onClick: ({ searchTerm }) => createItem(searchTerm),
  condition: ({ searchTerm }) => Boolean(searchTerm),
}

// New
{
  type: 'custom',
  key: 'create-new',
  label: 'Create new',
  slot: 'create-new',
  onClick: ({ query }) => createItem(query),
  condition: ({ query }) => Boolean(query),
}
```

The slot the row lands in is renamed with it. `#create-new` becomes
`#item-create-new`, and it receives `{ item, query, selected }` rather than
`{ option, searchTerm }`.

`onClick` and `condition` keep their names.

## Before deletion

Per ADR-0008, each row above needs:

- a changelog entry in [`changelog.md`](./changelog.md)
- a before/after example in the migration guide where the shape changed
  meaningfully — the row slots and the custom-option renames both qualify
- no remaining internal call sites in `src/`
