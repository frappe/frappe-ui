# Dialog Spec

Status: accepted direction for `frappe-ui` v1.

This document defines the exact public API for `Dialog` and the imperative `dialog` namespace (`dialog.confirm`, `dialog.alert`, `dialog.prompt`). It is part of the overlay/floating stabilization workstream listed in [`plan.md`](./plan.md).

Two architectural calls in this spec are recorded as ADRs:

- [`adr/0001-single-dialog-component.md`](./adr/0001-single-dialog-component.md) — why we ship one `<Dialog>` and not `<Dialog>` + `<AlertDialog>`.
- [`adr/0002-imperative-dialog-caller-closes.md`](./adr/0002-imperative-dialog-caller-closes.md) — why the imperative API resolves on click and lets the caller call `close()`.

## Role

`Dialog` is the single modal overlay component in `frappe-ui`. Used for forms, confirms, alerts, command palettes, multi-step flows, full-screen settings — anything that traps focus and blocks the page until dismissed.

Apps reach for the imperative `dialog.*` helpers when they need a one-off confirm/alert/prompt from non-component code (stores, utilities, route guards).

## Decisions at a glance

| Decision | Direction |
|---|---|
| Component count | One `<Dialog>` only — no `<AlertDialog>` |
| ARIA role | `role="dialog"` always |
| Visibility model | `v-model:open` (canonical) **and** `v-model` (also supported) |
| Prop surface | Flat top-level props; `options` blob retained as deprecated alias |
| Dismiss control | `dismissable: boolean` (default `true`); replaces `disableOutsideClickToClose` |
| Chrome control | `bare: boolean` (default `false`); replaces the legacy `#body` slot |
| Close button | `showCloseButton: boolean` (default `true`); independent of header |
| Size scale | All 11 sizes kept (`xs` → `7xl`); maps to Tailwind `max-w-*` |
| Color vocabulary | `theme` with color names (`'yellow' \| 'blue' \| 'red' \| 'green'`), matching `Alert.theme`. No semantic axis. |
| Slots | Canonical: `#default`, `#title`, `#actions`. Legacy slots deprecated with internal forwarding. |
| Imperative API | Promise-based `dialog.confirm/alert/prompt`. Promise resolves on click; caller calls `close()`. Auto-loading on the action button until `close()`. |
| Mount mechanism | `app.use(DialogsPlugin)`; `<Dialogs />` component still exported for explicit mount. |

## Exact public API for v1

### Types

```ts
type DialogSize =
  | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'

type DialogTheme = 'yellow' | 'blue' | 'red' | 'green'

type DialogPosition = 'center' | 'top'

interface DialogIcon {
  name: string
  /** Color tone. Replaces deprecated `appearance`. */
  theme?: DialogTheme
}

type DialogActionContext = { close: () => void }

interface DialogAction extends ButtonProps {
  onClick?: (context: DialogActionContext) => void | Promise<void>
}

/** Legacy blob — accepted for back-compat, warns once. */
interface DialogOptions {
  title?: string
  message?: string
  size?: DialogSize
  icon?: string | DialogIcon
  actions?: DialogAction[]
  position?: DialogPosition
  paddingTop?: string | number
}
```

### Props

```ts
interface DialogProps {
  // Visibility — both supported, document `open` as canonical.
  open?: boolean
  modelValue?: boolean

  // Content.
  title?: string
  message?: string
  icon?: string | DialogIcon

  // Layout.
  size?: DialogSize                 // default 'lg'
  position?: DialogPosition         // default 'center'
  paddingTop?: string | number

  // Actions.
  actions?: DialogAction[]

  // Behavior.
  dismissable?: boolean             // default true
  showCloseButton?: boolean         // default true
  bare?: boolean                    // default false

  // Deprecated (still supported, warn once).
  disableOutsideClickToClose?: boolean
  options?: DialogOptions
}
```

#### Prop semantics

- **`open` / `modelValue`** — same boolean state. `v-model:open` is canonical and aligns with `Popover`/`Dropdown`. `v-model` (bound to `modelValue`) is also supported indefinitely for back-compat; no warning. If both are bound, `open` wins.
- **`dismissable`** — when `false`, both outside-click and Escape are suppressed. Replaces `disableOutsideClickToClose`. Default `true`.
- **`bare`** — when `true`, drops the chrome: no padded card, no auto-header, no auto-actions container. `#default` fills the modal shell directly. `title`/`actions` props become no-ops with a dev warning; `#title`/`#actions` slots are not rendered. Used for command palettes, full-screen settings, etc.
- **`showCloseButton`** — controls the absolute-positioned top-right close button. Independent of the auto-header. Default `true`.
- **`paddingTop`** — overrides the position-based top padding (escape hatch; kept for the single in-the-wild use case).
- **`options`** — accepted for back-compat. Setting it triggers a one-time dev warning per Dialog instance. Flat props **override** any matching key in `options`. Internally flattened before rendering.

