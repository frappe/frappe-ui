# Select

Lets users select one option from a list. Ideal for forms, settings, or any
interface where a single choice is required.

## Playground

<ComponentPlayground name="Select" />

## Example
<ComponentPreview name="Select-Example" />

## Custom Option Layout
Use `#item-prefix` and `#item-label` to tailor the standard row — for example, an avatar plus a two-line label with a secondary description. `#prefix` on the trigger reuses the selected option's accessory. Use `#item` when you want to replace the entire row, shell included.

<ComponentPreview name="Select-OptionSlot" />

## States
<ComponentPreview name="Select-States" />

## Trigger Slots
<ComponentPreview name="Select-TriggerSlots" />

## Footer
The `#footer` slot renders below the option list and stays pinned to the bottom of the popover — it does not scroll with the options. It receives the same shape as `#trigger`, `#prefix`, and `#suffix`: `{ open, disabled, selectedOption, clear, setOpen }`.

<ComponentPreview name="Select-Footer" layout="stacked" />

## Label, Description, Error
`Select` supports `label`, `description`, `error`, and `required` directly — no `FormControl` wrapper needed. The error suppresses the description and wires `aria-invalid` + `aria-errormessage` onto the trigger.

<ComponentPreview name="Select-Labeling" />

## Notes

- Prefer `#item-prefix`, `#item-label`, and `#item-suffix` when you want to
  customize the standard option row; reach for `#item` only when you need to
  replace the row shell too.
- Use `v-model:open` when a parent owns the menu state; use `setOpen` from the
  slot props when the code lives inside `#trigger` or `#footer`.
- A template ref exposes `{ clear, focus }`.
- By default, `Select` sizes itself to fit its option content. Set
  `class="w-full"` when you want a full-width trigger.
- `Select` accepts flat options only — no groups. Empty and nullish options are
  omitted. Option values are `string | number`.
- The menu is placed item-aligned (anchored over the trigger) by default.
  Passing `side`, `align`, or `offset` switches it to standard popper
  placement; `portalTo` changes the teleport target either way.

<!-- @include: ./Select.api.md -->
