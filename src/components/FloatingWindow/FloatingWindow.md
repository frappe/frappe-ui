# FloatingWindow

A panel that lives inline while docked, pops out into a draggable, resizable
floating window, or collapses to a bottom-right tray. It suits chat threads,
mail composers, and any side panel a user keeps open while working elsewhere.

While detached the panel teleports to `<body>`, so it escapes the host layout's
overflow and stacking contexts, and it can persist its geometry across sessions.
Only one window is detached at a time: popping one out docks whichever window was
already floating, the way a single chat or mail composer behaves.

## Usage

The window is uncontrolled by default. The built-in title bar carries the
pop-out, dock, and minimize controls that drive its `mode`. The body goes in the
default slot and scrolls, while an optional `footer` slot pins a composer or
action bar below it (both collapse into the title bar when minimized). The demo
is a working chat: type a message and send it, pop the panel out to keep talking
while you scroll, then minimize it to the tray.

<ComponentPreview name="FloatingWindow-Default" layout="stacked" />

## Controlled

Bind `v-model:mode` to drive the window from the host. The three modes are
`docked`, `floating`, and `minimized`. A `TabButtons` segmented control surfaces
the active mode as a raised pill, and it stays in sync with the built-in
title-bar controls because both write to the same bound value. A live `Mode`
readout sits beside it, so the binding stays visible once the window detaches to
the bottom-right corner of the viewport (floating and minimized both leave the
docked spot).

<ComponentPreview name="FloatingWindow-Controlled" />

## Custom header

The `header` slot replaces the built-in title bar entirely. It becomes the drag
handle while floating and supplies its own controls through the slot props
(`mode`, `dock`, `float`, `minimize`, `expandFromTray`). The demo wires a status
dot and state-aware window controls (pop out, dock, minimize, and expand) into a
custom support-chat header.

<ComponentPreview name="FloatingWindow-CustomHeader" />

## Actions

The `actions` slot adds controls before the built-in window buttons while
keeping the standard chrome. The demo is a mail composer: its CC and BCC field
toggles sit in the actions slot, beside the window controls, while attach,
discard, and send fill the footer. It also sets `minimizable` to `false`, so the
window only docks or floats and never collapses to the tray: pop it out from the
docked state, then close it back from the floating state.

<ComponentPreview name="FloatingWindow-Actions" />

## Persisting geometry

Pass a `storageKey` to remember the window's mode, position, and size in
localStorage. Move or resize the window, reload the page, and it returns where
you left it. Omit the key to reset every session.

The component persists only its geometry, so layer your own `useStorage` key over
the content you want to keep. The demo is a personal task list that does exactly
that: add or tick off tasks, move or resize the window, reload the page, and both
the layout and your list come back.

<ComponentPreview name="FloatingWindow-Persisted" />

## Headless composable

`useFloatingWindow(panel, handle, options)` exposes the drag, resize, and
window-state engine on its own, for building a custom shell. It owns the
geometry, the mode state machine, viewport clamping, and persistence; you own
the markup.

```ts
import { useFloatingWindow } from 'frappe-ui'

const panel = ref<HTMLElement | null>(null)
const handle = ref<HTMLElement | null>(null)

const { mode, style, dock, float, minimize, startResize } =
  useFloatingWindow(panel, handle, { storageKey: 'my-app:window' })
```

Bind `style` to your panel element and `ref="panel"` / `ref="handle"` to the
panel and its drag handle. `options` accepts `initialMode` and `storageKey`. The
window opens at a sensible default size and is resizable from there. Beyond the
actions,
the composable also exposes live geometry (`width`, `height`, `x`, `y`,
`isDragging`, `isResizing`) that the boxed component keeps to itself. The demo
reads that live `width` to build a responsive ticket panel: pop it out and drag
it wider, and a reading pane opens beside the list, something the slot-based
component can't express.

<ComponentPreview name="FloatingWindow-Headless" />

<!-- @include: ./FloatingWindow.api.md -->
