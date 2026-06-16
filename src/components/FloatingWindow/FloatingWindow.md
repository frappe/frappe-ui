# FloatingWindow

A panel that can be docked inline, popped out into a draggable / resizable
floating window, maximized, or minimized to a bottom-right tray — like a chat or
mail composer. It teleports to `<body>` while detached so it escapes any host
layout's overflow and stacking contexts, and can persist its geometry across
sessions.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import { FloatingWindow } from 'frappe-ui'

const mode = ref('docked')
</script>

<template>
  <FloatingWindow
    v-model:mode="mode"
    title="Messages"
    storage-key="my-app:messages"
  >
    <div class="p-3">Any content lives here.</div>
  </FloatingWindow>
</template>
```

The window is uncontrolled by default — the built-in chrome's pop-out / dock /
minimize / maximize buttons drive `mode`. Bind `v-model:mode` to drive it from
the host instead.

## Props

| Prop               | Type                                                   | Default    | Description                                                              |
| ------------------ | ------------------------------------------------------ | ---------- | ------------------------------------------------------------------------ |
| `mode`             | `'docked' \| 'floating' \| 'minimized' \| 'maximized'` | `'docked'` | Window state. Use `v-model:mode` to control it.                          |
| `title`            | `string`                                               | `''`       | Title shown in the built-in title bar.                                   |
| `storageKey`       | `string \| null`                                       | `null`     | localStorage key to persist `{ mode, rect }` under. `null` doesn't save. |
| `initialWidth`     | `number`                                               | `460`      | Default floating width, used when popping out.                           |
| `initialHeight`    | `number`                                               | `520`      | Default floating height.                                                 |
| `minWidth`         | `number`                                               | `380`      | Smallest the panel can be resized to, horizontally.                      |
| `minHeight`        | `number`                                               | `300`      | Smallest the panel can be resized to, vertically.                        |
| `resizable`        | `boolean`                                              | `true`     | Show the bottom-right resize grip while floating.                        |
| `draggable`        | `boolean`                                              | `true`     | Allow dragging by the title bar while floating.                          |
| `dockable`         | `boolean`                                              | `true`     | Offer the pop-out / dock control and double-click-to-maximize.           |
| `chromeWhenDocked` | `boolean`                                              | `true`     | Render the title bar while docked. Turn off to let the host own it.      |

## Events

| Event         | Payload      | Description                        |
| ------------- | ------------ | ---------------------------------- |
| `update:mode` | `WindowMode` | Emitted whenever the mode changes. |

## Slots

| Slot      | Props                                                       | Description                                                                                      |
| --------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `default` | `{ mode }`                                                  | The window body.                                                                                 |
| `header`  | `{ mode, dock, float, minimize, maximize, expandFromTray }` | Replaces the built-in title bar entirely; becomes the drag handle and supplies its own controls. |
| `title`   | `{ mode }`                                                  | Custom title content within the built-in chrome.                                                 |
| `actions` | `{ mode, dock, float, minimize, maximize }`                 | Extra controls inserted before the built-in window buttons.                                      |

## Headless composable

`useFloatingWindow(panel, handle, options)` exposes the drag + resize + state
engine on its own, for building a custom shell:

```ts
import { useFloatingWindow } from 'frappe-ui'

const { mode, style, dock, float, minimize, maximize, startResize } =
  useFloatingWindow(panelRef, handleRef, { storageKey: 'my-app:window' })
```
