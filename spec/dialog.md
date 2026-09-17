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
| Prop surface | Flat top-level props only; the `options` blob was removed (ADR-0008) |
| Dismiss control | `dismissible: boolean` (default `true`); replaces `disableOutsideClickToClose` |
| Chrome control | `bare: boolean` (default `false`); replaces the legacy `#body` slot |
| Close button | `showCloseButton: boolean` (default `true`); independent of header |
| Size scale | All 11 sizes kept (`xs` → `7xl`); maps to Tailwind `max-w-*` |
| Color vocabulary | `theme` with color names (`'amber' \| 'blue' \| 'red' \| 'green'`). No semantic axis. (`Alert.theme` uses its own palette: `gray \| blue \| green \| amber \| red`.) |
| Slots | Canonical only: `#default`, `#title`, `#actions`. Legacy slots were removed (ADR-0008). |
| Imperative API | Callback-based `dialog.confirm`, `dialog.danger`, `dialog.prompt`. `onConfirm` resolving auto-closes; throwing keeps the dialog open with the thrown message rendered inline. Each helper returns a synchronous `DialogHandle` for programmatic dismissal. |
| Mount mechanism | `<FrappeUIProvider>` renders `<Dialogs />` next to `<ToastProvider />`. `<Dialogs />` is still exported for callers who don't use the provider. |

## Exact public API for v1

### Types

```ts
type DialogSize =
  | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'

type DialogTheme = 'amber' | 'blue' | 'red' | 'green'

type DialogPosition = 'center' | 'top'

type DialogActionContext = { close: () => void }

interface DialogAction extends ButtonProps {
  onClick?: (context: DialogActionContext) => void | Promise<void>
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
  icon?: string | Component         // lucide-* class name, or a component
  theme?: DialogTheme               // tone of the icon badge

  // Layout.
  size?: DialogSize                 // default 'lg'
  position?: DialogPosition         // default 'center'
  paddingTop?: string | number      // a number is pixels

  // Actions.
  actions?: DialogAction[]

  // Behavior.
  dismissible?: boolean             // default true
  showCloseButton?: boolean         // default true
  bare?: boolean                    // default false
}
```

#### Prop semantics

- **`open` / `modelValue`** — same boolean state. `v-model:open` is canonical and aligns with `Popover`/`Dropdown`. `v-model` (bound to `modelValue`) is also supported indefinitely for back-compat; no warning. If both are bound, `open` wins.
- **`dismissible`** — when `false`, both outside-click and Escape are suppressed. Replaces `disableOutsideClickToClose`. Default `true`.
- **`bare`** — when `true`, drops the chrome: no padded card, no auto-header, no auto-actions container. `#default` fills the modal shell directly. `title`/`actions` props become no-ops with a dev warning; `#title`/`#actions` slots are not rendered. Used for command palettes, full-screen settings, etc.
- **`showCloseButton`** — controls the absolute-positioned top-right close button. Independent of the auto-header. Default `true`.
- **`icon` / `theme`** — two independent props. `icon` takes a `lucide-*` class name or a Vue component; `theme` colors the badge behind it and defaults to the neutral gray one. The structured `DialogIcon` object is gone: it carried the tone inside the icon, which no other component does, and it could not hold a component.
- **`message`** — the short paragraph below the title, rendered through reka's `DialogDescription` so it is announced with the dialog. It stays: it is the whole body of a confirm-shaped dialog. Longer content goes in `#default`, which replaces it.
- **`paddingTop`** — overrides the position-based top padding (escape hatch; kept for the single in-the-wild use case). A number is pixels; a string is used as given.

### Slots

| Slot | Scope | Purpose |
|---|---|---|
| `#default` | `{ close }` | Main content, rendered inside the padded card. In `bare` mode it fills the modal shell and still receives `close`. |
| `#title` | `{ close }` | Title area; accepts arbitrary content (extra buttons next to title, etc.). |
| `#actions` | `{ close, actions }` | Footer override; `actions` is the reactive action list (with `loading`) so callers can re-lay-out the auto-rendered buttons. |

Every slot receives `close`. The scoped payloads are `DialogSlotProps` and `DialogActionsSlotProps` in `src/components/Dialog/types.ts`.