### Slots

| Slot | Scope | Purpose |
|---|---|---|
| `#default` | — | Main content, rendered inside the padded card. |
| `#title` | — | Title area; accepts arbitrary content (extra buttons next to title, etc.). |
| `#actions` | `{ close, actions }` | Footer override; `actions` is the reactive action list (with `loading`) so callers can re-lay-out the auto-rendered buttons. |

**Slot precedence rules:**

- `#actions` slot wins when both `actions` prop and slot are provided.
- `#title` slot wins when both `title` prop and slot are provided.
- When neither `title` prop nor `#title` slot is set, the auto-header **does not render** (no "Untitled" fallback).
- When `bare`, all auto-chrome (padded card, auto-header, auto-actions container) is suppressed.

**Deprecated slots** (warn once, internally forwarded to the canonical slot):

| Legacy slot | Forwards to | Notes |
|---|---|---|
| `#body-content` | `#default` | Most-common legacy slot (~85% of legacy usage). |
| `#body-main` | `#default` | Auto-header conditional on title makes these equivalent. |
| `#body-title` | `#title` | Direct rename. |
| `#body-header` | — | No replacement — extras go in `#title`. Warns + renders nothing. |
| `#body` | `#default` + `bare` | Apps using `#body` for full layout control migrate to `bare` + `#default`. Codemod-able. |

### Events

| Event | Payload | Notes |
|---|---|---|
| `update:open` | `boolean` | Fires for `v-model:open`. |
| `update:modelValue` | `boolean` | Fires for `v-model` (bare). Same value as `update:open`. |
| `close` | — | Fires when the dialog transitions to closed. |
| `after-leave` | — | Fires after the close animation finishes. Used heavily in apps for form-reset patterns. |

### ARIA

- `role="dialog"` always — no `alertdialog` variant. See ADR-0001.
- `aria-labelledby` ← the `DialogTitle` element (whether populated by `title` prop or `#title` slot).
- `aria-describedby` ← the description element when `message` is set.
- When `bare`, the caller is responsible for `aria-labelledby` / `aria-describedby`.

### Styling hooks

- `data-state="open" | "closed"` on overlay and content (already provided by reka-ui).
- `data-dialog="{title}"` on overlay (kept from current API for test selection).
- `data-position="center" | "top"` on the centering wrapper.

## Imperative API

The `dialog` namespace exports three Promise-based helpers. All resolve when the user picks an action; the caller calls `close()` when ready.

### Mount

```ts
// main.ts
import { createApp } from 'vue'
import { DialogsPlugin } from 'frappe-ui'
import App from './App.vue'

createApp(App).use(DialogsPlugin).mount('#app')
```

The plugin installs a hidden `<Dialogs />` mount into the app's root so imperative dialogs inherit `provide/inject` (router, Pinia, theme).

For apps that prefer explicit mounting, the `<Dialogs />` component remains exported and can be placed in `App.vue`. The plugin no-ops if `<Dialogs />` is already mounted.

### Types

```ts
interface ConfirmArgs {
  title?: string
  message?: string
  confirmLabel?: string          // default 'Confirm'
  cancelLabel?: string           // default 'Cancel'
  theme?: DialogTheme            // colors the confirm button + picks default icon
  icon?: string | DialogIcon     // overrides theme-derived default icon
  size?: DialogSize              // default 'md'
}

interface AlertArgs {
  title?: string
  message?: string
  label?: string                 // default 'OK'
  theme?: DialogTheme
  icon?: string | DialogIcon
  size?: DialogSize              // default 'md'
}

interface PromptArgs {
  title?: string
  message?: string
  fields: PromptField[]
  confirmLabel?: string          // default 'Submit'
  cancelLabel?: string           // default 'Cancel'
  theme?: DialogTheme
  icon?: string | DialogIcon
  size?: DialogSize              // default 'md'
}

type PromptField = {
  name: string
  label?: string
  type?: 'text' | 'textarea' | 'select' | 'checkbox'   // default 'text'
  defaultValue?: string | boolean
  placeholder?: string
  required?: boolean
  options?: Array<{ label: string; value: string }>    // for 'select'
  description?: string
}

interface ConfirmResult { ok: boolean; close: () => void }
interface AlertResult { close: () => void }
interface PromptResult {
  values: Record<string, any> | null    // null on cancel
  close: () => void
}

declare const dialog: {
  confirm(args: ConfirmArgs): Promise<ConfirmResult>
  alert(args: AlertArgs): Promise<AlertResult>
  prompt(args: PromptArgs): Promise<PromptResult>
}
```

### Lifecycle contract

