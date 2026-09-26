# KeyboardShortcut

Shows a key combination, such as `Mod+K`, as keys. It only shows the
shortcut: to make the shortcut work, use
[`useKeyboardShortcut`](../other/composables#usekeyboardshortcut).

<ComponentPlayground name="KeyboardShortcut" />

## Examples

### Search button

The shortcut that opens search, at the end of a search button.

<ComponentPreview name="KeyboardShortcut-SearchTrigger" />

### Command palette hints

Hints at the bottom of a command palette. `bg` draws each key as a chip, and
`alt-combos` lists another combo that does the same thing.

<ComponentPreview name="KeyboardShortcut-PaletteFooter" />

### Task menu

Each menu row ends with its shortcut. On the delete row, `alt-combos` adds
`Delete` as an alternative to `Mod+Backspace`.

<ComponentPreview name="KeyboardShortcut-DeleteRow" />

## Behavior

### Key names

`Mod` shows `⌘` on macOS and `Ctrl` elsewhere.

`combo` reads the same key names as `useKeyboardShortcut`, so a combo written
for that composable renders here unchanged: `Digit1` shows `1`, `Slash` shows
`/`, `Backtick` shows `` ` ``.

It reads **only** those names. `combo` is typed `string`, because callers
usually compute it, so the check happens at runtime: an unknown key name
renders as written and warns once in development. Write `Mod+K`, not `cmd+k`.
Import the `KeyboardShortcutCombo` type to get the check at compile time where
the value is known.

### Icons

`useIcons` controls the icons on the arrow, Enter, Backspace and Delete keys, in
both `bg` and plain mode. ⌘ is always an icon. Plain mode draws Shift and Alt
as icons, and `bg` mode draws them as text.

In plain mode, a `+` appears only between two keys drawn as text, as in
"Ctrl+K". A key drawn as an icon needs none, so `Mod+K` shows "⌘K" on macOS.
`bg` mode draws no `+`.

### Alternative combos

`altCombos` lists other combos after a `/`. A combo that shows the same keys as
the main combo, or as an earlier alternative, is left out.

### Without a combo

With no `combo`, the component renders its default slot.

## Accessibility

Each key is a picture of a key, so the root is a labelled `role="img"` that
spells the whole sequence, for example "Shortcut Control + Backspace, or
Delete". That role replaces everything inside it, so a screen reader reads
each key once instead of once per chip. With no `combo`, the root has no role,
and the default slot reads normally.

<!-- @include: ./KeyboardShortcut.api.md -->
