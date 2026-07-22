# Select

Lets users select one option from a list. Ideal for forms, settings, or any
interface where a single choice is required.

## Playground

<ComponentPlayground name="Select" />

## Example
<ComponentPreview name="Select-Example" />

## Custom Option Layout
Use `#item-prefix` and `#item-label` to tailor the standard row — for example, an avatar plus a two-line label with a secondary description. `#prefix` on the trigger reuses the selected option's accessory.

<ComponentPreview name="Select-OptionSlot" />

## States
<ComponentPreview name="Select-States" />

## Trigger Slots
<ComponentPreview name="Select-TriggerSlots" />

## Footer
The `#footer` slot renders below the option list and stays pinned to the bottom of the popover — it does not scroll with the options. The slot receives `selectedOption` and `clearSelection`.

<ComponentPreview name="Select-Footer" layout="stacked" />

## Label, Description, Error
`Select` supports `label`, `description`, `error`, and `required` directly — no `FormControl` wrapper needed. The error suppresses the description and wires `aria-invalid` + `aria-errormessage` onto the trigger.

<ComponentPreview name="Select-Labeling" />

## Notes

- Prefer `#item-prefix`, `#item-label`, and `#item-suffix` when you want to
  customize the standard option row.
- Use `v-model:open` when you need to control the menu state.
- By default, `Select` sizes itself to fit its option content. Set
  `class="w-full"` when you want a full-width trigger.
- `Select` accepts flat options only. Empty and nullish options are omitted.

<!-- @include: ./Select.api.md -->