**Slot precedence rules:**

- `#actions` slot wins when both `actions` prop and slot are provided.
- `#title` slot wins when both `title` prop and slot are provided.
- When neither `title` prop nor `#title` slot is set, the auto-header **does not render** (no "Untitled" fallback).
- When `bare`, all auto-chrome (padded card, auto-header, auto-actions container) is suppressed.

**Legacy slots** (removed per ADR-0008 — kept here as the migration mapping):

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

### Parts

`Dialog.Title`, `Dialog.Description` and `Dialog.Close` are reka's own parts,
re-exported on the component. They are public, and documented: a `bare` dialog
has no auto-header, so it needs `Dialog.Title` to carry its accessible name.

### Styling hooks

- `data-state="open" | "closed"` on overlay and content (already provided by reka-ui).
- `data-dialog="{title}"` on overlay (kept from current API for test selection).
- `data-position="center" | "top"` on the centering wrapper.
- `data-slot="content"` on the dialog card, `data-slot="icon"` on the header icon badge, `data-slot="actions"` on the footer action row.

## Imperative API

The `dialog` namespace exports three callback-based helpers: `dialog.confirm`, `dialog.danger`, and `dialog.prompt`. Each mounts a `<Dialog>` from non-component code (stores, route guards, utilities) and returns a synchronous `DialogHandle` so the caller can dismiss programmatically.

The lifecycle is driven by `onConfirm` / `onCancel` callbacks. `onConfirm` resolving auto-closes the dialog; throwing keeps it open with the thrown message rendered inline. See [ADR-0003](./adr/0003-imperative-dialog-onconfirm.md) for the rationale (which supersedes ADR-0002).

### Mount

Wrap the app once with `<FrappeUIProvider>` — it renders `<ToastProvider />`
for the toast viewport and `<Dialogs />` for the imperative dialog API:

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
in their root template instead; it stays exported for that case. There is
no `DialogsPlugin` — keeping mounts in the component tree avoids the
`createApp` + `_context` shim pattern used by some other libraries.

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

/**
 * A button in `actions[]`. Extends `ButtonProps` (theme, variant, icon, …).
 * Named `ImperativeDialogAction`, because the component's own `actions` prop
 * takes `DialogAction`, whose `onClick` receives `{ close }` and nothing else.
 */
type ImperativeDialogAction = Omit<ButtonProps, 'onClick' | 'loading'> & {
  label: string
  onClick?: (ctx: DialogControl) => void | Promise<void>
}

interface ConfirmArgs {
  title?: string
  message?: string
  confirmLabel?: string          // default 'Confirm'; ignored when actions[] is set
  cancelLabel?: string           // default 'Cancel';  ignored when actions[] is set
  theme?: DialogTheme            // colors the confirm button + picks default icon
  icon?: string | Component      // overrides theme-derived default icon
  size?: DialogSize              // default 'md'
  dismissible?: boolean          // default true
  onConfirm?: (ctx: DialogControl) => void | Promise<void>
  onCancel?: () => void | Promise<void>
  /**
   * Override the default confirm+cancel pair. Each action is rendered as a
   * Button; its onClick is awaited independently and shows a loading spinner
   * while pending. When set, confirmLabel/cancelLabel/onConfirm are ignored.
   */
  actions?: ImperativeDialogAction[]
}

/**
 * Destructive preset for `dialog.danger`. Forces `theme: 'red'`, defaults
 * `confirmLabel` to 'Delete', defaults the icon to `lucide-alert-triangle`.
 * Everything else (actions[], dismissible, onCancel, …) works as in confirm.
 */
type DangerArgs = Omit<ConfirmArgs, 'theme' | 'icon'>

