# BottomSheet

A panel that slides up from the bottom edge and holds the screen until it is
dismissed. The mobile counterpart to [`Dialog`](./dialog) — same modal
semantics, reached by thumb instead of by pointer.

Built on [reka-ui](https://reka-ui.com/)'s `Dialog` primitives, so the focus
trap, scroll lock and `Escape` handling come for free. On top of that it adds a
grab handle and swipe-down-to-dismiss.

## Basic

Bind `v-model:open`. The sheet sizes itself to its content up to 90% of the
viewport height, then scrolls inside.

<ComponentPreview name="BottomSheet-Example" />

## Title

`title` renders a centered heading in the grab-handle area and labels the sheet
for screen readers. Without it the sheet is labelled "Bottom sheet".

<ComponentPreview name="BottomSheet-Title" />

## Non-dismissible

`dismissible` defaults to `true`. Set it to `false` to turn off all three
dismiss channels at once — outside click, `Escape`, and swipe-down — for a sheet
that has to be answered.

<ComponentPreview name="BottomSheet-NonDismissible" />

## Gestures

Dragging works from anywhere on the sheet, not just the handle. A gesture that
starts inside a scrolled list scrolls that list instead of moving the sheet; it
becomes a drag once the list is back at its top. A drag closes the sheet if it
passes a distance threshold or ends in a fast flick, and springs back otherwise.

The gesture logic lives in the `useSheetDrag` composable, exported from the
package root if you need the same behaviour on a surface of your own.

## Events

`update:open` fires as soon as the sheet starts closing. `after-leave` fires
once the close animation has finished — use it to reset state that would flicker
if cleared mid-animation.

## Notes

- Use `Dialog` on desktop and `BottomSheet` on mobile. They are separate
  components rather than one responsive component, because the two have
  different dismiss affordances and different content rhythms.
- The sheet takes no `actions` prop. Put buttons in the default slot, where they
  can sit inside the scroll region or below it as the layout needs.

<!-- @include: ./BottomSheet.api.md -->
