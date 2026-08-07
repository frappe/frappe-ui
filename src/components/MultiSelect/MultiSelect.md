# MultiSelect

Searchable multi-choice picker. Matches the `Combobox` / `Select` item-slot model and provides built-in Clear All / Select All footer controls.

## Playground

<ComponentPlayground name="MultiSelect" />

## Default
A plain picker — button trigger opens a popover with a search input, option list, and default footer.

<ComponentPreview name="MultiSelect-Example" />

## Item Prefix
Use `#item-prefix` to render avatars, icons, or indicators next to each option label.

<ComponentPreview name="MultiSelect-Options" />

## Members
Use `#prefix` to render an aggregate visual across the current selection — here, a stack of avatars capped at three with a "+N" overflow badge. When `#prefix` is provided it owns the entire prefix area regardless of selection count, so the same template handles 0 / 1 / many.

<ComponentPreview name="MultiSelect-Members" />

## Grouped Options
Options can be split into named groups. Group labels render above each group's items.

<ComponentPreview name="MultiSelect-Grouped" />

## Trigger Summary
The trigger reads `"N selected"` past one selection. Use `#summary` to render the label region yourself — joined labels, a count with a unit, or anything else. The slot receives the default text as `summary`, so it doubles as a fallback for the empty state.

<ComponentPreview name="MultiSelect-Summary" />

## Search Prefix and Suffix
Use `#search-prefix` and `#search-suffix` to add content around the popover's search input without changing the trigger slots. Both slots receive `{ query, setQuery, disabled, focus }` — `setQuery('')` clears the query and `focus()` moves focus back to the search input. They render inside the search row, so they disappear when `hide-search` is set.

<ComponentPreview name="MultiSelect-SearchSlots" />

## Server Search
Fetch options from a server as the user types. Bind `v-model:query`, debounce the request, and feed the results back into `:options`. The `:loading` prop swaps the result body for a loading state. Four things to watch for: pass `:filterable="false"` so the client doesn't substring-filter what the server already matched, drop stale responses with a request id so a slower earlier query can't overwrite the latest results, merge currently-selected items into the options array so chips stay resolvable after the query narrows the list, and clear the query yourself when the popover opens — see the note below on who owns it.

<ComponentPreview name="MultiSelect-AsyncOptions" />

## Reading the Selected Options
`@update:modelValue` gives the selected values. `@update:selectedOptions` fires alongside it with the original option objects out of `:options`, so custom fields on your options survive — use it instead of resolving values back to objects yourself.

```vue
<MultiSelect
  v-model="value"
  :options="members"
  @update:selectedOptions="(options) => (emails = options.map((o) => o.email))"
/>
```

## Custom Footer
Replace the default Clear All / Select All footer with a custom one. The slot receives the shared control props (`open`, `disabled`, `query`, `selectedOptions`, `clear`, `setOpen`) plus `selectAll`.

<ComponentPreview name="MultiSelect-Footer" />

## Custom Trigger
Use `#trigger` to fully replace the default button trigger. The slot receives `open`, `disabled`, `query`, `selectedOptions`, `clear`, and `setOpen`.

<ComponentPreview name="MultiSelect-TriggerSlot" />

## Tags Trigger
A chips-style trigger: each selected option renders as a removable `Badge`, with inline remove buttons. Authored through `#trigger` using `selectedOptions` and the parent's `v-model`.

<ComponentPreview name="MultiSelect-TagsTrigger" />

## Label, Description, Error
`MultiSelect` supports `label`, `description`, `error`, and `required` directly — no `FormControl` wrapper needed. The error suppresses the description and wires `aria-invalid` + `aria-errormessage` onto the trigger.

<ComponentPreview name="MultiSelect-Labeling" />

## Template Ref
A template ref exposes `{ clear, focus }` — the same shape as `Select` and `Combobox`. `clear()` empties the selection and leaves the search query alone; `focus()` moves focus to the trigger.

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

## Notes

- `v-model:query` is optional, but **listening for `@update:query` already
  makes the query yours.** There is no observe-only mode: an `@update:query`
  handler counts as binding it, so the component stops resetting the search box
  and the last committed text stays in it. If you listen, bind `v-model:query`
  too and clear it on `@update:open`. To read the query without owning it, use
  `#search-prefix`, `#search-suffix`, or `#footer`, which all hand it out.
- Use `#item-prefix`, `#item-label`, and `#item-suffix` to customize the
  standard option row; reach for `#item` only when you need to replace the row
  shell too.
- For a single choice, use [`Combobox`](./combobox) when the list needs search
  and [`Select`](./select) when it doesn't.

<!-- @include: ./MultiSelect.api.md -->
