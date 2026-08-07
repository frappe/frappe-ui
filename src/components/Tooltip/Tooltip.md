# Tooltip

A small label that describes its trigger, shown on hover or keyboard focus.
Built on [reka-ui](https://reka-ui.com/)'s `Tooltip` primitives, so focus,
dismissal and aria wiring come for free.

## Playground

<ComponentPlayground name="Tooltip" />

## Default

Pass the label as `text` and wrap the trigger in the default slot.

<ComponentPreview name="Tooltip-Examples" />

## Side and offset

`side` (`top` / `right` / `bottom` / `left`) picks which edge of the trigger the
tooltip sits on; `offset` sets the gap in px. Both match `Popover` and
`HoverCard`. The tooltip flips automatically to stay inside the viewport.

## Slots

`#content` replaces the label inside the standard bubble. `#body` replaces the
whole bubble, so the content brings its own surface — the arrow still renders.

<ComponentPreview name="Tooltip-Slots" />

## Grouping (shared hover delay)

Wrap a group of buttons in a `TooltipProvider` so that once one tooltip is open,
moving the pointer to a neighbouring trigger within `skip-delay` opens its
tooltip instantly — no delay between adjacent buttons. `Tooltip` and
tooltip-bearing `Button`s automatically reuse a surrounding provider instead of
creating their own.

<ComponentPreview name="Tooltip-Group" />

## Styling

There are no class-injection props. Style the tooltip through the stable
`data-slot` hooks:

| Hook                    | Element                                      |
| ----------------------- | -------------------------------------------- |
| `[data-slot="content"]` | the portaled content (reka `TooltipContent`) |
| `[data-slot="bubble"]`  | the default bubble that owns the visuals     |
| `[data-slot="arrow"]`   | the arrow pointing back at the trigger       |

```css
:where([data-slot='bubble']) {
  /* your overrides */
}
```

## Notes

- Set `disabled` to suppress the tooltip while still rendering the trigger.
  Useful when the label only applies in some states.
- A tooltip labels its trigger — it is not a place for interactive content.
  For a panel you can click into, use [`HoverCard`](./hovercard).

## Migrating from v0

`placement` is now `side`, and `arrowClass` is gone — style the arrow through
`[data-slot="arrow"]`, or use `offset` if you were using it to nudge the
tooltip's position.

<!-- @include: ./Tooltip.api.md -->
