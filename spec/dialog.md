# Dialog Spec

Status: accepted direction for `frappe-ui` v1.

This document defines the exact public API for `Dialog` and the imperative `dialog` namespace (`dialog.confirm`, `dialog.danger`, `dialog.prompt`). It is part of the overlay/floating stabilization workstream listed in [`v1-release/plan.md`](../v1-release/plan.md).

Architectural calls in this spec are recorded as ADRs:

- [`adr/0001-single-dialog-component.md`](./adr/0001-single-dialog-component.md) — why we ship one `<Dialog>` and not `<Dialog>` + `<AlertDialog>`.
- [`adr/0002-imperative-dialog-caller-closes.md`](./adr/0002-imperative-dialog-caller-closes.md) — *superseded.* Original plan: imperative API resolves on click, caller calls `close()`.
- [`adr/0003-imperative-dialog-onconfirm.md`](./adr/0003-imperative-dialog-onconfirm.md) — why the imperative API ended up callback-based (`onConfirm` with auto-close, throw to stay open), reversing ADR-0002.

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
| Imperative API | Callback-based `dialog.confirm`, `dialog.danger`, `dialog.prompt`. `onConfirm` resolving auto-closes; throwing keeps the dialog open with the thrown message rendered inline. Each helper returns a synchronous `DialogHandle` for programmatic dismissal. |
| Mount mechanism | `<FrappeUIProvider>` renders `<Dialogs />` next to `<Toasts />`. `<Dialogs />` is still exported for callers who don't use the provider. |

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

The `dialog` namespace exports three callback-based helpers: `dialog.confirm`, `dialog.danger`, and `dialog.prompt`. Each mounts a `<Dialog>` from non-component code (stores, route guards, utilities) and returns a synchronous `DialogHandle` so the caller can dismiss programmatically.

The lifecycle is driven by `onConfirm` / `onCancel` callbacks. `onConfirm` resolving auto-closes the dialog; throwing keeps it open with the thrown message rendered inline. See [ADR-0003](./adr/0003-imperative-dialog-onconfirm.md) for the rationale (which supersedes ADR-0002).

### Mount

Wrap the app once with `<FrappeUIProvider>` — it already hosts the toast
viewport and now also renders `<Dialogs />` for the imperative API:

```vue
<!-- App.vue -->
<FrappeUIProvider>
  <RouterView />
</FrappeUIProvider>
```

That's the entire setup. Imperative `dialog.*` calls work from anywhere
in the app and inherit `provide/inject` (router, Pinia, theme) from the
host app — no separate Vue instance, no internal-API touches.

Apps that don't use `FrappeUIProvider` can mount `<Dialogs />` directly
in their root template instead. There is no `DialogsPlugin` — keeping
mounts in the component tree avoids the `createApp` + `_context` shim
pattern used by some other libraries.

### Types

