# frappe-ui

A Vue 3 component library for Frappe-based apps. This document captures the vocabulary used inside the library so that component APIs, docs, and stories stay aligned with the language used in the v1 plan and spec docs.

The cross-cutting **design rules** that govern API shape live in [`PHILOSOPHY.md`](./PHILOSOPHY.md) (cite as `P1`–`P13`). This doc is the vocabulary the rules use.

Planning artifacts live under [`v1-release/`](./v1-release/) — specs in `v1-release/*.md` and architecture decision records in [`v1-release/adr/`](./v1-release/adr/). The user-facing documentation in `docs/` is the published vitepress site and intentionally does not host ADRs or specs.

## Language

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
A `dialog` namespace exporting Promise-based helpers: `dialog.confirm()`, `dialog.alert()`, `dialog.prompt()`. Each helper mounts a `<Dialog>` with `dismissable: false` and resolves on the user's chosen action. Replaces the legacy `confirmDialog()` helper.

Mounting is handled by `<FrappeUIProvider>`, which renders a hidden `<Dialogs />` next to `<Toasts />` so imperative dialogs inherit `provide/inject` (router, Pinia, theme, etc.) from the host app. The `<Dialogs />` component remains exported for callers who don't use the provider and want to mount it manually.

- `dialog.confirm({...})` → `Promise<{ ok: boolean, close: () => void }>`
- `dialog.alert({...})` → `Promise<{ close: () => void }>`
- `dialog.prompt({...})` → `Promise<{ values: Record<string, any> | null, close: () => void }>` *(values is null on cancel)*

**Lifecycle contract**: imperative helpers do **not** auto-close on confirm. The promise resolves the moment the user picks an action; the caller calls `close()` when ready (typically after async work). The confirm/submit button auto-shows a loading state from click until `close()` is called. On cancel, the dialog auto-closes and the promise resolves with `ok: false` / `values: null`.

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

## Relationships

- A **Dialog** has zero or more **actions**, each rendered as a Button in the footer.
- **Dialog**, **Popover**, **Dropdown**, and **Tooltip** all share the **open** vocabulary (`v-model:open`).

## Flagged ambiguities

- **`v-model` vs `v-model:open` on Dialog**: both are supported indefinitely. `v-model:open` is canonical and aligns with Popover/Dropdown; `v-model` (bound to `modelValue`) remains supported with no deprecation warning. If both are bound, `open` wins. See [`v1-release/08f-dialog-spec.md`](./v1-release/08f-dialog-spec.md).
