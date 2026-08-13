# frappe-ui

A Vue 3 component library for Frappe-based apps. This document is the **vocabulary**
the library's APIs, docs, and stories share — the canonical meaning of cross-cutting
terms (`open`, `variant`, `theme`, `dismissible`, `atom`, …) and the names to avoid.

The design **rules** that use this vocabulary live in [`PHILOSOPHY.md`](./PHILOSOPHY.md)
(`P1`–`P14`). Per-component **API contracts** live in [`spec/`](./spec/) — this doc
defines terms, not APIs. Release execution and history live in
[`v1-release/`](./v1-release/). The published docs in `docs/` are the vitepress site
and host neither specs nor ADRs.

## Composition

**atom**:
A primitive component that does not compose other public components — e.g. `TextInput`,
`Combobox`, `Switch`, `Select`. The smallest reusable units; live in `src/components/`.

**molecule**:
A component that composes atoms into a higher-level control — e.g. `Link` (composes
`Combobox`). Follows the same design rules as atoms (P5 labeling, P10 styling, …). May
live in `src/components/` or a domain dir (e.g. `frappe/` for Frappe-integrated controls).

## Lifecycle & control

**open**:
The visibility state of an overlay (Dialog, Popover, Dropdown, Tooltip), always bound
via `v-model:open`. Boolean. All four overlays share this vocabulary.
_Avoid_: visible, show, isOpen (as a public API; internal refs are fine)

**modelValue**:
The **primary value** a component represents (selected option, text content, …). For
overlays, `modelValue` is *not* the visibility — that's `open`.
_Avoid_: using bare `v-model` for visibility on overlays

**dismissible**:
Whether an overlay closes via user-initiated dismiss channels — outside click and
Escape. Default `true`; when `false`, it closes only programmatically or via an explicit
control. Ships on `Dialog`, `Popover` and `BottomSheet`. On `Alert` (not an overlay)
it instead shows the × button (default `false`), which emits `dismiss` — the parent
owns hiding. Replaces `disableOutsideClickToClose`, which is removed (ADR-0008).
_Avoid_: `disableOutsideClickToClose`, `closeOnOutsideClick`

## Color axes

The only two axes used to color components — there is intentionally **no** semantic axis
(`intent`/`severity`/`appearance`/`kind`/`status`):

- **variant** — visual style: `solid | outline | subtle | ghost` (Button, Badge)
- **theme** — color tone, by color name: `gray | blue | green | amber | red | …` (Button, Badge, Alert, Dialog; the Alert/SidebarCard palette is `gray | blue | green | amber | red`)

