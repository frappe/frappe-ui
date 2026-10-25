# Tooltip

A small label that describes its trigger, shown on hover or keyboard focus.
For content people interact with, such as links or buttons, use
[`HoverCard`](./hovercard) or [`Popover`](./popover).

<ComponentPlayground name="Tooltip" />

## Examples

### Toolbar buttons

`TooltipProvider` groups the tooltips of a toolbar. After the first tooltip
opens, moving to the next button opens its tooltip at once.

<ComponentPreview name="Tooltip-Group" />

### Keyboard shortcut

The `#content` slot shows the button's name and its shortcut.

<ComponentPreview name="Tooltip-Shortcut" />

### File preview

`bare` drops the dark bubble, so an image preview shows on its own surface.

<ComponentPreview name="Tooltip-FilePreview" />

### Warning on a delete button

`:hover-delay="0"` shows the warning as soon as the pointer reaches the
button.

<ComponentPreview name="Tooltip-Examples" />

## Behavior

### Trigger and content

The default slot is the **trigger**. Tooltip is the only overlay that works
this way, because `<Tooltip text="Delete"><Button /></Tooltip>` is what almost
every use needs. The trigger must be an element that can take focus, or the
tooltip does not open from the keyboard.

`text` is the label. The `#content` slot replaces it with richer content, which
shows inside the same bubble. Add `bare` when the content has its own surface,
such as an image. The arrow shows in both cases.

### Position

`side` (`top`, `right`, `bottom`, `left`) picks the edge of the trigger the
tooltip opens on, and `offset` sets the gap in pixels. Both work the same as on
`Popover` and `HoverCard`. The tooltip flips to stay inside the screen.

### Hover delay

`hoverDelay` is how long the pointer must rest on the trigger before the
tooltip opens, in milliseconds. It defaults to `500`.

### Groups

Wrap a row of triggers in a `TooltipProvider`. Once one tooltip in the group is
open, moving the pointer to another trigger within `skipDelay` opens its
tooltip with no delay. `Tooltip` and a `Button` with a `tooltip` prop use the
surrounding provider instead of creating their own. Inside a provider, the
provider's `hoverDelay` applies, not the tooltip's.

### Disabled

`disabled` turns off the tooltip and still renders the trigger. Use it when the
label applies only in some states.

## Accessibility

The tooltip opens when its trigger gets keyboard focus and closes on
<kbd>Escape</kbd>. It has the `tooltip` role, and screen readers read it as the
trigger's description.

<!-- @include: ./Tooltip.api.md -->
