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

## ScrollBar

The scrollbar thumb, rendered internally by `ScrollArea` — not something apps
mount on its own. Exported for the rare case of composing it into a custom
scroll root.

## Styling

`data-slot="scroll-area"` / `"scroll-area-viewport"` / `"scroll-area-scrollbar"`
/ `"scroll-area-thumb"` mark the root, the scrolling viewport, the scrollbar
track, and the thumb, for app-level CSS.

<!-- @include: ./ScrollArea.api.md -->
