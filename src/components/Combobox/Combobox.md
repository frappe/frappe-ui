# Combobox

Lets users pick one option from a searchable list. To accept text that is not in the list, add a `type: 'custom'` row that sets the value — see [Create New](#create-new).

## Playground

<ComponentPlayground name="Combobox" />

## Simple
A plain repo picker — just pass `options` as an array of strings.

<ComponentPreview name="Combobox-Simple" layout="stacked" />

## Emoji Picker
Button-triggered combobox via `trigger="button"`. The search input moves into the popover header. The button's label and prefix auto-derive from the selected option — `#item-prefix` doubles as the selected-state prefix, and `#prefix` is the placeholder icon shown before anything is picked.

<ComponentPreview name="Combobox-EmojiPicker" layout="stacked" />

## Search Row
In `trigger="button"` mode the search input moves into the popover header. That row carries `data-slot="search"` and exposes `#search-prefix` and `#search-suffix`, both receiving `{ query, setQuery, disabled, focus }`.

<ComponentPreview name="Combobox-SearchSlots" layout="stacked" />

`hideSearch` removes the row entirely for short static lists. The `#search-*` slots live inside the row, so they disappear with it. In the default `trigger="input"` mode there is no in-popover row at all and `hideSearch` has no effect — the trigger *is* the search input.

## Server Search
Fetch options from a server as the user types. Bind `v-model:query`, debounce the request, and feed the results back into `:options`. The `:loading` prop swaps the result body for a loading state. Four things to watch for: pass `:filterable="false"` so the client doesn't substring-filter what the server already matched, drop stale responses with a request id so a slower earlier query can't overwrite the latest results, merge the selected item into the options array so the trigger stays resolvable after the query narrows the list, and clear the query yourself when the popover opens — see the note below on who owns it.

<ComponentPreview name="Combobox-ServerSearch" layout="stacked" />

A `type: 'custom'` row's `condition` callback is consumer-declared visibility rather than client filtering, so it keeps running with `filterable: false`.

## Grouped Options
Options split into named groups. `#item-prefix` renders a colored swatch per row.

<ComponentPreview name="Combobox-Grouped" />

## Clearable
Uses the `#trigger` slot to compose a custom trigger with an inline clear button. The X clears `v-model` via `@click.stop` so the popover doesn't toggle, and `@pointerdown.stop` keeps the anchor from intercepting the press.

<ComponentPreview name="Combobox-Clearable" />

## Create New
"Create new" is just a `type: 'custom'` option — there is no prop for it, because what "create" means varies. `condition` hides the row when the query is empty or already matches an existing item, and `onClick` receives the typed `query` so you can persist the new value and set the model. Enter picks the row when it is the highlighted one, so typing and hitting Enter commits.

A value that matches no option is kept as-is: the trigger falls back to showing the raw string. That makes this the way to build a free-form "text input with autocomplete" too — the row commits the query, and the value survives.

<ComponentPreview name="Combobox-CreateNew" />

## Status Picker
Dotted indicator aligned to the first line, with supporting description text.

<ComponentPreview name="Combobox-StatusPicker" />

## Member Picker
Avatar rows with a contextual invite action authored through a template slot.

<ComponentPreview name="Combobox-MemberPicker" />

## Footer
The `#footer` slot renders below the list and stays pinned to the bottom of the popover — it does not scroll with the options. Scroll the list to confirm the footer remains fixed.

<ComponentPreview name="Combobox-Footer" layout="stacked" />

## In Dialog
Combobox inside a Dialog. Focus returns to the trigger when the popover closes, even inside the Dialog's focus scope, so no extra wiring is needed.

<ComponentPreview name="Combobox-InDialog" layout="stacked" />

## Label, Description, Error
`Combobox` supports `label`, `description`, `error`, and `required` directly — no `FormControl` wrapper needed. The error suppresses the description and wires `aria-invalid` + `aria-errormessage` onto the input.

<ComponentPreview name="Combobox-Labeling" />

## Template Ref
A template ref exposes `{ clear, focus }` — the same shape as `Select` and `MultiSelect`. `focus()` moves focus to the input in `trigger="input"` mode, and to the button in `trigger="button"` mode.

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'

const picker = useTemplateRef('picker')

function reset() {
  picker.value?.clear()
  picker.value?.focus()
}
</script>

<template>
  <Combobox ref="picker" v-model="value" :options="options" />
</template>
```

`clear()` empties the selection and nothing else. In `trigger="button"` mode whatever you typed in the search box stays. In `trigger="input"` mode the input goes blank anyway, because there the query follows the model.

## Notes

- `v-model:query` is optional, but **listening for `@update:query` already
  makes the query yours.** There is no observe-only mode: an `@update:query`
  handler counts as binding it, so the combobox stops resetting the search box
  and the committed label stays in it — the next keystroke appends. If you
  listen, bind `v-model:query` too and clear it on `@update:open`. To read the
  query without owning it, use `#search-prefix`, `#search-suffix`, or
  `#footer`, which all hand it out.
- In `trigger="input"` mode the input is the value display, so an unbound query
  keeps following the committed option's label — that is model sync, not a
  reset.
- Use `#item-prefix`, `#item-label`, and `#item-suffix` to customize the
  standard option row; reach for `#item` only when you need to replace the row
  shell too.
- For a single choice with no search, use [`Select`](./select); for several
  values, use [`MultiSelect`](./multiselect).

<!-- @include: ./Combobox.api.md -->
