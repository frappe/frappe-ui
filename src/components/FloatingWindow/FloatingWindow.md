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
title-bar controls because both write to the same bound value.

<ComponentPreview name="FloatingWindow-Controlled" />

## Custom header

The `header` slot replaces the built-in title bar entirely. It becomes the drag
handle while floating and supplies its own controls through the slot props
(`mode`, `dock`, `float`, `minimize`, `expandFromTray`). The demo wires a status
dot, a Hide control, and a pop-out toggle into a custom support-chat header.

<ComponentPreview name="FloatingWindow-CustomHeader" />

## Actions

The `actions` slot adds controls before the built-in window buttons while
keeping the standard chrome. Here a mail composer slots in a Discard button that
clears the draft, sitting alongside the usual pop-out and minimize controls.

<ComponentPreview name="FloatingWindow-Actions" />

## Persisting geometry

Pass a `storageKey` to remember the window's mode, position, and size in
localStorage. Move or resize the window, reload the page, and it returns where
you left it. Omit the key to reset every session.

The component persists only its geometry. The demo is a loose take on the
framework's `EmailComposer` (which is itself a `FloatingWindow` underneath) that
persists its draft too, under a matching `useStorage` key. Fill in the
recipients and body, add an attachment, reload the page, and the whole composer
comes back intact.

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
panel and its drag handle. `options` accepts `initialMode`, `initialWidth`,
`initialHeight`, `minWidth`, `minHeight`, and `storageKey`. The demo builds an
activity feed on top of the composable, collapsing its body when minimized.

<ComponentPreview name="FloatingWindow-Headless" />

<!-- @include: ./FloatingWindow.api.md -->
