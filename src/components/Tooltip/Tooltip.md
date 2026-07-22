#  Tooltip

A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

## Playground

<ComponentPlayground name="Tooltip" />

## Default
<ComponentPreview name="Tooltip-Examples" />

## With Slots

<ComponentPreview name="Tooltip-Slots" />

## Grouping (shared hover delay)

Wrap a group of buttons in a `TooltipProvider` so that once one tooltip is open, moving the pointer to a neighbouring trigger within `skip-delay` opens its tooltip instantly — no delay between adjacent buttons. `Tooltip` and tooltip-bearing `Button`s automatically reuse a surrounding provider instead of creating their own.

<ComponentPreview name="Tooltip-Group" />

<!-- @include: ./Tooltip.api.md -->