- Each helper mounts a `<Dialog>` with `dismissable: false`.
- The Promise resolves the instant the user picks an action:
  - `confirm` → `{ ok: true, close }` on confirm, `{ ok: false, close }` on cancel.
  - `alert` → `{ close }` (single button; resolves on click).
  - `prompt` → `{ values: { ... }, close }` on submit, `{ values: null, close }` on cancel.
- The dialog **does not auto-close on confirm**. The caller calls `close()` when their work is done.
- The confirm/submit button automatically shows a loading state from the moment of click until `close()` is called or the dialog is cancelled.
- On cancel, the dialog auto-closes and the promise resolves. Calling `close()` after a cancel is a no-op.

See ADR-0002 for why we chose caller-controlled close over auto-close.

### `theme` → default icon mapping

When `theme` is set without an explicit `icon`, the helper uses these defaults (all overridable):

| `theme` | Default icon | Confirm button color |
|---|---|---|
| `red` | `lucide-alert-triangle` | red solid |
| `yellow` | `lucide-alert-triangle` | yellow solid |
| `blue` | `lucide-info` | blue solid |
| `green` | `lucide-check-circle` | green solid |
| *(unset)* | none | default solid |

### Examples

```ts
// Simple confirm
const { ok, close } = await dialog.confirm({
  title: 'Delete file?',
  message: 'This cannot be undone.',
  confirmLabel: 'Delete',
  theme: 'red',
})
if (ok) {
  await api.deleteFile(id)
}
close()
```

```ts
// Alert
const { close } = await dialog.alert({
  title: 'Saved',
  message: 'Your changes are saved.',
  theme: 'green',
})
close()
```

```ts
// Prompt
const { values, close } = await dialog.prompt({
  title: 'New folder',
  fields: [
    { name: 'name', label: 'Folder name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
  ],
})
if (values) {
  await api.createFolder(values)
}
close()
```

## Deprecations

Each deprecated surface keeps working in v1, emits a one-time dev-mode console warning (per instance / per session), and includes the canonical replacement in the message.

| Deprecated | Replacement |
|---|---|
| `options` blob prop | Flat top-level props |
| `disableOutsideClickToClose` | `dismissable` (inverted) |
| `icon: { appearance: 'warning' \| 'info' \| 'danger' \| 'success' }` | `icon: { theme: 'yellow' \| 'blue' \| 'red' \| 'green' }` |
| `#body-content`, `#body-main` slots | `#default` |
| `#body-title` slot | `#title` |
| `#body-header` slot | (no replacement — use `#title` for extras) |
| `#body` slot | `#default` + `bare` prop |
| `action.onClick(callableContext)` shim | `action.onClick({ close })` |
| `confirmDialog()` helper | `dialog.confirm()` |
| `ConfirmDialog.vue` component | mounted internally by `dialog.confirm()`; not part of v1 public surface |

`<Dialogs />` is **not** deprecated — it remains exported and is used by `DialogsPlugin` internally. Apps that already mount it in their template continue to work; the plugin no-ops in that case.

## Migration notes

### From `options` blob to flat props

```vue
<!-- before -->
<Dialog v-model="show" :options="{ title: 'X', size: 'xl' }" />

<!-- after -->
<Dialog v-model:open="show" title="X" size="xl" />
```

The flat props win over `options` keys, so partial migration (changing some keys to flat while leaving others in `options`) is safe but will continue to warn.

### From `#body` to `#default` + `bare`

```vue
<!-- before -->
<Dialog v-model="show" :options="{ size: '5xl' }">
  <template #body>
    <div class="flex h-screen">...sidebar + content...</div>
  </template>
</Dialog>

<!-- after -->
<Dialog v-model:open="show" size="5xl" bare>
  <template #default>
    <div class="flex h-screen">...sidebar + content...</div>
  </template>
</Dialog>
```

This is the canonical migration for the ~30 in-the-wild apps using `#body` for full-canvas layouts (gameplan/Settings, helpdesk/SettingsModal, drive/SearchPopup, command palettes, etc.).

### From `confirmDialog()` to `dialog.confirm()`

```js
// before
confirmDialog({
  title: 'Delete?',
  message: 'Cannot be undone.',
  onConfirm: ({ hideDialog }) => {
    api.deleteFile()
    hideDialog()
  },
})

// after
const { ok, close } = await dialog.confirm({
  title: 'Delete?',
  message: 'Cannot be undone.',
})
if (ok) {
  await api.deleteFile()
}
close()
```

## Out of scope for v1

These are intentionally not in this spec; revisit in `1.x`:

- Cross-component rollout of `dismissable` to Popover, Dropdown, Tooltip.
- Custom `validate` callbacks on `PromptField`.
- Additional `PromptField` types (`date`, `number`, `autocomplete`, etc.).
- `dialog.message()` or other named imperative helpers beyond confirm/alert/prompt.
- A reactive imperative API that exposes the underlying Dialog instance for further mutation.
- Custom `position` offsets beyond the existing `'center' | 'top'` + `paddingTop` surface.
