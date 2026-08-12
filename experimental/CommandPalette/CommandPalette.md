# CommandPalette

A searchable list of commands in a dialog, opened with `Mod+K`. Compose
`CommandPaletteInput`, `CommandPaletteGroup`, `CommandPaletteItem`,
`CommandPaletteEmpty` and `CommandPaletteFooter` inside the `CommandPalette`
root. The app writes the rows; the palette owns the dialog, the query, the
keyboard and the filter.

> **Experimental** — the family ships from
> [`frappe-ui/experimental`](/docs/experimental) while its API settles, so it is
> exempt from the usual deprecation policy and can change shape or disappear in
> any release. The root `CommandPalette` was removed in `1.0.0`; see the
> [migration guide](/docs/migration#commandpalette).

```ts
import {
  CommandPalette,
  CommandPaletteInput,
  CommandPaletteGroup,
  CommandPaletteItem,
  CommandPaletteEmpty,
  CommandPaletteFooter,
} from 'frappe-ui/experimental'
```

<ComponentPreview name="CommandPalette-Default" />

## Opening it

The palette registers no shortcut. Write the one line yourself, so the app
decides when `Mod+K` belongs to the palette and when it belongs to a focused
editor:

```js
useKeyboardShortcut({
  combo: 'Mod+K',
  description: 'Open command palette',
  handler: () => (open.value = true),
})
```

## Filtering

`filterable` is on by default. Each item matches when the query is a substring
of its text, the same rule [`Combobox`](/docs/components/combobox) applies to
its options.

An item filters on the text it renders in its default slot. `#prefix` and
`#suffix` are left out, so a trailing shortcut hint or badge never becomes
searchable. Add `keywords` for aliases the row does not show, and set `label`
when the default slot draws more than the label.

```vue
<CommandPaletteItem :value="page" :keywords="['mail', 'unread']">
  Inbox
  <template #suffix><KeyboardShortcut combo="Mod+I" /></template>
</CommandPaletteItem>
```

A group hides itself, heading and all, once the filter empties it.

## Server-side search

Set `:filterable="false"` and refetch on `update:query`. The backend has already
decided what matches, so a second pass on the client would drop its fuzzy and
relevance-ranked rows.

<ComponentPreview name="CommandPalette-ServerSearch" />

## Items that are links

Give an item `as="a"` and an `href` and it renders a real anchor, so
middle-click and modifier-click open a new tab natively. `select` carries the
click that picked the row in `event.detail.originalEvent`, which is where the
modifier keys are.

<ComponentPreview name="CommandPalette-Links" />

## Keeping it open

The palette closes after a pick. Call `event.preventDefault()` in the `select`
handler to keep it open, for a row that switches the palette into a mode instead
of running a command.

```js
function select(value, event) {
  if (value.kind === 'mode') {
    event.preventDefault()
    mode.value = value.name
  }
}
```

## Styling hooks

Every part stamps `data-slot`. An item adds `data-state="active"` while the
keyboard or the pointer is on it, `data-state="selected"` while it holds the
palette's value, and `data-disabled` when it cannot be picked. Items also hand
`active`, `selected` and `disabled` to every one of their slots.

<!-- @include: ./CommandPalette.api.md -->
