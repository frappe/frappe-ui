# Divider

A horizontal or vertical line that separates content. It can also hold a small
button on the line.

<ComponentPlayground name="Divider" />

## Examples

### Toolbar groups

Vertical dividers between groups of toolbar buttons. `flex-item` makes each
divider as tall as its flex row.

<ComponentPreview name="Divider-Toolbar" />

### Older comments

A divider with an `action` above a comment thread. The button shows the older
comments.

<ComponentPreview name="Divider-OlderComments" />

## Behavior

### Action

`action` puts a button on the line. It takes the same fields as `Button`, such
as `label`, `theme`, `variant`, `size` and icons, plus `onClick`. The button
defaults to `variant="outline"` and `size="sm"`. The line runs the full length
of the divider, behind the button.

`align` places the button at the `start`, `center` or `end` of the line. The
default is `center`. Without an `action`, `align` does nothing.

### Vertical dividers

With `orientation="vertical"`, the divider takes the full height of its own
box. Inside a flex row whose items have different heights, add `flex-item`, so
the divider stretches to the height of the row.

## Accessibility

A plain divider renders an `<hr>`, which screen readers announce as a
separator. A divider with an `action` renders the line as an element with
`role="separator"` and `aria-orientation`.

<!-- @include: ./Divider.api.md -->
