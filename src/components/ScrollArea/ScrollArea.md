# ScrollArea

A styled, cross-browser scroll container: overlay scrollbars that fade in on
hover or scroll and stay off native scrollbar rendering differences. A general
primitive, not specific to the app shell — `DesktopShell` uses it for its main
content region, and `SettingsDialog` uses it for a panel body.

<ComponentPreview name="ScrollArea-Default" />

Pass content as the default slot; `orientation` picks which scrollbars render
(`vertical` by default). Reach the real scrolling element through the exposed
`viewportElement` when something outside needs it — driving a virtualization
library, or registering the region with `shellScrollContainer`.

```ts
const scrollArea = useTemplateRef('scrollArea')
scrollArea.value?.viewportElement // HTMLElement | null
```

## Orientation

`orientation="both"` renders **both** scrollbars, one per axis, not a single
diagonal one. Use it for a surface that can overflow either way — a wide table,
a canvas. `vertical` (the default) and `horizontal` render one.

## Styling

`data-slot="scroll-area"` / `"scroll-area-viewport"` / `"scroll-area-scrollbar"`
/ `"scroll-area-thumb"` mark the root, the scrolling viewport, the scrollbar
track, and the thumb, for app-level CSS.

`viewportClass` is the one class-name prop the library ships, and the documented
exception to P10. The scrolling viewport is an element reka-ui owns inside the
root, so root `class` fallthrough cannot reach it, and layout rules that have to
sit on the scroller itself (`[&>div]:h-full`, a grid, a min-width) have nowhere
else to go. Style everything else through the `data-slot` hooks.

`ScrollBar` is not exported. `ScrollArea` renders its own scrollbars, and the
component only works inside reka-ui's `ScrollAreaRoot`, which frappe-ui does not
export.

<!-- @include: ./ScrollArea.api.md -->
