# MultiSelect

Searchable multi-choice picker. Matches the `Combobox` / `Select` item-slot
model and provides built-in Clear All / Select All footer controls.

## Playground

<ComponentPlayground name="MultiSelect" />

## Default

A plain picker — button trigger opens a popover with a search input, option
list, and default footer.

<ComponentPreview name="MultiSelect-Example" />

## Item Prefix

Use `#item-prefix` to render avatars, icons, or indicators next to each option
label.

<ComponentPreview name="MultiSelect-Options" />

## Members

Use `#prefix` to render an aggregate visual across the current selection — here,
a stack of avatars capped at three with a "+N" overflow badge. When `#prefix` is
provided it owns the entire prefix area regardless of selection count, so the
same template handles 0 / 1 / many.

<ComponentPreview name="MultiSelect-Members" />

## Grouped Options

Options can be split into named groups. Group labels render above each group's
items.

<ComponentPreview name="MultiSelect-Grouped" />

## Async Options

Fetch options from a server as the user types. Listen to `@update:query`,
debounce the request, and feed the results back into `:options`. The `:loading`
prop swaps the result body for a loading state. Three things to watch for: pass
`:filterable="false"` so the client doesn't substring-filter what the server
already matched, drop stale responses with a request id so a slower earlier
query can't overwrite the latest results, and merge currently-selected items
into the options array so chips stay resolvable after the query narrows the
list.

<ComponentPreview name="MultiSelect-AsyncOptions" />

## Server-Side Filtering

`filterable` defaults to `true`, which substring-matches the given options
against the query on the client. Set `:filterable="false"` when the options
already come from a server search — the backend decided what matches, and a
second literal pass on the client silently drops fuzzy, ranked, and id-based
results. It turns off query filtering only; everything else about the component
is unchanged.

## Controlling the Query

The search query is internal by default. Bind `v-model:query` when the query
belongs to application state — for example to seed it, mirror it into a URL, or
clear it from outside the popover. It stays optional; `@update:query` alone is
enough to just observe typing.

```vue
<MultiSelect v-model="value" v-model:query="query" :options="options" />
```

Once bound, the query is yours: the component never resets it on its own — not
on open, not on close, not on mount. A seeded query survives opening the
popover and filters the list right away. Without the binding nothing outside
tracks the query, so it still clears each time the popover opens.

## Reading the Selected Options

`@update:modelValue` gives the selected values. `@update:selectedOptions` fires
alongside it with the original option objects out of `:options`, so custom
fields on your options survive — use it instead of resolving values back to
objects yourself.

```vue
<MultiSelect
  v-model="value"
  :options="members"
  @update:selectedOptions="(options) => (emails = options.map((o) => o.email))"
/>
```

## Search Prefix and Suffix

Use `#search-prefix` and `#search-suffix` to add content around the popover's
search input without changing the trigger slots. Both slots receive
`{ query, setQuery, disabled, focus }` — `setQuery('')` clears the query and
`focus()` moves focus back to the search input.

Both slots render inside the search row, so they are not rendered at all when
`hide-search` is set.

<ComponentPreview name="MultiSelect-SearchSlots" />

## Custom Footer

Replace the default Clear All / Select All footer with a custom one. The slot
receives the shared control props (`open`, `disabled`, `query`,
`selectedOptions`, `clear`, `setOpen`) plus `selectAll`.

<ComponentPreview name="MultiSelect-Footer" />

## Custom Trigger

Use `#trigger` to fully replace the default button trigger. The slot receives
`open`, `disabled`, `query`, `selectedOptions`, `clear`, and `setOpen`.

<ComponentPreview name="MultiSelect-TriggerSlot" />

## Tags Trigger

A chips-style trigger: each selected option renders as a removable `Badge`, with
inline remove buttons. Authored through `#trigger` using `selectedOptions` and
the parent's `v-model`.

<ComponentPreview name="MultiSelect-TagsTrigger" />

## Label, Description, Error

`MultiSelect` supports `label`, `description`, `error`, and `required` directly
— no `FormControl` wrapper needed. The error suppresses the description and
wires `aria-invalid` + `aria-errormessage` onto the trigger.

<ComponentPreview name="MultiSelect-Labeling" />

## Template Ref

A template ref exposes `{ clear, focus }`, the same shape as the rest of the
selection family. `clear()` clears the selection; `focus()` moves focus to the
trigger.

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
  <MultiSelect ref="picker" v-model="value" :options="options" />
</template>
```

<!-- @include: ./MultiSelect.api.md -->
