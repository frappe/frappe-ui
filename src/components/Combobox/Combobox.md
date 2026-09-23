# Combobox

A searchable list that picks one option. For a short list with no search, use
[Select](./select). To pick several values, use [MultiSelect](./multiselect).

<ComponentPlayground name="Combobox" />

## Examples

### Assign a member

`#item-prefix` and `#item-label` show an avatar and an email on each row, and
`#prefix` shows the selected member's avatar. A `type: 'custom'` row at the end
always offers an invite action.

<ComponentPreview name="Combobox-MemberPicker" />

### Status picker

`#item-label` puts a colored dot beside a two-line label, lined up with the
first line.

<ComponentPreview name="Combobox-StatusPicker" />

### Reaction picker

`trigger="button"` renders a button, and the search input moves into the top
of the popover. The button shows the selected option's label and icon. The
`#prefix` slot shows an icon while nothing is picked.

<ComponentPreview name="Combobox-EmojiPicker" layout="stacked" />

### Search people on the server

Bind `v-model:query`, fetch as the query changes, and pass the results to
`options`. See [Server search](#server-search) for the four things to handle.

<ComponentPreview name="Combobox-ServerSearch" layout="stacked" />

### Create a tag

A `type: 'custom'` row creates a tag from the typed text and selects it.

<ComponentPreview name="Combobox-CreateNew" />

### Country picker with a footer

The `#footer` slot sits below the options and stays in place while the list
scrolls. Here it shows the query and a Clear button.

<ComponentPreview name="Combobox-Footer" layout="stacked" />

### In a dialog

Comboboxes in a `Dialog` need no extra setup. When the popover closes, focus
goes back to the trigger, inside the dialog.

<ComponentPreview name="Combobox-InDialog" layout="stacked" />

## Behavior

### Options

`options` takes strings, `{ label, value }` objects, or groups of
`{ group, options }`. A group label shows above its options.

### Custom rows

A `type: 'custom'` option is a row that runs an action instead of setting a
value. Its `condition` callback decides when the row shows, and `onClick`
receives the typed `query`. `slot: 'create'` renders the row with the
`#item-create` slot.

There is no "create new" prop, because what "create" means changes from app to
app. Make a custom row: use `condition` to hide it when the query is empty or
already matches an option, and use `onClick` to save the new value and set the
model. `Enter` picks the row when it is highlighted, so typing a new name and
pressing `Enter` creates it.

### Free text

A value that matches no option is kept. The trigger shows the raw string. A
custom row that commits the query therefore turns `Combobox` into a text input
with suggestions.

### Server search

To load options from a server:

1. Pass `:filterable="false"`, so the list does not filter again what the
   server already matched.
2. Drop old responses, for example with a request id, so a slow earlier
   request cannot overwrite newer results.
3. Keep the selected option in `options`, so the trigger can still show its
   label after the results change.
4. Clear the query yourself when the popover opens. See
   [Search query](#search-query).

`loading` shows a loading state in place of the results. A custom row's
`condition` still runs when `filterable` is `false`, because it decides
visibility, not filtering.

### Search query

`v-model:query` is optional. Listening for `@update:query` counts as binding
it: there is no way to only watch the query. Once you bind it, the combobox
stops clearing the search box, so the selected label stays in it and the next
key press adds to it. If you listen, also bind `v-model:query` and clear it on
`@update:open`.

To read the query without taking control of it, use `#search-prefix`,
`#search-suffix` or `#footer`. Each receives the query.

In `trigger="input"` mode the input also shows the selected value. When the
query is not bound, it follows the selected option's label.

### Search row

In `trigger="button"` mode the search input sits at the top of the popover.
`#search-prefix` and `#search-suffix` add content to that row. Both receive
`{ query, setQuery, disabled, focus }`.

`hideSearch` removes the row, which suits short fixed lists. The `#search-*`
slots go with it. In `trigger="input"` mode there is no row in the popover,
because the trigger is the search input, so `hideSearch` does nothing.

### Item slots

`#item-prefix`, `#item-label` and `#item-suffix` change parts of the standard
row. `#item` replaces the whole row, including its outer element.

In `trigger="button"` mode, `#item-prefix` also renders the selected option's
prefix on the button. `#prefix` shows before anything is picked.

### Trigger slots

`#trigger`, `#prefix`, `#suffix` and `#footer` receive `open`, `disabled`,
`setOpen` and `close`, together with the selection fields. `close()` is the
same as `setOpen(false)`. `#suffix` replaces the chevron.

### Clear button

To add a clear button, put it in `#suffix` or `#trigger`. Use `@click.stop`
so the click does not toggle the popover, and `@pointerdown.stop` so the
trigger does not take the press.

### Labels

`Combobox` takes `label`, `description`, `error` and `required` directly, so it
needs no `FormControl` around it. While `error` is set, it shows in place of
the description.

## Accessibility

While `error` is set, the input gets `aria-invalid` and an `aria-errormessage`
that points to the error text.

## Migrating from v0

`allowCustomValue` is now a `type: 'custom'` option with a `condition`. The
`input` emit is `@update:query`, `placement` is `side` and `align`, and
`reset()` on a template ref is `clear()`. See the
[migration guide](/docs/migration#combobox) for the full list.

<!-- @include: ./Combobox.api.md -->