```ts
interface DialogControl {
  /** Manually dismiss the dialog. Idempotent. */
  close: () => void
  /**
   * Show an inline error and reset loading. Pass `null`/`''` to clear.
   * Note: calling this from inside `onConfirm` without throwing does NOT
   * prevent the auto-close — throw to stay open with an error.
   */
  setError: (message: string | null | undefined) => void
}

interface PromptControl extends DialogControl {
  values: Record<string, any>
}

/** A button in `actions[]`. Extends `ButtonProps` (theme, variant, icon, …). */
type DialogAction = Omit<ButtonProps, 'onClick' | 'loading'> & {
  label: string
  onClick?: (ctx: DialogControl) => void | Promise<void>
}

interface ConfirmArgs {
  title?: string
  message?: string
  confirmLabel?: string          // default 'Confirm'; ignored when actions[] is set
  cancelLabel?: string           // default 'Cancel';  ignored when actions[] is set
  theme?: DialogTheme            // colors the confirm button + picks default icon
  icon?: string | DialogIcon     // overrides theme-derived default icon
  size?: DialogSize              // default 'md'
  dismissable?: boolean          // default true
  onConfirm?: (ctx: DialogControl) => void | Promise<void>
  onCancel?: () => void | Promise<void>
  /**
   * Override the default confirm+cancel pair. Each action is rendered as a
   * Button; its onClick is awaited independently and shows a loading spinner
   * while pending. When set, confirmLabel/cancelLabel/onConfirm are ignored.
   */
  actions?: DialogAction[]
}

/**
 * Destructive preset for `dialog.danger`. Forces `theme: 'red'`, defaults
 * `confirmLabel` to 'Delete', defaults the icon to `lucide-alert-triangle`.
 * Everything else (actions[], dismissable, onCancel, …) works as in confirm.
 */
type DangerArgs = Omit<ConfirmArgs, 'theme' | 'icon'>

interface PromptArgs {
  title?: string
  message?: string
  fields: PromptField[]
  confirmLabel?: string          // default 'Submit'
  cancelLabel?: string           // default 'Cancel'
  theme?: DialogTheme
  icon?: string | DialogIcon
  size?: DialogSize              // default 'md'
  dismissable?: boolean          // default true
  onConfirm: (ctx: PromptControl) => void | Promise<void>
  onCancel?: () => void | Promise<void>
}

/**
 * Per-field validator. Return a non-empty string to mark the field invalid;
 * `null`/`undefined`/empty-string for valid. May be async — submit stays in
 * its loading state until all validators settle. Runs after `required`.
 */
type PromptFieldValidator = (
  value: any,
  allValues: Record<string, any>,
) => string | null | undefined | Promise<string | null | undefined>

interface BasePromptField {
  name: string
  label?: string
  placeholder?: string
  required?: boolean
  description?: string
  validate?: PromptFieldValidator
}

type PromptField =
  | (BasePromptField & { type?: 'text' | 'textarea'; defaultValue?: string })
  | (BasePromptField & { type: 'select'; defaultValue?: string;
                         options: Array<{ label: string; value: string }> })
  | (BasePromptField & { type: 'checkbox'; defaultValue?: boolean })
  | (BasePromptField & { type: 'combobox'; defaultValue?: string;
                         options: ComboboxOption[]; allowCreate?: boolean })

interface DialogHandle { close: () => void }

declare const dialog: {
  confirm(args: ConfirmArgs): DialogHandle
  danger(args: DangerArgs): DialogHandle
  prompt(args: PromptArgs): DialogHandle
}
```

### Lifecycle contract

| `onConfirm` outcome | Result |
|---|---|
| Resolves | Dialog auto-closes |
| Throws / rejects | Dialog stays open. Thrown message is extracted via the internal `extractErrorMessage` (Frappe `messages[]`, `Error.message`, plain string, generic fallback) and rendered inline. Buttons re-enable. |
| Calls `ctx.close()` before/during the await | Dialog closes immediately; the trailing auto-close is an idempotent no-op |
| Calls `ctx.setError(msg)` without throwing | Inline error is set, but the dialog **still auto-closes** when `onConfirm` resolves. To stay open with an error, throw instead. |

The confirm/submit button shows a loading spinner for as long as the `onConfirm` promise is pending. When `actions[]` is supplied, each action tracks its own loading state — the clicked button spins; every other button disables until it settles.

