# Select

Lets users select one option from a list. Ideal for forms, settings, or any
interface where a single choice is required.

## Example
<ComponentPreview name="Select-Example" />

## Custom Option Layout
Use `#item-prefix` and `#item-label` to tailor the standard row — for example, an avatar plus a two-line label with a secondary description. `#prefix` on the trigger reuses the selected option's accessory.

<ComponentPreview name="Select-OptionSlot" />

## States
<ComponentPreview name="Select-States" />

## Trigger Slots
<ComponentPreview name="Select-TriggerSlots" />

## Notes

- Prefer `#item-prefix`, `#item-label`, and `#item-suffix` when you want to
  customize the standard option row.
- Use `v-model:open` when you need to control the menu state.
- By default, `Select` sizes itself to fit its option content. Set
  `class="w-full"` when you want a full-width trigger.
- `Select` accepts flat options only. Empty and nullish options are omitted.

<!-- @include: ../../../meta/Select.md -->
