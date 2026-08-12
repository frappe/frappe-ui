# KeyboardShortcut

Renders a keyboard combo, e.g. `Mod+K`, as styled keys. `Mod` resolves to `⌘` on
macOS and `Ctrl` elsewhere.

## Playground

<ComponentPlayground name="KeyboardShortcut" />

## Default

<ComponentPreview name="KeyboardShortcut-Default" />

Purely presentational. It does not register or fire the shortcut. Pair it with
[`useKeyboardShortcut`](../other/composables.md#usekeyboardshortcut) for that.

It reads the same key names as a shortcut combo, so a combo written for
`useKeyboardShortcut` renders here unchanged: `Digit1` shows `1`, `Slash` shows
`/`, `Backtick` shows `` ` ``.

## Styling hooks

The root carries `data-slot="keyboard-shortcut"` and `data-variant="bg"` or
`data-variant="plain"`. Each key carries `data-slot="key"` with a
`data-key-type` of `cmd`, `ctrl`, `shift`, `alt`, `win` or `key`. The `+`
separators carry `data-slot="separator"`, and alternative combos sit in
`data-slot="alt-combos"`. Style through those instead of a class prop (P10):

```css
[data-slot='keyboard-shortcut'][data-variant='bg'] [data-slot='key'] {
  background: var(--surface-gray-8);
}
```

<!-- @include: ./KeyboardShortcut.api.md -->
