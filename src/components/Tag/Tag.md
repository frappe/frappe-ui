# Tag

A small label, such as an applied filter, a selected value or a label on a
record. Unlike [Badge](/docs/components/badge), a tag can be a button: with a
`@click` listener or `dismissible`, it has hover, pressed and focus states.

<ComponentPlayground name="Tag" />

## Examples

### Filters

Each applied filter is a `dismissible` tag. `@dismiss` removes it from the list.

<ComponentPreview name="Tag-Filters" />

### Labels

An `outline` tag with a colored dot in `#prefix` for labels on a record.

<ComponentPreview name="Tag-Labels" />

### Variants and themes

Every `variant` in every `theme`.

<ComponentPreview name="Tag-Variants" />

## Behavior

### Static or interactive

A tag with no `@click` listener that is not `dismissible` renders as a plain
`<span>`: no tab stop, no button role, no hover or pressed states. Add either
one and it renders as a `<button>`.

### Dismissing

`dismissible` shows a × after the label. Clicking the ×, or pressing Delete or
Backspace while the tag has focus, emits `dismiss`. The tag does not remove
itself; the parent does. A click on the × does not also fire a `click` on the
tag, so the rest of the tag can do something else, such as open the filter.
Screen readers hear "Press Delete to remove" as the tag's description.

When the parent removes a tag dismissed from the keyboard, focus falls back to
the page. Call `focus()` on a neighbouring tag's ref, so a keyboard user can
keep working through a row of filters.

### Label and slots

`label` takes a string or a number. The default slot replaces it. `#prefix` and
`#suffix` place a 12px icon or dot before and after the label; the × comes after
`#suffix`.

### Disabled

`disabled` dims the tag to 50%, drops its hover and pressed states, takes it out
of the tab order and stops `dismiss`.

### Unsupported values

A `theme`, `variant` or `size` outside the supported values falls back to the
default (`gray`, `subtle`, `md`) and logs a warning in development.

<!-- @include: ./Tag.api.md -->
