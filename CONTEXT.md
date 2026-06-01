# frappe-ui

A Vue 3 component library for Frappe-based apps. This document captures the vocabulary used inside the library so that component APIs, docs, and stories stay aligned with the language used in the v1 plan and spec docs.

The cross-cutting **design rules** that govern API shape live in [`PHILOSOPHY.md`](./PHILOSOPHY.md) (cite as `P1`–`P13`). This doc is the vocabulary the rules use.

Current API contracts live in [`spec/`](./spec/). Release execution, migration notes, changelog, and temporary research live in [`v1-release/`](./v1-release/). The user-facing documentation in `docs/` is the published vitepress site and intentionally does not host specs or ADRs.

## Language

### Composition

**atom**:
A primitive component that does not compose other public components — e.g. `TextInput`, `Combobox`, `Switch`, `Select`. Atoms are the smallest reusable units of the library and live in `src/components/`.

**molecule**:
A component that composes one or more atoms to form a higher-level control — e.g. `Link` (composes `Combobox`). Molecules expose their own public API and follow the same library-wide design rules as atoms (P5 labeling, P10 styling, etc.). Molecules may live in `src/components/` *or* in domain-specific directories (e.g. `frappe/` for Frappe-integrated controls) — location is a deployment concern, not a definitional one.

### Component lifecycle & control

**open**:
The visibility state of an overlay component (Dialog, Popover, Dropdown, Tooltip). Always bound via `v-model:open`. Boolean.
_Avoid_: visible, show, isOpen (as a public API; internal refs are fine)

**modelValue**:
Reserved for the **primary value** a component represents (selected option, text content, etc.). For overlay components, `modelValue` is *not* the visibility — visibility is `open`.
_Avoid_: using `v-model` (bare) for visibility on overlay components

**dismissable**:
Whether the overlay closes via user-initiated dismiss channels — outside click and Escape. Default `true`. When `false`, the overlay can only be closed programmatically or via an explicit close control (e.g. a close button or an action). The name is chosen with cross-overlay reuse in mind (Popover, Dropdown), but in v1 it ships **only on Dialog**. Replaces `disableOutsideClickToClose`, which remains a deprecated alias on Dialog with a one-time warning.
_Avoid_: `disableOutsideClickToClose`, `closeOnOutsideClick` (in new code)

### Dialog

**bare**:
A Dialog prop (default `false`) that suppresses the dialog's default chrome — the padded card, auto-rendered header, and auto-rendered actions footer. With `bare: true`, the `#default` slot fills the entire modal shell. Used for command palettes, full-screen settings, and other layouts that don't fit "header + padded content + footer".
_Avoid_: `flush`, `chromeless`, `unstyled` (in new code)

**chrome** (informal):
The auto-rendered visual scaffolding around a Dialog's content — padded card background, header row (icon + title + close button), and actions footer container. Not exposed as an API term; this is the thing `bare` removes.

