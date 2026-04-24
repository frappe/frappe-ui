# Combobox

Lets users choose from available options or type their own. Provides clear, responsive feedback for every interaction.

## Simple
A plain repo picker — just pass `options` as an array of strings.

<ComponentPreview name="Combobox-Simple" layout="stacked" css='justify-center !py-20 grid' />

## Emoji Picker
Button-triggered combobox via `trigger="button"`. The search input moves into the popover header. The button's label and prefix auto-derive from the selected option — `#item-prefix` doubles as the selected-state prefix, and `#prefix` is the placeholder icon shown before anything is picked.

<ComponentPreview name="Combobox-EmojiPicker" layout="stacked" css='justify-center !py-20 grid' />

## Grouped Options
Options split into named groups. `#item-prefix` renders a colored swatch per row.

<ComponentPreview name="Combobox-Grouped" css='justify-center !py-20 grid' />

## Custom Value
Provides a creatable option if no results match the current query.

<ComponentPreview name="Combobox-CustomValue" css='justify-center !py-20 grid' />

## Status Picker
Dotted indicator aligned to the first line, with supporting description text.

<ComponentPreview name="Combobox-StatusPicker" css='justify-center !py-20 grid' />

## Member Picker
Avatar rows with a contextual invite action authored through a template slot.

<ComponentPreview name="Combobox-MemberPicker" css='justify-center !py-20 grid' />

<!-- @include: ../../../meta/Combobox.md -->
