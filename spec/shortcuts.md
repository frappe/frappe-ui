# Keyboard shortcuts spec

The public API for `useKeyboardShortcut`, `KeyboardShortcutsDialog` and
`KeyboardShortcut`. Vocabulary is in
[`CONTEXT.md`](../CONTEXT.md#keyboard-shortcuts).

The family has one registry. `useKeyboardShortcut` writes to it,
`KeyboardShortcutsDialog` reads it, and nothing else can: the library exports no
registry reader. An app that wants its own help surface uses the dialog's
default slot.

## The combo

A combo is one string:

```
Mod+Ctrl+Alt+Shift+<Key>
```

That order is the canonical spelling: write `Mod+Shift+K`, not `Shift+Mod+K`.
`+` separates the parts. The `KeyboardShortcutCombo` type enforces the order at
a typed call site. The matcher accepts any order, so a combo from a computed
value or a JavaScript call site still fires, and the chip still draws it.

| Modifier | Means                              |
| -------- | ---------------------------------- |
| `Mod`    | Cmd on macOS, Ctrl everywhere else |
| `Ctrl`   | Control on every platform          |
| `Alt`    | Alt, Option on macOS               |
| `Shift`  | Shift                              |

`Mod` exists because almost every shortcut wants the platform's primary
modifier. `Ctrl` exists for the few that mean Control on a Mac too.

Matching is exact. A modifier the combo does not name must not be held, so
`Mod+S` does not fire on ⌘⇧S.

### Key names

A key is named, never written as the character it types:

| Kind          | Names                                                                                                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Letters       | `A`–`Z`                                                                                                                                                    |
| Digits        | `Digit0`–`Digit9`                                                                                                                                          |
| Function keys | `F1`–`F12`                                                                                                                                                 |
| Named keys    | `Escape`, `Enter`, `Tab`, `Space`, `Backspace`, `Delete`, `Insert`, `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Home`, `End`, `PageUp`, `PageDown` |
| Punctuation   | `Plus`, `Minus`, `Equal`, `Slash`, `Backslash`, `Backtick`, `Comma`, `Period`, `Semicolon`, `Quote`, `BracketLeft`, `BracketRight`                         |

Punctuation must be named because the separator is the `+` character. `'Mod++'`
splits into `['Mod', '', '']` and matches nothing. Both halves warn about the
empty parts in development, so it fails loudly rather than silently. There is no
escape syntax and no second separator: one grammar, one spelling per key.

`Plus` is the keypad `+`. The `+` a normal keyboard types with Shift is
`Shift+Equal`, so ⌘+ is `Mod+Shift+Equal`.

`combo` is typed as a template-literal union of every modifier prefix and every
key name. TypeScript rejects an unknown name at compile time. JavaScript call
sites get a one-time dev warning, and the shortcut never fires.

### `event.key` or `event.code`

| Kind                               | Matched against |
| ---------------------------------- | --------------- |
| Letters, function keys, named keys | `event.key`     |
| Digits, punctuation                | `event.code`    |

Digits and punctuation read the physical key, so a shifted character still
resolves: `Mod+Shift+Digit1` fires on ⌘⇧1 and on ⌘⇧! alike. A punctuation name
means the physical key position, as labelled on a US layout, so `Mod+Slash`
fires on the same key everywhere even where that key types another character.
This is the rule editors use, and the rule Frappe Sheets already used before the
library had one.

Letters read the character, so `Mod+S` follows the user's layout rather than the
physical US position of the S key.

**Known limit.** macOS rewrites `event.key` when Option is held (⌥S reports
`ß`), so an `Alt+<letter>` combo can miss on macOS. Use `Alt` with a digit, a
punctuation name or a named key when the shortcut has to work there.

## The config

```ts
interface KeyboardShortcutConfig {
  combo: KeyboardShortcutCombo
  description: string
  group?: string // default 'General'
  handler?: (e: KeyboardEvent) => void
  onHold?: (e: KeyboardEvent) => void
  onRelease?: (e?: KeyboardEvent) => void
  enabled?: MaybeRefOrGetter<boolean> // default true
  preventDefault?: boolean // default true
  allowInInput?: boolean // default false
  allowInDialog?: boolean // default false
}
```

The exported type is a union of two shapes, so the compiler enforces the mode:

- **press mode** takes `handler` and no hold callbacks.
- **hold mode** takes `onHold`, optionally `onRelease`, and **no `handler`**.

`useKeyboardShortcut` returns `void`. Registrations are removed on unmount, and
while the component is deactivated inside a `<KeepAlive>` tree.

### Hold mode

`onHold` runs once when the combo goes down, and does not repeat while the key
auto-repeats. `onRelease` runs when the key goes up, or when a modifier the
combo needs goes up. Releasing a modifier the combo does not name changes
nothing.

`onRelease` also runs when the component unmounts, or is deactivated inside a
`<KeepAlive>`, while the combo is still down. Without it, whatever `onHold`
switched on would stay on with no shortcut left to switch it off. A teardown has
no event to pass, so `onRelease` gets none: its parameter is optional, and a
callback that reads the event has to handle `undefined`. It runs once per held
registration, and never for one that was not held. An `onRelease` that throws is
logged and does not stop the removal.

**Known limit.** Apart from teardown, `onRelease` fires on `keyup` only. A
window that loses focus gets no `keyup`, so a combo held through a ⌘-Tab or an
Alt-Tab stays held until the user presses and releases it again.

Three call sites drive this shape: builder's highlight-blocks overlay and its
Space pan mode, and suite's Space push-to-talk in meet.

### `enabled` does two jobs

While `enabled` is `false` the shortcut is **inert and hidden from the dialog**.
A shortcut the user cannot press is not advertised.

```ts
useKeyboardShortcut({
  combo: 'Mod+Z',
  description: 'Undo',
  group: 'Editing',
  enabled: notReadOnly,
  handler: undo,
})
```

Suite's read-only mode depends on both halves. It reads a `MaybeRefOrGetter`, so
a ref, a getter or a plain boolean all work.

The two halves read it at different moments. A keypress resolves it every time.
The dialog resolves it when it opens, and again on every register or
unregister. A getter that reads state Vue cannot track, such as
`document.activeElement`, is therefore correct on each open, not live while the
dialog stays open.

## Precedence

**The last registration that is enabled at the time of the keypress wins.** One
match fires; the rest do not.

`enabled` is resolved first, so two registrations on one combo with mutually
exclusive guards both keep working. Suite's slides app pairs seven combos this
way: `ArrowUp` moves an element in edit mode, and changes the slide when edit
mode is off.

A collision is two or more shortcuts that are live on the same keypress. It
warns once per combo per page load, in development only:

```
[frappe-ui] Duplicate shortcut Mod+Shift+D. 3 shortcuts are live on this keypress:
  "Delete Page" (active)
  "Rename Page" (shadowed)
  "Toggle canvas dark mode" (shadowed)
```

The warning names every live registration, so none is missed. The active one
comes first. The rest follow in reverse registration order, so the earliest
registration is last.

The warning fires on the keypress, not at registration, because guard state is
only known then.

## Guards

| Option           | Default | Effect                                                             |
| ---------------- | ------- | ------------------------------------------------------------------ |
| `allowInInput`   | `false` | Fire while an `<input>`, `<textarea>` or contenteditable has focus |
| `allowInDialog`  | `false` | Fire while focus is inside a `[role="dialog"]` element             |
| `preventDefault` | `true`  | Call `preventDefault()` on the matched event                       |

A dialog owns its own focus trap, so page-level shortcuts stay quiet inside one.
A help shortcut that has to answer from within a dialog opts in.

## The dialog

`KeyboardShortcutsDialog` lists every enabled shortcut, grouped by `group` and
searchable once the count passes `searchThreshold` (default 20).

**The search reads the row, not only the combo behind it.** A row for
`Mod+Slash` draws `Ctrl /`, so both `/` and `slash` find it. The query clears
when the dialog closes.

**Shortcuts that share a group and a description merge into one row.** The first
registration supplies the row's combo; the rest become `altCombos` and render
after a `/`. Suite registers `Mod+Shift+Z` and `Mod+Y`, both described "Redo",
and gets one row.

The default slot receives `{ groups }`, where a group is `{ name, shortcuts }`
and a shortcut is `{ combo, altCombos, description, group }`. Passing the slot
replaces the whole grid, and the title row and search stay.

## Styling hooks

Per P10, every part carries a `data-slot`.

`KeyboardShortcutsDialog`: `header`, `title`, `search`, `empty`, `groups`,
`group`, `group-title`, `shortcut`, `description`, `shortcut-keys`. The empty
element also carries `data-state="empty"` or `data-state="no-results"`.

`KeyboardShortcut`: `keyboard-shortcut` on the root, with `data-bg="true"` when
`bg` is set; `key` on each key, with `data-key-type`; `separator` on the `+`
glyphs; `alt-combos` on the alternatives, inside the root.

### `bg` is not the `variant` axis

`bg` picks a template branch. In `bg` mode each key is a `<kbd>` chip with its
own geometry and type scale: `h-6`, `min-w-[1.5rem]`, `px-1.5`, `rounded-4`,
`bg-surface-gray-2` and `text-xs-medium`. Plain mode sets only
`text-ink-gray-5 text-sm` on the root and draws each key as a bare `<span>`,
with a `+` between them.

The house `variant` axis, `solid | subtle | outline | ghost` on `Badge`,
changes how one shape is filled. `bg` changes the shape: height, minimum
width, padding, radius, element and type scale. `variant="subtle"` against
`variant="ghost"` would promise a swap of skin that this component does not
make.

The choice is deliberate. `bg` and `data-bg` stay as they are at 1.0.0.

## How a screen reader meets a chip

A chip is a picture of a key, so `KeyboardShortcut` labels its root
`role="img"` and spells the whole sequence there: "Shortcut Control +
Backspace, or Delete". A labelled `img` replaces its subtree, so a reader in
browse mode meets each key once, not once per chip. Without a `combo` the root
carries no label and no role, and the fallback slot reads normally.

`useIcons` covers the arrow, Enter, Backspace and Delete keys, in both `bg` and
plain mode. ⌘ stays an icon in both modes. Plain mode draws Shift and Alt as
icons, `bg` mode draws them as text.

## Where the combo is checked

Both the composable and the display read one grammar. They check it at different
times, on purpose.

| Surface               | `combo` type            | Check                                   |
| --------------------- | ----------------------- | --------------------------------------- |
| `useKeyboardShortcut` | `KeyboardShortcutCombo` | Compile time, plus a dev warning in JS  |
| `KeyboardShortcut`    | `string`                | Runtime: renders as written, warns once |

The config is strictly typed because a bad combo there fires nothing and says
nothing. The display prop takes `string` because callers compute it: crm binds
`:combo="_combo"` from a computed value. A union there would force a cast at
every call site of a component that only draws keys.

The display accepts no second vocabulary. `cmd`, `meta`, `option`, `esc` and
`del` are gone, because a chip for a combo that can never fire is the silent
failure this family exists to remove. Apps that want the compile-time check
import `KeyboardShortcutCombo` and type their own value.

## What the family does not export

`formatShortcutLabel` and `getActiveShortcuts` are removed, with zero consumers
across ten apps. `KeyboardShortcut` renders a combo, and the dialog's slot reads
the registry, so neither had a job left.
