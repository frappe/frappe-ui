# Toast Spec

Status: accepted direction for `frappe-ui` v1.

This document defines the public toast API for `frappe-ui` v1. It is part of the overlay/floating stabilization workstream listed in [`v1-release/plan.md`](../v1-release/plan.md).

## Role

Toasts are short-lived, non-blocking notifications that surface in a fixed viewport (bottom-right by default) and auto-dismiss. Almost all usage is **imperative** via the `toast` namespace — apps reach for `toast.success('Saved')`, not a Vue component.

## Headline decision

`frappe-ui` v1 **vendors [`vue-sonner`](https://github.com/xiaoluoboding/vue-sonner)** and keeps sonner's API shape: the same creators, the same option names, the same id-keyed update lifecycle. Two things are ours:

1. **The `toast` namespace is a thin wrapper**, not a re-export. `src/components/Toast/toast.ts` wraps every creator that takes a plain message so string messages and `description` values render limited inline HTML, sanitized with DOMPurify. This is a deliberate behavior difference from sonner, [described below](#limited-inline-html). Everything the wrapper does not touch comes straight from sonner's namespace.
2. **`<ToastProvider>` is the viewport**, a styled wrapper around sonner's `<Toaster>` with our defaults baked in. Sonner's raw `<Toaster>` is not exported; `<FrappeUIProvider>` renders `<ToastProvider />`.

Apart from the sanitizing wrapper, we **do not** reshape sonner behind a frappe-ui API, rename options, or add convenience creators. If it is documented in vue-sonner's docs, it works here the same way. If we ever swap implementations, that swap is a breaking change.

## Why sonner over building on reka-ui

The 0.1.x toast (built on `reka-ui`) covered the basics but didn't cover two common patterns in the bench:

- **`builder`** uses sonner's `id`-keyed update-in-place pattern (`toast.loading('Pasting…', { id }); … toast.success('Done', { id })`) and imports `vue-sonner` directly.
- **`insights`** uses `toast.custom(component, options)` to render arbitrary Vue components and likewise imports `vue-sonner` directly.

Bolting both onto the reka-based implementation would essentially re-implement sonner inside frappe-ui. Vendoring sonner gets us those features plus stacking, swipe-to-dismiss, hover-to-expand, and a battle-tested viewport state machine.

## Public surface

```ts
// Imperative API — sonner's `toast` namespace behind our sanitizing wrapper.
import { toast } from 'frappe-ui'

// Option types, under frappe-ui names, so an app that wraps `toast` does not
// import from vue-sonner.
import type { ToastAction, ToastId, ToastOptions } from 'frappe-ui'

// Viewport — our styled wrapper around sonner's `<Toaster>`, with the
// frappe-ui defaults baked in. Raw `<Toaster>` is intentionally *not*
// re-exported; consumers either mount `<FrappeUIProvider>` or
// `<ToastProvider>` directly.
import { ToastProvider } from 'frappe-ui'

// One-stop provider — mounts <ToastProvider> with our defaults next to <Dialogs />.
import { FrappeUIProvider } from 'frappe-ui'

```

That's the entire surface.

**Removed exports:** `Toasts` (apps migrate to `<FrappeUIProvider>` or `<ToastProvider />`), raw `Toaster` (the styled `<ToastProvider>` is the only supported viewport surface), and the standalone `<Toast>` SFC (per [ADR-0008](adr/0008-no-deprecated-members-in-1-0-0.md) — it carried an `@deprecated` JSDoc marker in code, and a census found zero apps importing it directly).

## Mount

Wrap the app once with `<FrappeUIProvider>`:

```vue
<FrappeUIProvider>
  <RouterView />
</FrappeUIProvider>
```

The provider renders `<ToastProvider />` ahead of the app content. No other setup required.

Apps that don't use the provider can mount the viewport themselves. Put it
before the app content: it only shows toasts published after it subscribes, so
anything the app toasts from `setup()` is lost if it mounts later.

```vue
<template>
  <ToastProvider />
  <RouterView />
</template>
```

## Defaults baked into `<ToastProvider>`

```ts
{
  position: 'bottom-right',  // sonner default is 'top-right'; matches current behaviour
  duration: 4000,            // ms; sonner's own default, set by sonner, not by us
  closeButton: true,         // every toast shows the × unless caller passes dismissible:false
  expand: false,             // no hover-to-expand stack
  richColors: false,         // tone comes from icon + our dark theme, not tinted backgrounds
  visibleToasts: 3,          // sonner default
}
```

A single toast overrides the duration through its own options:
`toast.success('Saved', { duration: 10000 })`.

No app-level override knob is exposed for v1. `ToastProvider` takes no props. If a real ask shows up (different position, expand-on-hover, custom `toastOptions.classes`), the additive fix is to thread a `toasterProps` slot through `<FrappeUIProvider>`. Deferred until needed.

## Visual theme

Sonner ships with light, light-rich-colors, and dark themes. None match the current frappe-ui toast (dark surface in both light and dark mode for high-contrast notifications).

`ToastProvider.vue` passes `toastOptions.unstyled: true` and supplies a
`toastOptions.classes` map — Tailwind utilities on the toast surface
(`bg-surface-gray-9`, `rounded-5`), title, description, icon, close button,
action button, and cancel button, plus per-type icon colors for `error` and
`warning`. A short `<style>` block next to it imports `vue-sonner/style.css`
and patches three stack-layout details that `unstyled` removes: the measured
height of a toast that grows after its promise resolves, the content of
collapsed back toasts, and the loading spinner.

This is the only place where frappe-ui maintains styling on top of sonner.

## Imperative API

`toast` covers sonner's full creator list. Signatures, ids, and lifecycle are sonner's; the creators that take a plain message go through the sanitizing wrapper described in the next section.

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

## Limited inline HTML

A string message may carry `a`, `em`, `strong`, `i`, `b` or `u`. `src/components/Toast/toast.ts` sanitizes it with DOMPurify against that safelist and hands sonner a render function; anything outside the safelist is stripped. Non-string values — components, VNodes, render functions — pass through untouched. This is intentional and driven by real app needs; it is not a leftover of 0.1.x.

The wrapper covers, per creator:

| Creator | Message | `description` |
|---|---|---|
| `toast()`, `success`, `error`, `warning`, `info`, `message`, `loading` | sanitized | sanitized |
| `custom` | takes a component, not a message | sanitized |
| `promise` | keys its strings by state; they render as vue-sonner renders them | sanitized |

Every other member of the namespace (`dismiss`, and anything else sonner ships) is sonner's own, reached through `Object.assign`. Adding a creator to sonner's namespace does not add it to the contract above: a new creator that takes a message must be wrapped explicitly, or it silently opts out.

## Standalone `<Toast>` component — removed

`src/components/Toast/Toast.vue` (the reka-based SFC) shipped `@deprecated` in code and is deleted per ADR-0008 — nothing marked `@deprecated` ships in `1.0.0`. A census across every downstream app (crm, helpdesk, gameplan, insights, builder, suite, central, frappe_calendar, frappe-ui-starter, frappe/frappe's `ui/`) found zero call sites, so this is a clean removal: the import fails at build time, and no app needs a migration path beyond switching to the imperative `toast` namespace.

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

**Limited inline HTML is supported, in the message and in `description`** — see [Limited inline HTML](#limited-inline-html) for the safelist and the per-creator coverage. `description` joined the contract in #1094 item 6, so a description holding a `<` outside the safelist now loses those characters.

### Renamed / removed APIs

| 0.1.x | v1 | Audited callsites |
|---|---|---|
| ~~`toast.create({ message, ... })`~~ removed in #1094 | `toast(message, { ... })` or `toast.message(message, { ... })` | 7: helpdesk 5, suite 2 (both wrappers) |
| ~~`toast.remove(id)`~~ removed in #1094 | `toast.dismiss(id)` | 0 |
| ~~`toast.removeAll()`~~ removed in #1094 | `toast.dismiss()` | 4 (suite: mail 3, calendar 1) |
| `import { Toasts } from 'frappe-ui'`<br>`<Toasts />` | `<FrappeUIProvider>` wrap, **or** `import { ToastProvider } from 'frappe-ui'`; `<ToastProvider />` | 2 (crm, hrms) |
| `<ToastProvider>` SFC | `import { ToastProvider } from 'frappe-ui'` (styled wrapper around sonner's `<Toaster>`) | 0 |
| Options field: `message` | `title` | several (all `toast.create` callsites) |
| Options field: `closable` | `closeButton` (sonner global) or `dismissible` (per-toast) | several |
| Options field: `type` (on raw options) | use the type helper instead (`toast.success`, etc.) | n/a |

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
    duration: duration,  // already in ms in legacy createToast — no conversion
  })
}
```

## Out of scope for v1

- **Configurable viewport position from the provider.** Hardcoded `bottom-right`. Apps needing otherwise mount vue-sonner's `<Toaster>` themselves.
- **Hover-to-expand / stacking config.** Sonner supports it; we keep `expand: false` and don't expose a knob.
- **Rich-color theming.** Type is conveyed by icon + the universal dark surface.
- **Multiple actions per toast.** Sonner supports `action` + `cancel` natively, and the option bag is sonner's, so both reach it — but our docs only show single-action patterns. No audited callsite uses two actions.
- **Codemods.** The 0.1.x → v1 changes are too sparse to justify automated rewrites. Manual migration with a release-notes callout is sufficient.

## Open questions

None blocking. Spec is ready for implementation.
