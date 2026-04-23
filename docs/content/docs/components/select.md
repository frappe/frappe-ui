# Select

Lets users select one option from a list. Ideal for forms, settings, or any
interface where a single choice is required.

<!-- AUTO-GENERATED STORIES START -->
## Example
<ComponentPreview name="Select-Example" />

## Option Slot
<ComponentPreview name="Select-OptionSlot" />

## States
<ComponentPreview name="Select-States" />

## Trigger Slots
<ComponentPreview name="Select-TriggerSlots" />
<!-- AUTO-GENERATED STORIES END -->

## Notes

- Prefer `#item-prefix`, `#item-label`, and `#item-suffix` when you want to
  customize the standard option row.
- Use `v-model:open` when you need to control the menu state.
- By default, `Select` sizes itself to fit its option content. Set
  `class="w-full"` when you want a full-width trigger.
- `Select` accepts flat options only. Empty and nullish options are omitted.

<!-- @include: ../../../meta/Select.md -->
