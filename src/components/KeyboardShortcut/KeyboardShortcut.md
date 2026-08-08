# KeyboardShortcut

Renders a keyboard combo, e.g. `Mod+K`, as styled keys. `Mod` resolves to `⌘`
on macOS and `Ctrl` elsewhere.

## Playground

<ComponentPlayground name="KeyboardShortcut" />

## Default

<ComponentPreview name="KeyboardShortcut-Default" />

Purely presentational — it doesn't register or fire the shortcut. Pair it with
[`useShortcut`](../other/composables.md#useshortcut) for that.

<!-- @include: ./KeyboardShortcut.api.md -->
