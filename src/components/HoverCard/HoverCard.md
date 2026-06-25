# HoverCard

Shows a floating panel when the pointer rests on (or the keyboard focuses) a
trigger — for profile previews, link previews, and other sighted-only context.
Built on [reka-ui](https://reka-ui.com/)'s `HoverCard` primitives.

Use `HoverCard` for hover-driven panels and [`Popover`](./popover) for
click-driven ones. For short text hints prefer [`Tooltip`](./tooltip) instead.

## Example

`#trigger` is rendered as-child, so hover and focus a11y are wired
automatically. `#default` renders inside the standard panel shell.

<ComponentPreview name="HoverCard-Example" />

## Delays

`hoverDelay` and `leaveDelay` are in **seconds** (consistent with `Tooltip`).
`hoverDelay` is how long the pointer must rest before the card opens;
`leaveDelay` is how long after the pointer leaves before it closes.

<ComponentPreview name="HoverCard-Delays" />

## Arrow

Set `arrow` to render a small arrow pointing at the trigger, styled to match the
panel surface.

<ComponentPreview name="HoverCard-Arrow" />

## Styling

Like `Popover`, the card owns its panel shell and exposes the same stable
`data-slot` hooks — `[data-slot="content"]` for the portaled content and
`[data-slot="content-body"]` for the shell that owns the visuals. There are no
class-injection props.

## Motion

A hover open always uses the animated scale-from-trigger entrance (180ms in /
140ms out), and `prefers-reduced-motion` is respected. No configuration is
required.

## Notes

- `HoverCard` is for sighted-only enhancement — don't put essential actions or
  information that can only be reached by hovering.
- The card stays open while the pointer is over either the trigger or the card,
  so users can move into it to interact.

<!-- @include: ./HoverCard.api.md -->