The warning tone is **`amber`** everywhere. No exported component accepts
`theme="yellow"` — Dialog was the last one and moved to `amber` (#1054).
_Avoid_: `yellow`

Badge themes are `gray | blue | green | amber | red | violet`.
_Avoid_ (Badge): `orange` — an alias for `amber`, removed in `1.0.0` (ADR-0008)

A legacy `appearance` (`warning | info | danger | success`) maps to `theme` color names.

**theme** means color tone and nothing else. It is the library's most-used
vocabulary word — roughly 300 `theme="…"` sites across the apps — so the
light/dark axis gets its own word rather than competing for this one.

**colorScheme**:
The light/dark axis: `light | dark | system`. Owned by the `useColorScheme`
composable, which is the only writer — `colorScheme` itself is read-only,
because the ref, the `<html data-theme>` attribute and the stored preference
have to move together and `setColorScheme` is what moves all three.
_Avoid_: `theme`, `currentTheme`, `darkMode`, `mode` (for light/dark)

> The `data-theme` DOM attribute and the `theme` `localStorage` key keep the
> older word. Apps ship `[data-theme='dark']` rules in their own CSS and users
> have a saved value under that key; both are outside our API, and renaming
> either would break running apps with no compile error.

## Shared component vocabulary

**action**:
A button declared via a component's action prop(s), rendered in its footer/toolbar row.
Typed by an internal generic `Action<Ctx>` (`ButtonProps` plus `onClick(context)`);
the public names are `DialogAction` (context `{ close }`) and `AlertAction`
(context `{ dismiss }`, shared with SidebarCard). Gets reactive
`loading` state while its async `onClick` runs.
Shared by Dialog, Alert, SidebarCard and TextEditor (P6-aligned).
Charts take no action prop — a chart header renders caller-supplied
buttons through the `#actions` slot (spec/charts.md).

**content-driven layout** (Alert):
Alert has no `layout` prop. It renders as a single-line `row`; a `description` (prop
or slot) or a `secondaryAction` switches it to the stacked `banner` layout. The
computed result is stamped as `data-layout`. Visibility is the parent's `v-if` —
Alert is stateless and only emits `dismiss`. Alert themes are
`gray | blue | green | amber | red`.
_Avoid_ (Alert): `intent`, `visible`, `yellow`

**bare** (Dialog):
Prop (default `false`) that suppresses the dialog's default chrome so the `#default`
slot fills the entire modal shell. For command palettes, full-screen settings, etc.
_Avoid_: `flush`, `chromeless`, `unstyled` (in new code)

**fluid** (TabButtons):
Prop (default `false`) that makes the items share the container width equally
instead of sizing to their labels. Use this name for any "stretch to fill the
parent" prop.
_Avoid_: `fullWidth`, `block`, `stretch`, `grow`

**side** (Tabs family):
Prop naming the edge a component attaches to (`left | right`). Distinct from
`dir`, which is the `ltr`/`rtl` writing direction.
_Avoid_: `direction`, `placement` (for a single edge), `align`

**chrome** (informal):
The auto-rendered visual scaffolding around a component's content — padded card, header
row, actions footer. Not an API term; it's the thing Dialog's `bare` removes.

> Dialog's full API — props, slots, ARIA, the imperative `dialog.confirm/danger/prompt`
> namespace, and `PromptField` — is specified in [`spec/dialog.md`](./spec/dialog.md).

### Keyboard shortcuts

Vocabulary for `useKeyboardShortcut`, `KeyboardShortcutsDialog` and
`KeyboardShortcut`; the API is specified in [`spec/shortcuts.md`](./spec/shortcuts.md).

**combo**:
The whole key combination as one string, written `Mod+Ctrl+Alt+Shift+<Key>`
with the modifiers in that order. The single word for "which keys" across the
composable, the dialog and the `KeyboardShortcut` component. The composable
types it as a template-literal union, so the compiler checks it.
`KeyboardShortcut`'s prop stays `string`, because callers compute it, and warns
at runtime instead.
_Avoid_: `shortcut`, `keys`, `binding`, `accelerator`, and separate `key` +
`ctrl` + `shift` + `alt` fields

**Mod**:
The platform's primary modifier: Cmd on macOS, Ctrl elsewhere. `Ctrl` in a
combo means Control on every platform, including macOS.
_Avoid_: `Cmd`, `Meta`, `Command`, `CtrlOrCmd` (in a combo)

**key** (in a combo):
One named key, never the character it types: `A`, `Digit1`, `Slash`, `Escape`,
`ArrowUp`. Punctuation has to be named because `+` is the separator.
_Avoid_: raw characters (`/`, `?`, `+`), `Key1`, `Num1`

_Avoid_ (family-wide): `shortcut` as a prop or option name, `condition` (it is
`enabled`), `triggeredOn` (the callbacks pick the mode), `KeyboardShortcutsModal`,
`formatShortcutLabel`, `getActiveShortcuts`

## Editor family

Vocabulary for the editor; the API is specified in [`spec/editor.md`](./spec/editor.md).

**`frappe-ui/editor`** (subpath):
The single subpath where the entire editor family lives — the `useEditor` engine,
`Editor`, building-block components, kits, extensions, menu items, and presets. The
only subsystem that exports from a subpath rather than top-level; there are no editor
exports from top-level `frappe-ui`.
_Avoid_: importing the editor surface from `frappe-ui` (top-level); shipping ready-made
assembled editors (`CommentEditor`/`RichTextEditor`) from the library.

**Editor**:
The single v1 editor component (a molecule), built on the `useEditor` engine and
**renderless** — it owns the editor lifecycle, `v-model`, upload and placeholder
threading, and exposes `{ editor, isEmpty }` through its `#default` slot, where the
consumer composes the layout (content area, menus, actions) from the building blocks. It
renders no UI of its own. Capability is the required `extensions` array (pass at least a
kit). Customization is a two-rung ladder — slot markup, then drop to `useEditor` +
building blocks (L4) when the instance must live outside the component. Supersedes the v0
editor monolith. Spec: [`spec/editor.md`](./spec/editor.md).
_Avoid_: a fat default `extensions` list or a defaulted menu (breaks tree-shaking); proxy
props for data-driven extensions (`mentions`/`tags`) — configure the kit member instead.

**kit** (Editor family):
A `StarterKit`-style extension that bundles others, each member configured or removed via
`.configure()`. Data-driven members (`mention`, `tag`, `slashCommands`) are inert until
given `items`. The unit of capability defaults and the tree-shaking boundary.
`StarterKit`, `CommentKit`, `RichTextKit`, `InlineKit`.

**format** (Editor family):
The content-format axis of an editor: `'html' | 'json'` (default `'html'`), set on
`Editor` or `useEditor`. Content flows through the unnamed `v-model` (P2); `format`
decides whether it emits HTML strings or `JSONContent` objects — there is no separate
`v-model:html`/`v-model:json`.
_Avoid_: type-sniffing modelValue at runtime; a boolean (`:json="true"`); separate
v-models per format.

**app editor component** (informal):
The thin component an app builds on `Editor`, encoding that app's mention source,
local extensions, toolbar preset, and action buttons. frappe-ui ships none — assembled
editors are app-specific (gameplan's comment editor ≠ helpdesk's).

## Flagged ambiguities

- **`v-model` vs `v-model:open` on Dialog**: both are supported indefinitely.
  `v-model:open` is canonical and aligns with Popover/Dropdown; bare `v-model` (bound to
  `modelValue`) remains supported with no deprecation warning. If both are bound, `open`
  wins. See [`spec/dialog.md`](./spec/dialog.md).
