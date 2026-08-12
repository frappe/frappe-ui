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

It reads **only** those names. `combo` stays typed `string`, because callers
usually compute it, so the check happens at runtime: an unknown token renders as
written and warns once in development. Write `Mod+K`, not `cmd+k`. Import
`KeyboardShortcutCombo` to get the compile-time check where the value is known.

## Styling hooks

The root carries `data-slot="keyboard-shortcut"`, and `data-bg="true"` when `bg`
is set. Each key carries `data-slot="key"` with a `data-key-type` of `cmd`,
`ctrl`, `shift`, `alt` or `key`. The `+` separators carry
`data-slot="separator"`, and alternative combos sit in `data-slot="alt-combos"`
inside the root. Style through those instead of a class prop (P10):

```css
[data-slot='keyboard-shortcut'][data-bg] [data-slot='key'] {
  background: var(--surface-gray-8);
}
```

<!-- @include: ./KeyboardShortcut.api.md -->
