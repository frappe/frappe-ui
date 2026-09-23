# Checkbox

A box that turns one option on or off. For a dropdown that picks several
options, use [MultiSelect](./multiselect), which draws the checkbox rows for
you.

<ComponentPlayground name="Checkbox" />

## Examples

### Select all

A parent checkbox with `indeterminate` shows that only some of its children
are checked. Clicking it checks all of them, and clicking again clears them.
`padded` gives each row a clickable surface.

<ComponentPreview name="Checkbox-Indeterminate" />

### Notification settings

A `description` shows below the label, lined up with the label text.

<ComponentPreview name="Checkbox-SettingsList" />

### Print settings

Checkboxes in a row that wraps, under a section title.

<ComponentPreview name="Checkbox-HorizontalGroup" />

### Setting with several values

A column of checkboxes as the value side of a label and value row. One option
is `disabled`, so it always stays checked.

<ComponentPreview name="Checkbox-SettingRow" />

## Behavior

### Value

The value is a `boolean`. `1` and `0` also work, and stay supported in v1.

### Indeterminate

`indeterminate` draws the mixed state. It only changes how the box looks, and
you must set it with the prop: the browser does not read an `indeterminate`
attribute from markup.

### Padded

`padded` wraps the box and the label in a clickable surface with hover, active
and focus states, for selection lists and menu items. The box stays on the
leading side.

### Attributes

`class` and `style` go to the layout wrapper. Everything else (`name`,
`aria-*`, `data-*` and listeners) goes once to the interactive element, which
for `Checkbox` is the `<input type="checkbox">`.

## Accessibility

`Checkbox` renders a native `<input type="checkbox">`, so `Space` toggles it.
`required` sets `aria-required`. While `error` is set, the input gets
`aria-invalid` and an `aria-errormessage` that points to the error text.

## Migrating from v0

`padding` is now `padded`. Attributes used to go to both the wrapper and the
`<input>`, so a listener fired twice; now it fires once, from the input. See
the [migration guide](/docs/migration#inputs-attrs) for details.

<!-- @include: ./Checkbox.api.md -->
