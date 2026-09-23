# MultiSelect

A searchable list that picks several options, with Clear All and Select All
buttons in its footer. To pick one option, use [Combobox](./combobox) when the
list needs search and [Select](./select) when it does not.

<ComponentPlayground name="MultiSelect" />

## Examples

### Assign reviewers

`#prefix` shows a stack of up to three avatars and a "+N" count for the rest.
`#summary` lists the selected names.

<ComponentPreview name="MultiSelect-Members" />

### Search people on the server

Bind `v-model:query`, fetch as the query changes, and pass the results to
`options`. See [Server search](#server-search) for the four things to handle.

<ComponentPreview name="MultiSelect-AsyncOptions" />

### Permissions

With a short, fixed list, `#summary` can list every selected label in place of
the default "2 selected".

<ComponentPreview name="MultiSelect-Summary" />

### Issue labels

`#trigger` shows each selected option as a `Badge` with a remove button.

<ComponentPreview name="MultiSelect-TagsTrigger" />

### Assign button in a toolbar

`#trigger` replaces the default trigger with a `Button` that shows a count.

<ComponentPreview name="MultiSelect-TriggerSlot" />

### Bulk actions footer

`#footer` replaces the default Clear All and Select All footer. It receives
`selectAll` along with the other control props.

<ComponentPreview name="MultiSelect-Footer" />

## Behavior

### Options

`options` takes `{ label, value }` objects or groups of `{ group, options }`.
A group label shows above its options. An option is selected when its `value`
is in the model.

### Selected options

`@update:modelValue` gives the selected values. `@update:selectedOptions`
fires with it and gives the matching option objects from `options`, custom
fields included. Use it instead of looking the objects up yourself.

```vue
<MultiSelect
  v-model="value"
  :options="members"
  @update:selectedOptions="(options) => (emails = options.map((o) => o.email))"
/>
```

When nothing is selected, the value is `[]`.

### Trigger summary

After more than one selection, the trigger reads "N selected". `#summary`
renders that text yourself. It receives the default text as `summary`, so you
can fall back to it, for example when nothing is selected.

### Prefix

When you pass `#prefix`, it fills the whole prefix area for any number of
selected options, including none.

### Server search

To load options from a server:

1. Pass `:filterable="false"`, so the list does not filter again what the
   server already matched.
2. Drop old responses, for example with a request id, so a slow earlier
   request cannot overwrite newer results.
3. Keep the selected options in `options`, so they can still be shown after
   the results change.
4. Clear the query yourself when the popover opens. See
   [Search query](#search-query).

While `loading` is set, a spinner shows in the search row. The options you
passed stay visible and can still be picked, so people can keep choosing from
the last results. With `hide-search` there is no search row, so a loading row
replaces the results. In both cases the "No results" text is hidden while
loading.

### Search query

`v-model:query` is optional. Listening for `@update:query` counts as binding
it: there is no way to only watch the query. Once you bind it, the component
stops clearing the search box, so the last text stays in it. If you listen,
also bind `v-model:query` and clear it on `@update:open`.

To read the query without taking control of it, use `#search-prefix`,
`#search-suffix` or `#footer`. Each receives the query.

### Search row

`#search-prefix` and `#search-suffix` add content around the search input.
Both receive `{ query, setQuery, disabled, focus }`. `setQuery('')` clears the
query, and `focus()` moves focus back to the search input. The slots are
inside the search row, so `hide-search` removes them too.

### Item slots

`#item-prefix`, `#item-label` and `#item-suffix` change parts of the standard
row. `#item` replaces the whole row, including its outer element.

### Trigger slots

`#trigger` replaces the default button. It receives `open`, `disabled`,
`query`, `selectedOptions`, `clear`, `setOpen` and `close`. `#footer` receives
the same props and `selectAll`. `close()` is the same as `setOpen(false)`.

### Labels

`MultiSelect` takes `label`, `description`, `error` and `required` directly, so
it needs no `FormControl` around it. While `error` is set, it shows in place of
the description.

## Accessibility

While `error` is set, the trigger gets `aria-invalid` and an
`aria-errormessage` that points to the error text.

## Migrating from v0

`compareFn` is removed: an option is selected when its `value` is in the
model. The `displayValue` slot prop is now `summary` on `#summary`, and
`toggleOpen` is `setOpen(boolean)`. See the
[migration guide](/docs/migration#multiselect) for the full list.

<!-- @include: ./MultiSelect.api.md -->