`onCancel` fires on Cancel click, Escape, outside-click, or close-button click (whenever the dialog's `open` flag flips to `false` via dismissal). Set `dismissable: false` to disable Escape / outside-click / close-button.

Each helper returns `{ close }` synchronously, so callers can dismiss the dialog from outside the callback chain — e.g., from a socket event or route change.

### `theme` → default icon mapping

When `theme` is set without an explicit `icon`, the helper uses these defaults (all overridable):

| `theme` | Default icon | Confirm button color |
|---|---|---|
| `red` | `lucide-alert-triangle` | red solid |
| `yellow` | `lucide-alert-triangle` | default solid (Button doesn't have a `yellow` theme — icon theme is honored, button falls back) |
| `blue` | `lucide-info` | blue solid |
| `green` | `lucide-check-circle` | green solid |
| *(unset)* | none | default solid |

`dialog.danger` pins `theme: 'red'` and inherits the alert-triangle default.

### Examples

```ts
// Simple confirm — auto-closes when onConfirm resolves.
dialog.confirm({
  title: 'Import workbook',
  message: 'Continue with the import?',
  onConfirm: async () => {
    await api.import()
  },
})
```

```ts
// Destructive flow — dialog.danger is sugar for theme: 'red' + Delete label.
dialog.danger({
  title: 'Delete space',
  message: 'This will permanently delete the space and all its content.',
  onConfirm: async () => {
    await spaces.delete.submit({ name: spaceId })
  },
})
```

```ts
// Stay open after async — throw to surface a validation message.
dialog.confirm({
  title: 'Claim username',
  confirmLabel: 'Claim',
  onConfirm: async () => {
    await api.checkAvailable()
    throw new Error('That username is already taken.')
  },
})
```

```ts
// Custom buttons via actions[]. Each onClick is awaited independently.
dialog.confirm({
  title: 'Paste page',
  message: 'A page with this name already exists. Create a copy or replace?',
  actions: [
    { label: 'Cancel', variant: 'outline' },
    { label: 'Create copy', onClick: async () => { await api.copy() } },
    {
      label: 'Replace',
      variant: 'solid', theme: 'red',
      onClick: async () => { await api.replace() },
    },
  ],
})
```

```ts
// Prompt with per-field async validation.
dialog.prompt({
  title: 'New folder',
  fields: [
    {
      name: 'name',
      label: 'Folder name',
      type: 'text',
      required: true,
      validate: async (value) => {
        const taken = await api.exists(value)
        return taken ? 'A folder with that name already exists' : null
      },
    },
    { name: 'description', label: 'Description', type: 'textarea' },
  ],
  onConfirm: async ({ values }) => {
    await api.createFolder(values)
  },
})
```

```ts
// Programmatic dismissal via the returned handle.
const handle = dialog.confirm({
  title: 'Waiting for upload…',
  dismissable: false,
})
socket.once('upload:done', () => handle.close())
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

`<Dialogs />` is **not** deprecated — it remains exported and is now rendered by `<FrappeUIProvider>` alongside `<Toasts />`. Apps that already mount it in their template continue to work; rendering it twice is safe (the second mount has no extra effect, but the imperative dialog stack lives in a shared module-level ref so the same stack drives both).

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

### From `confirmDialog()` to `dialog.confirm()` / `dialog.danger()`

```js
// before — manual hideDialog after the work completes
confirmDialog({
  title: 'Delete?',
  message: 'Cannot be undone.',
  onConfirm: ({ hideDialog }) => {
    api.deleteFile()
    hideDialog()
  },
})

// after — destructive preset; auto-closes when onConfirm resolves
dialog.danger({
  title: 'Delete?',
  message: 'Cannot be undone.',
  onConfirm: async () => {
    await api.deleteFile()
  },
})
```

For non-destructive flows, use `dialog.confirm` with the same `onConfirm` shape. Throw from `onConfirm` to keep the dialog open with an inline error (e.g., for server-side validation failures).

## Out of scope for v1

These are intentionally not in this spec; revisit in `1.x`:

- Cross-component rollout of `dismissable` to Popover, Dropdown, Tooltip.
- Additional `PromptField` types beyond `text` / `textarea` / `select` / `checkbox` / `combobox` (`date`, `number`, `autocomplete`, multi-step wizards, etc.).
- A `dialog.alert()` helper. The same affordance is achieved today with `dialog.confirm({ actions: [{ label: 'OK', variant: 'solid' }] })` or by passing only `cancelLabel`; not worth a dedicated entry point in v1.
- `dialog.message()` or other named imperative helpers beyond `confirm` / `danger` / `prompt`.
- A reactive imperative API that exposes the underlying Dialog instance for further mutation.
- Custom `position` offsets beyond the existing `'center' | 'top'` + `paddingTop` surface.
