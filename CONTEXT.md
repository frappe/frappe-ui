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
control. Named for cross-overlay reuse but ships **only on Dialog** in v1. Replaces
`disableOutsideClickToClose` (deprecated alias, warns).
_Avoid_: `disableOutsideClickToClose`, `closeOnOutsideClick` (in new code)

## Color axes

The only two axes used to color components — there is intentionally **no** semantic axis
(`intent`/`severity`/`appearance`/`kind`/`status`):

- **variant** — visual style: `solid | outline | subtle | ghost` (Button, Badge, Alert)
- **theme** — color tone, by color name: `yellow | blue | red | green | …` (Button, Badge, Alert, Dialog)

A legacy `appearance` (`warning | info | danger | success`) maps to `theme` color names.

## Shared component vocabulary

**action**:
A button declared via a component's `actions` prop, rendered in its footer/toolbar row.
Gets reactive `loading` state while its async `onClick` runs and a `{ close }` context.
Shared by Dialog and TextEditor (P6-aligned).

**bare** (Dialog):
Prop (default `false`) that suppresses the dialog's default chrome so the `#default`
slot fills the entire modal shell. For command palettes, full-screen settings, etc.
_Avoid_: `flush`, `chromeless`, `unstyled` (in new code)

**chrome** (informal):
The auto-rendered visual scaffolding around a component's content — padded card, header
row, actions footer. Not an API term; it's the thing Dialog's `bare` removes.

**options** (Dialog, legacy):
A deprecated blob prop that bundled title/size/icon/actions into one object; the
canonical surface is flat top-level props. Setting it warns once.
_Avoid_: as the recommended public API for new code

> Dialog's full API — props, slots, ARIA, the imperative `dialog.confirm/danger/prompt`
> namespace, and `PromptField` — is specified in [`spec/dialog.md`](./spec/dialog.md).

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
