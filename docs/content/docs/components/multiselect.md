# MultiSelect

Searchable multi-choice picker. Matches the `Combobox` / `Select` item-slot model and provides built-in Clear All / Select All footer controls.

## Default
A plain picker — button trigger opens a popover with a search input, option list, and default footer.

<ComponentPreview name="MultiSelect-Example" css='justify-center !py-20' />

## Item Prefix
Use `#item-prefix` to render avatars, icons, or indicators next to each option label.

<ComponentPreview name="MultiSelect-Options" css='justify-center !py-20' />

## Grouped Options
Options can be split into named groups. Group labels render above each group's items.

<ComponentPreview name="MultiSelect-Grouped" css='justify-center !py-20' />

## Custom Footer
Replace the default Clear All / Select All footer with a custom one. The slot receives `clearAll`, `selectAll`, `selectedOptions`, and `query`.

<ComponentPreview name="MultiSelect-Footer" css='justify-center !py-20' />

## Custom Trigger
Use `#trigger` to fully replace the default button trigger. The slot receives `open`, `disabled`, `selectedOptions`, `displayValue`, `clearAll`, and `toggleOpen`.

<ComponentPreview name="MultiSelect-TriggerSlot" css='justify-center !py-20' />

## Tags Trigger
A chips-style trigger: each selected option renders as a removable `Badge`, with inline remove buttons. Authored through `#trigger` using `selectedOptions` and the parent's `v-model`.

<ComponentPreview name="MultiSelect-TagsTrigger" css='justify-center !py-20' />

<!-- @include: ../../../meta/MultiSelect.md -->