**Dialog**:
The single modal overlay component. Traps focus, blocks interaction with the page, and is always portalled. ARIA semantics are derived from props:
- `role="dialog"` always (we do not differentiate `alertdialog`; the role distinction is rarely surfaced by screen readers in practice and the simplification avoids fragile heuristics)
- `aria-labelledby` ← `title` (or the custom `#body-title` slot's container, when used)
- `aria-describedby` ← `message`

A non-dismissable Dialog is still `role="dialog"` — "must respond" is expressed by `dismissable: false` and explicit actions, not by a different role.

**Imperative dialog API**:
A `dialog` namespace exporting callback-based helpers: `dialog.confirm()`, `dialog.danger()`, `dialog.prompt()`. Each helper mounts a `<Dialog>` for one-shot confirms/prompts outside normal component templates. Replaces the legacy `confirmDialog()` helper.

Mounting is handled by `<FrappeUIProvider>`, which renders a hidden `<Dialogs />` next to `<Toasts />` so imperative dialogs inherit `provide/inject` (router, Pinia, theme, etc.) from the host app. The `<Dialogs />` component remains exported for callers who don't use the provider and want to mount it manually.

**Lifecycle contract**: `onConfirm` resolving auto-closes the dialog; throwing keeps it open and renders the thrown message inline. Each helper returns a synchronous handle with `close()` for programmatic dismissal. See [`spec/dialog.md`](./spec/dialog.md) and [`spec/adr/0003-imperative-dialog-onconfirm.md`](./spec/adr/0003-imperative-dialog-onconfirm.md).

**PromptField** (the schema for `dialog.prompt`'s `fields` array):
```ts
type PromptField = {
  name: string                                              // result key
  label?: string
  type?: 'text' | 'textarea' | 'select' | 'checkbox'        // default 'text'
  defaultValue?: string | boolean
  placeholder?: string
  required?: boolean                                        // only validation supported in v1
  options?: Array<{ label: string; value: string }>         // for 'select'
  description?: string                                      // helper text under label
}
```
Custom `validate` callbacks are intentionally not in v1 — callers needing custom validation should compose a real form inside `<Dialog>`. `dialog.prompt` resolves to `null` on cancel/dismiss.

**theme** (Dialog & imperative API): The color tone of the icon and the primary action button. Values match `Alert.theme`: `'yellow' | 'blue' | 'red' | 'green'`. The imperative helpers also use `theme` to pick a sensible default icon (overridable via `icon`).

Cross-library vocabulary (the only two axes used to color components):
- **variant** = visual style (`solid | outline | subtle | ghost`) — Button, Badge, Alert
- **theme** = color tone (color names) — Button, Badge, Alert, Dialog

There is intentionally no semantic axis (no `intent`/`severity`/`appearance` taxonomy) — when `Dialog.icon.appearance` (`warning|info|danger|success`) is migrated, it maps to `theme` color names (`yellow|blue|red|green`).

**options** (Dialog-only, legacy):
A blob prop that bundled title/size/icon/actions/message/position into one object. Retained for back-compat in v1, but the canonical surface is now flat top-level props. Setting `options` triggers a one-time deprecation warning.
_Avoid_: as the recommended public API for new code

**action**:
A button rendered in the Dialog's footer area, declared via the `actions` prop. Each action gets reactive `loading` state while its async `onClick` runs and receives a `{ close }` context.

### Frappe-integrated controls

Molecules that bridge frappe-ui to the Frappe Desk backend. They depend on backend endpoints (search, resource fetching, etc.) and cannot be used standalone in a non-Frappe app. They follow the same library-wide design rules as atoms — notably the P5 labeling contract. Specced in [`v1-release/10-frappe-controls-spec.md`](./v1-release/10-frappe-controls-spec.md).

**Link**:
A P5 input control that picks a single record from a Frappe doctype. Bound via unnamed `v-model` to the record's primary key (string) or `null` when empty. Built on `Combobox`, scoped to one doctype via the `doctype` prop and narrowed via `filters`. Renders a default clear affordance when the value is set and the field is not required. Opt into a "Create new" action row via the `creatable` boolean prop, which emits `@create` with the typed query. Accepts the full P5 labeling contract (`label`, `description`, `error`, `required`).
_Avoid_: using `Link` for non-doctype option lists — reach for `Combobox` directly. `allowCreate`, `allowClear`, `allowRedirect` are removed in v1 (no deprecation path — these were not present in a published release).

### Editor family

**`frappe-ui/editor`** (subpath):
The single subpath where the entire editor family lives — the `useEditor` engine, the `TextEditor` component, building-block components, kits, extensions, menu items, and presets. The only subsystem in frappe-ui that exports from a subpath rather than top-level; reserved for families big enough to warrant their own mental location. There are no editor exports from top-level `frappe-ui`.

Surface from this subpath:
- **Engine**: `useEditor` — owns the TipTap `Editor` lifecycle, binds content via `v-model`, threads upload, detects collaboration. Requires an explicit `extensions` list (no default).
- **Component**: `TextEditor` — the one component everything is built on; capability via the explicit `extensions` array, chrome via `toolbar`/`bubbleMenu`/`floatingMenu` props, layout via slots.
- **Building blocks**: `EditorContent`, `EditorFixedMenu`, `EditorBubbleMenu`, `EditorFloatingMenu` — the parts `TextEditor` renders internally, each taking an explicit `:editor` prop; exported for composition that doesn't go through the component.
- **Kits**: `StarterKit`, `CommentKit`, `RichTextKit`, `InlineKit` — `StarterKit`-style configurable extension bundles. The unit of capability defaults and the tree-shaking boundary.
- **Extensions**: tiptap-original (with our default config) and frappe-custom, all as flat named exports — `Image`, `Mention`, `SlashCommands`, `Tag`, `Table`, `Link`, `Placeholder`, etc. Consumers `.configure(...)` and pass through `extensions`.
- **Menu items + presets**: typed `MenuItem` objects (`Bold`, `H2`, `Separator`, …) and `MenuItem[]` presets (`commentToolbar`, `articleToolbar`, `minimalToolbar`).

The `useEditor` name shadows TipTap's own `useEditor` from `@tiptap/vue-3`. Consumers who import both alias one side: `import { useEditor as useTipTapEditor } from '@tiptap/vue-3'`. The collision is rare in practice (only consumers building deeply custom editors hit it) and the cleaner name wins for the common case.

_Avoid_: importing the editor surface from `frappe-ui` (top-level) — it doesn't exist there; shipping ready-made assembled editors (`CommentEditor`/`RichTextEditor`) from the library — apps build their own on `TextEditor`.

**TextEditor**:
The single editor component, built on `useEditor`. Capability is the explicit `extensions` array (required — pass at least a kit); chrome is the `fixedMenu`/`bubbleMenu`/`floatingMenu` props (default off, explicit so the component stays tree-shakeable). The three surface props match the building-block component names and v0's `fixed-menu`/`bubble-menu`/`floating-menu`. Customized progressively on the *same* component — props → named slots (`#actions`, `#fixedMenu`) → `#default` layout slot → drop to `useEditor` + building blocks — with no second component family. Replaces the v0 `TextEditor` monolith (same name, new contract; a pre-v1 break, P13).
_Avoid_: a fat default `extensions` list or a defaulted fixed menu (breaks tree-shaking); proxy props for data-driven extensions (`mentions`/`tags`) — configure the kit member instead.

**kit** (Editor family):
A `StarterKit`-style extension that bundles others; every member is configured or removed via canonical `.configure()` (`RichTextKit.configure({ mention: { items }, table: false })`). Data-driven members (`mention`, `tag`, `slashCommands`) are inert until given `items`. Kits supply "good defaults" as an opt-in import and are the tree-shaking boundary. `StarterKit` (base), `CommentKit`, `RichTextKit`, `InlineKit`.
_Avoid_: a `mentions`/`tags` component prop standing in for `kit.configure({ mention })`; relying on a kit member you didn't configure with data.

**app editor component** (informal):
The thin component an app builds on `TextEditor`, encoding that app's mention source, local extensions, toolbar preset, and action buttons — reused across the app's call sites. frappe-ui ships none of these; the reuse unit for an *assembled* editor is per-app, because assembled editors are app-specific (gameplan's comment editor ≠ helpdesk's). This replaces the v0 "ready-made" concept: convenience lives in the app, not the library.

**format** (Editor family):
The content format axis of an editor: `'html' | 'json'`. Default `'html'`. Set as a prop on `TextEditor` (`<TextEditor v-model="x" format="json" />`) and as an option on `useEditor` (`useEditor({ content, format })`). Editors expose content via the unnamed `v-model` (P2-canonical — text content is the primary value); the consumer's chosen `format` decides whether v-model emits HTML strings or `JSONContent` objects. There is no separate `v-model:html` or `v-model:json` — one v-model carries whichever format is configured.
_Avoid_: type-sniffing the modelValue at runtime; declaring format via a boolean (`:json="true"`); separate v-models per format.

**actions** (TextEditor slot):
A named slot on `TextEditor`, rendered inline with the toolbar row inside the editor's border. Receives `{ editor, isEmpty }` so the consumer can wire Submit/Discard buttons to the editor instance without a template ref. For layout beyond buttons-in-the-toolbar-row (CC/BCC headers, attachment rows, side panels), take the `#default` layout slot instead. Mirrors Dialog's `actions` vocabulary (P6-aligned).
_Avoid_: using `actions` for content other than buttons — use the `#default` slot for custom layout.

## Relationships

- A **Dialog** has zero or more **actions**, each rendered as a Button in the footer.
- **Dialog**, **Popover**, **Dropdown**, and **Tooltip** all share the **open** vocabulary (`v-model:open`).
- **TextEditor** is built on **useEditor** and the editor building blocks; apps build their own editor components on top of **TextEditor**.

## Flagged ambiguities

- **`v-model` vs `v-model:open` on Dialog**: both are supported indefinitely. `v-model:open` is canonical and aligns with Popover/Dropdown; `v-model` (bound to `modelValue`) remains supported with no deprecation warning. If both are bound, `open` wins. See [`spec/dialog.md`](./spec/dialog.md).
