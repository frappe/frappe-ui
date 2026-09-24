# HoverCard

A floating panel that opens when the pointer rests on a trigger or the
keyboard focuses it, for previews of a person or a link. For a panel that
opens on click, use [`Popover`](./popover), and for a short text hint, use
[`Tooltip`](./tooltip).

<ComponentPreview name="HoverCard-Example" />

## Examples

### Link preview

`side="top"` opens the card above the link, and `arrow` points it back at the
link.

<ComponentPreview name="HoverCard-LinkPreview" />

### Assignees

Shorter `hover-delay` and `leave-delay` values let the pointer move across a
row of avatars and open each card quickly.

<ComponentPreview name="HoverCard-Assignees" />

## Behavior

### Trigger and content

Put the trigger in `#trigger` and the card content in `#default`. Both slots
receive `{ open, setOpen, close }`, where `close()` is the same as
`setOpen(false)`.

### Delays

`hoverDelay` is how long the pointer must rest on the trigger before the card
opens. `leaveDelay` is how long the card waits after the pointer leaves before
it closes. Both are in milliseconds, like `Tooltip`'s, and both default to
`300`.

### Moving into the card

The card stays open while the pointer is over the trigger or over the card, so
people can move into the card and click a link in it.

### Position

`side`, `align`, `offset` and `collisionPadding` work the same as on
[`Popover`](./popover#position).

## Accessibility

The card also opens when the trigger gets keyboard focus. Touch screens and
screen readers may never show it, so do not put an action or a fact in the card
that people cannot reach another way.

<!-- @include: ./HoverCard.api.md -->
