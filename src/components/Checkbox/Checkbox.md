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

### Label, description and error

`label` renders beside the box and `description` below it, lined up with the
label text. `error` renders below the label and hides `description`. It takes a
string, an array of strings (one line each), or an `Error`, the same values as
[ErrorMessage](./errormessage). An empty string or an empty array means no
error. `required` adds a red asterisk to the label and sets `required` on the
`<input>`.

The `#label` slot replaces the label text and the required marker, and receives
`{ required }`. A `#description` slot is not hidden by `error`. It renders
above the error.

### Attributes

`class` and `style` go on the outer element, which holds the box, the label,
the description and the error. Every other attribute and listener goes on the
`<input type="checkbox">`, including `name`, `aria-*` and `@change`.

## Accessibility

`Checkbox` renders a native `<input type="checkbox">`, so `Space` toggles it.
`required` sets `aria-required`. While `error` is set, the input gets
`aria-invalid` and an `aria-errormessage` that points to the error text.

## Migrating from v0

`padding` is now `padded`. Attributes used to go to both the wrapper and the
`<input>`, so a listener fired twice; now it fires once, from the input. See
the [migration guide](/docs/migration#inputs-attrs) for details.

<!-- @include: ./Checkbox.api.md -->
