# Switch

A toggle that turns a setting on or off.

<ComponentPlayground name="Switch" />

## Examples

### Notification settings

`icon` shows an icon before the label.

<ComponentPreview name="Switch-Icons" />

### Toolbar toggle

`padded` gives the switch a clickable surface and a hover state that match the
buttons beside it. A click anywhere on the row toggles the switch.

<ComponentPreview name="Switch-Toolbar" />

### Writing settings

A list of rows, each with a `description` below the label and the switch on
the right.

<ComponentPreview name="Switch-SettingsRows" />

## Behavior

### Icon

`icon` takes a `lucide-` class name, such as `"lucide-bell"`, or a component,
which is rendered with `<component :is>`.

### Control position

`controlPosition` is `end` by default, so the switch sits after the label and
the row fills the available width. `start` puts the switch before the label,
and the row fits its content. Both follow the text direction.

### Padded

`padded` wraps the switch and the label in a clickable surface with hover,
active and focus states, for toolbars and menu items. Without `padded`, only
the switch and its label respond to clicks, and the row has no hover or focus
state.

### Attributes

`class` and `style` go to the layout wrapper. Everything else (`name`,
`aria-*`, `data-*` and listeners) goes once to the interactive element, which
for `Switch` is the switch button.

## Accessibility

`Switch` renders a button with `role="switch"`, and `Space` or `Enter` toggles
it. An icon given as a class name is hidden from screen readers. `required`
sets `aria-required`. While `error` is set, the switch gets `aria-invalid` and
an `aria-errormessage` that points to the error text.

## Migrating from v0

`@change` is now `@update:modelValue`. Attributes used to go to the wrapper.
Now they go to the switch button. See the
[migration guide](/docs/migration#inputs) for details.

<!-- @include: ./Switch.api.md -->
