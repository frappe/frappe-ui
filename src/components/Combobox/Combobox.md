# Combobox

Lets users choose from available options or type their own. Provides clear, responsive feedback for every interaction.

## Playground

<ComponentPlayground name="Combobox" />

## Simple
A plain repo picker — just pass `options` as an array of strings.

<ComponentPreview name="Combobox-Simple" layout="stacked" />

## Emoji Picker
Button-triggered combobox via `trigger="button"`. The search input moves into the popover header. The button's label and prefix auto-derive from the selected option — `#item-prefix` doubles as the selected-state prefix, and `#prefix` is the placeholder icon shown before anything is picked.

<ComponentPreview name="Combobox-EmojiPicker" layout="stacked" />

## Grouped Options
Options split into named groups. `#item-prefix` renders a colored swatch per row.

<ComponentPreview name="Combobox-Grouped" />

## Custom Value
Free-form acceptance via `allowCustomValue`: the typed query becomes the model value when nothing matches, and unknown external values are preserved. The component renders a built-in "Create X" row as a click affordance. Use this when you want a "text input with autocomplete" feel. For richer create-new UX (custom label, icon, persistence callback), see [Create New](#create-new) below.

<ComponentPreview name="Combobox-CustomValue" />

## Clearable
Uses the `#trigger` slot to compose a custom trigger with an inline clear button. The X clears `v-model` via `@click.stop` so the popover doesn't toggle, and `@pointerdown.stop` keeps the anchor from intercepting the press.

<ComponentPreview name="Combobox-Clearable" />

## Create New
"Create new" is just a `type: 'custom'` option. `condition` hides the row when the query is empty or already matches an existing item, and `onClick` receives the typed `query` so you can persist the new value.

<ComponentPreview name="Combobox-CreateNew" />

## Status Picker
Dotted indicator aligned to the first line, with supporting description text.

<ComponentPreview name="Combobox-StatusPicker" />

## Member Picker
Avatar rows with a contextual invite action authored through a template slot.

<ComponentPreview name="Combobox-MemberPicker" />

## Footer
The `#footer` slot renders below the list and stays pinned to the bottom of the popover — it does not scroll with the options. Scroll the list to confirm the footer remains fixed.

<ComponentPreview name="Combobox-Footer" layout="stacked" />

## In Dialog
Combobox rendered inside a Dialog. Verifies focus restores to the trigger after the popover closes, even when wrapped by the Dialog's focus scope.

<ComponentPreview name="Combobox-InDialog" layout="stacked" />

## Label, Description, Error
`Combobox` supports `label`, `description`, `error`, and `required` directly — no `FormControl` wrapper needed. The error suppresses the description and wires `aria-invalid` + `aria-errormessage` onto the input.

<ComponentPreview name="Combobox-Labeling" />

<!-- @include: ./Combobox.api.md -->
