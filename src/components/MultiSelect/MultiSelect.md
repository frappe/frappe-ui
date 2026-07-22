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
prop swaps the result body for a loading state. Two things to watch for: drop
stale responses with a request id so a slower earlier query can't overwrite the
latest results, and merge currently-selected items into the options array so
chips stay resolvable after the query narrows the list.

<ComponentPreview name="MultiSelect-AsyncOptions" />

## Custom Footer

Replace the default Clear All / Select All footer with a custom one. The slot
receives `clearAll`, `selectAll`, `selectedOptions`, and `query`.

<ComponentPreview name="MultiSelect-Footer" />

## Custom Trigger

Use `#trigger` to fully replace the default button trigger. The slot receives
`open`, `disabled`, `selectedOptions`, `displayValue`, `clearAll`, and
`setOpen`.

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

<!-- @include: ./MultiSelect.api.md -->