interface PromptArgs {
  title?: string
  message?: string
  fields: PromptField[]
  confirmLabel?: string          // default 'Submit'
  cancelLabel?: string           // default 'Cancel'
  theme?: DialogTheme
  icon?: string | Component
  size?: DialogSize              // default 'md'
  dismissible?: boolean          // default true
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

`onCancel` fires on Cancel click, Escape, outside-click, or close-button click (whenever the dialog's `open` flag flips to `false` via dismissal).

Every helper defaults `dismissible` to `true`, like the component. The caller sets `dismissible: false` for a forced-response dialog; the helper then passes `showCloseButton: false` too, so Escape, outside-click, and the close button all go away together.

Each helper returns `{ close }` synchronously, so callers can dismiss the dialog from outside the callback chain — e.g., from a socket event or route change.

### `theme` → default icon mapping

When `theme` is set without an explicit `icon`, the helper uses these defaults (all overridable):

| `theme` | Default icon | Confirm button color |
|---|---|---|
| `red` | `lucide-alert-triangle` | red solid |
| `amber` | `lucide-alert-triangle` | default solid (Button doesn't have an `amber` theme — icon theme is honored, button falls back) |
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
  dismissible: false,
})
socket.once('upload:done', () => handle.close())
```

## Deprecations

Every surface in the table below was deleted before 1.0.0, per [ADR-0008](./adr/0008-no-deprecated-members-in-1-0-0.md). The table documents the old → new mapping for migration.

| Deprecated | Replacement |
|---|---|
| `options` blob prop | Flat top-level props |
| `disableOutsideClickToClose` | `dismissible` (inverted) |
| `icon: { name, appearance: 'warning' \| 'info' \| 'danger' \| 'success' }` object | `icon` (string or component) + `theme: 'amber' \| 'blue' \| 'red' \| 'green'` |
| `#body-content`, `#body-main` slots | `#default` |
| `#body-title` slot | `#title` |
| `#body-header` slot | (no replacement — use `#title` for extras) |
| `#body` slot | `#default` + `bare` prop |
| `action.onClick(callableContext)` shim | `action.onClick({ close })` |
| `confirmDialog()` helper | `dialog.confirm()` |
| `ConfirmDialog.vue` component | deleted — `dialog.confirm()` renders its own internal dialog, not this component |

`<Dialogs />` is **not** deprecated — it remains exported and is now rendered by `<FrappeUIProvider>` alongside `<ToastProvider />`. Apps that already mount it in their template continue to work; rendering it twice is safe — only the first mounted host renders the stack, whether the extra host is nested or a sibling; the others warn in dev. When the rendering host unmounts, the claim hands over to the next mounted host, so the stack never loses its renderer.

## Migration notes

### From `theme: 'yellow'` to `theme: 'amber'`

`DialogTheme`'s warning tone is `amber`, not `yellow`. The rest of the library
already spells it that way — `Alert` and `SidebarCard` (`StatusTheme`), `Badge`
and `Avatar` — and `Dialog` itself rendered `yellow` with the `amber` tokens
(`bg-surface-amber-2` / `text-ink-amber-5`), so only the word changes.

The icon object is gone with it: `icon` is now a `lucide-*` class name or a
component, and `theme` is its own prop.

```vue
<!-- before -->
<Dialog :icon="{ name: 'lucide-alert-triangle', theme: 'yellow' }" />

<!-- after -->
<Dialog icon="lucide-alert-triangle" theme="amber" />
```

The same applies to the `theme` argument of `dialog.confirm` / `dialog.danger`.

### From `options` blob to flat props

```vue
<!-- before -->
<Dialog v-model="show" :options="{ title: 'X', size: 'xl' }" />

<!-- after -->
<Dialog v-model:open="show" title="X" size="xl" />
```

The `options` prop is removed. Migrate every key to its matching flat prop — any value left behind in an `options` object is silently ignored.

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

- Cross-component rollout of `dismissible` to Popover, Dropdown, Tooltip.
- Additional `PromptField` types beyond `text` / `textarea` / `select` / `checkbox` / `combobox` (`date`, `number`, `autocomplete`, multi-step wizards, etc.).
- A `dialog.alert()` helper. The same affordance is achieved today with `dialog.confirm({ actions: [{ label: 'OK', variant: 'solid' }] })` or by passing only `cancelLabel`; not worth a dedicated entry point in v1.
- `dialog.message()` or other named imperative helpers beyond `confirm` / `danger` / `prompt`.
- A reactive imperative API that exposes the underlying Dialog instance for further mutation.
- Custom `position` offsets beyond the existing `'center' | 'top'` + `paddingTop` surface.
