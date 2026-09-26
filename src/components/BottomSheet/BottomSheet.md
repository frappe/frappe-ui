# BottomSheet

A panel that slides up from the bottom edge of a mobile screen and blocks the
page until it is closed. On desktop, render [`Dialog`](./dialog) instead: the
two close in different ways, so they are separate components.

<ComponentPreview name="BottomSheet-Title" />

## Examples

### Pick from a long list

The sheet grows with its content up to 90% of the screen height, then the
content scrolls inside it.

<ComponentPreview name="BottomSheet-SpacePicker" />

### Discard a draft

`:dismissible="false"` keeps the sheet open until the person picks one of the
buttons.

<ComponentPreview name="BottomSheet-NonDismissible" />

## Behavior

### Open state

Bind `v-model:open`. The sheet takes its height from its content, up to 90% of
the screen height. Past that, the default slot scrolls.

### Title

`title` shows a centered heading below the grab handle.

### Closing

The sheet closes on a click outside it, on `Escape`, and on a swipe down.
`dismissible` is `true` by default. Set it to `false` to turn off all three at
once, for a sheet that needs an answer.

### Dragging

A drag works from anywhere on the sheet, not only from the handle. A drag that
starts inside a scrolled list scrolls the list instead. It becomes a drag of
the sheet once the list is back at its top. A drag closes the sheet when it
goes far enough or ends in a fast flick. Otherwise the sheet moves back up.

Put `data-no-sheet-drag` on an element that has its own gesture, such as a
carousel, a map or a slider. A drag that starts there never moves the sheet:

```vue
<BottomSheet v-model:open="open">
  <ImageCarousel data-no-sheet-drag />
</BottomSheet>
```

### Buttons

The sheet has no `actions` prop. Put buttons in the default slot, inside the
scrolling content or below it, as the layout needs.

### Events

`update:open` fires as soon as the sheet starts to close. `after-leave` fires
when the close animation has finished. Use it to reset state that would
visibly change while the sheet is still sliding away.

## Accessibility

The sheet is a modal dialog. Focus stays inside it while it is open, and the
page behind it does not scroll. `title` is the sheet's accessible name. Without
a title, screen readers read "Bottom sheet".

<!-- @include: ./BottomSheet.api.md -->
