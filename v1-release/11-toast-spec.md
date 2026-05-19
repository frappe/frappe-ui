# Toast Spec

Status: accepted direction for `frappe-ui` v1.

This document defines the public toast API for `frappe-ui` v1. It is part of the overlay/floating stabilization workstream listed in [`plan.md`](./plan.md).

## Role

Toasts are short-lived, non-blocking notifications that surface in a fixed viewport (bottom-right by default) and auto-dismiss. Almost all usage is **imperative** via the `toast` namespace — apps reach for `toast.success('Saved')`, not a Vue component.

## Headline decision

`frappe-ui` v1 **vendors [`vue-sonner`](https://github.com/xiaoluoboding/vue-sonner)** and re-exports its `toast` namespace and `<Toaster>` component **with sonner's API surface unchanged**. Our only contribution is:

1. **Visual defaults** — CSS overrides that match the current dark high-contrast toast (`bg-surface-gray-6` + `ink-white`).
2. **Configuration defaults** — `position='bottom-right'`, `duration=5000`, `closeButton=true`.
3. **Mount integration** — `<FrappeUIProvider>` renders `<Toaster>` with those defaults.

We deliberately **do not** wrap sonner behind a frappe-ui-shaped API, do not rename options, and do not add convenience extensions. The contract is: if it's documented in vue-sonner's docs, it works here exactly the same way. If we ever swap implementations, that swap is a breaking change.

## Why sonner over building on reka-ui

The 0.1.x toast (built on `reka-ui`) covered the basics but didn't cover two common patterns in the bench:

- **`builder`** uses sonner's `id`-keyed update-in-place pattern (`toast.loading('Pasting…', { id }); … toast.success('Done', { id })`) and imports `vue-sonner` directly.
- **`insights`** uses `toast.custom(component, options)` to render arbitrary Vue components and likewise imports `vue-sonner` directly.

Bolting both onto the reka-based implementation would essentially re-implement sonner inside frappe-ui. Vendoring sonner gets us those features plus stacking, swipe-to-dismiss, hover-to-expand, and a battle-tested viewport state machine.

## Public surface

```ts
// Imperative API — sonner's `toast`, re-exported as-is.
import { toast } from 'frappe-ui'

// Viewport — our styled wrapper around sonner's `<Toaster>`, with the
// frappe-ui defaults baked in. Raw `<Toaster>` is intentionally *not*
// re-exported; consumers either mount `<FrappeUIProvider>` or
// `<ToastProvider>` directly.
import { ToastProvider } from 'frappe-ui'

// One-stop provider — mounts <ToastProvider> with our defaults next to <Dialogs />.
import { FrappeUIProvider } from 'frappe-ui'

// Vestigial back-compat export. Not documented; not promoted.
// Kept so that any code still importing `{ Toast }` keeps compiling.
import { Toast } from 'frappe-ui'
```

That's the entire surface.

**Removed exports:** `Toasts` (apps migrate to `<FrappeUIProvider>` or `<ToastProvider />`), raw `Toaster` (the styled `<ToastProvider>` is the only supported viewport surface).

## Mount

Wrap the app once with `<FrappeUIProvider>`:

```vue
<FrappeUIProvider>
  <RouterView />
</FrappeUIProvider>
```

The provider renders sonner's `<Toaster>` with our baked-in defaults. No other setup required.

Apps that don't use the provider can mount the viewport themselves:

```vue
<template>
  <RouterView />
  <ToastProvider />
</template>
```

## Defaults baked into `<FrappeUIProvider>`'s `<Toaster>`

```ts
{
  position: 'bottom-right',  // sonner default is 'top-right'; matches current behaviour
  duration: 5000,            // ms; matches current behaviour
  closeButton: true,         // every toast shows the × unless caller passes dismissible:false
  expand: false,             // no hover-to-expand stack
  richColors: false,         // tone comes from icon + our dark theme, not tinted backgrounds
  visibleToasts: 3,          // sonner default
}
```

No app-level override knob is exposed for v1. If a real ask shows up (different position, expand-on-hover, custom `toastOptions.classes`), the additive fix is to thread a `toasterProps` slot through `<FrappeUIProvider>`. Deferred until needed.

## Visual theme

Sonner ships with light, light-rich-colors, and dark themes. None match the current frappe-ui toast (dark surface in both light and dark mode for high-contrast notifications).

We apply a thin CSS override layer targeting sonner's CSS custom properties, scoped to the `<Toaster>` element. Approximate shape:

```css
[data-sonner-toaster] {
  --normal-bg: theme(colors.surface-gray-6);
  --normal-text: theme(colors.ink-white);
  --normal-border: transparent;
  --success-bg: var(--normal-bg);
  --success-text: var(--normal-text);
  /* …error / warning / info likewise … */
  --border-radius: theme(borderRadius.md);
}
```

Action button styling is applied via `toastOptions.classes.actionButton` on the `<Toaster>` config, matching the current `text-ink-blue-link hover:text-ink-gray-3` treatment.

This is the only place where frappe-ui maintains styling on top of sonner. CSS-variable-first keeps the override small and predictable.

## Imperative API

Sonner's full `toast` namespace is exposed unchanged:

```ts
toast(message, options?)            // bare creator; same as toast.message
toast.message(message, options?)    // default style, no semantic type
toast.success(message, options?)
toast.error(message, options?)
toast.info(message, options?)
toast.warning(message, options?)
toast.loading(message, options?)    // persistent by default; spinner icon
toast.custom(component, options?)   // arbitrary Vue component as the body
toast.promise(promise, options)     // loading → success | error lifecycle
toast.dismiss(id?)                  // dismiss one or all
```

All creators return the toast id (`string | number`) synchronously. Re-using an existing id updates that toast in place — this is the canonical pattern for "convert loading to success":

```ts
const id = toast.loading('Pasting…')
try {
  await doWork()
  toast.success('Pasted', { id })
} catch (err) {
  toast.error(err.messages?.[0] ?? 'Paste failed', { id })
}
```

`toast.promise` uses this same lifecycle under the hood:

```ts
toast.promise(saveDoc(), {
  loading: 'Saving changes…',
  success: (doc) => `Saved ${doc.name}`,
  error: (err) => err.messages?.[0] ?? 'Failed to save',
})
```

For the full option types (`ExternalToast`, action shapes, position values, etc.), see [vue-sonner's documentation](https://vue-sonner.vercel.app/). We don't redocument them here.

## Standalone `<Toast>` component

`src/components/Toast/Toast.vue` (the existing reka-based SFC) remains in the tree and is still exported from `index.ts` for back-compat. It is **not promoted**, not documented in v1 docs, and not the recommended way to use toasts. The imperative `toast` namespace is the only public API the v1 documentation teaches.

Audit found zero apps importing `Toast` directly. The export is preserved purely to avoid an unnecessary "Module has no exported member 'Toast'" break for any out-of-tree consumer.

## Migration from 0.1.x

The 0.1.x → v1 cutover is a breaking change. A migration guide will be linked from `changelog.md`. Highlights:

### Silent-breakage hazards

These do **not** produce TypeScript or runtime errors — they only manifest as visual misbehaviour. They need a release-notes callout.

**Duration units flip from seconds to milliseconds.**

```ts
// 0.1.x: 5 seconds
toast.success('Saved', { duration: 5 })

// v1: 5 milliseconds — toast vanishes before the user sees it
toast.success('Saved', { duration: 5 })

// v1 fix
toast.success('Saved', { duration: 5000 })
```

Audit: ~6 callsites pass a numeric `duration`. Each needs `× 1000`.

**HTML in messages is rendered as text.** 0.1.x ran `message` through DOMPurify with a small inline-tag safelist (`a`, `em`, `strong`, `i`, `b`, `u`). Sonner renders `title`/`description` as plain text. Audit found zero callsites using inline HTML in toast messages, so no app should be affected — but worth noting.

### Renamed / removed APIs

| 0.1.x                                                | v1                                                                                                 | Audited callsites                      |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `toast.create({ message, ... })`                     | `toast(message, { ... })` or `toast.message(message, { ... })`                                     | 5 (helpdesk)                           |
| `toast.remove(id)`                                   | `toast.dismiss(id)`                                                                                | 0                                      |
| `toast.removeAll()`                                  | `toast.dismiss()`                                                                                  | 0                                      |
| `import { Toasts } from 'frappe-ui'`<br>`<Toasts />` | `<FrappeUIProvider>` wrap, **or** `import { ToastProvider } from 'frappe-ui'`; `<ToastProvider />` | 2 (crm, hrms)                          |
| `<ToastProvider>` SFC                                | `import { ToastProvider } from 'frappe-ui'` (styled wrapper around sonner's `<Toaster>`)           | 0                                      |
| Options field: `message`                             | `title`                                                                                            | several (all `toast.create` callsites) |
| Options field: `closable`                            | `closeButton` (sonner global) or `dismissible` (per-toast)                                         | several                                |
| Options field: `type` (on raw options)               | use the type helper instead (`toast.success`, etc.)                                                | n/a                                    |

### Dropped `toast.promise` extensions

0.1.x added `successDuration`, `errorDuration`, `successAction`, `errorAction` to `toast.promise` (PR #450). Sonner's `toast.promise` doesn't support them. v1 drops all four.

Audit: **one** callsite uses any of them — `drive/frontend/src/components/Navbar.vue:304` sets `successDuration: 1`. Migration: drop the option (the page redirects immediately after success anyway), or do the manual id pattern:

```ts
const id = toast.loading(`Creating ${type}…`)
try {
  const data = await createDoc()
  toast.success(`Created ${type}`, { id, duration: 1000 })
} catch (err) {
  toast.error(err.messages?.[0] ?? 'Failed', { id })
}
```

### Out of scope: app-local `createToast({...})`

The `createToast({ title, message, variant, duration })` helper found in helpdesk, insights, gameplan, and similar (`{ title, text, icon, iconClasses }` in crm) is defined **locally per app**, not exported from frappe-ui. The ~69 callsites are not our migration concern.

App owners replace their local helper with direct `toast.*` calls when they're ready. A representative one-line adapter for transitional use:

```ts
// app-local shim, lives in the app, not frappe-ui
import { toast } from 'frappe-ui'

export function createToast({ title, message, variant = 'info', duration }) {
  return (toast[variant] ?? toast.info)(title, {
    description: message,
    duration: duration, // already in ms in legacy createToast — no conversion
  })
}
```

## Out of scope for v1

- **Configurable viewport position from the provider.** Hardcoded `bottom-right`. Apps needing otherwise mount their own `<Toaster>`.
- **Hover-to-expand / stacking config.** Sonner supports it; we keep `expand: false` and don't expose a knob.
- **Rich-color theming.** Type is conveyed by icon + the universal dark surface.
- **Multiple actions per toast.** Sonner supports `action` + `cancel` natively — exposed by virtue of "exact sonner API" — but our docs only show single-action patterns. No audited callsite uses two actions.
- **Codemods.** The 0.1.x → v1 changes are too sparse to justify automated rewrites. Manual migration with a release-notes callout is sufficient.

## Open questions

None blocking. Spec is ready for implementation.
