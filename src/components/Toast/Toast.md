# Toast

A transient notification used to provide feedback for actions, success states, warnings, or errors.

Use the `toast` helper anywhere in your app to trigger a notification — no setup needed beyond mounting `FrappeUIProvider` once at the root.

<ComponentPreview name="Toast-Quickstart" layout="stacked" />

## Examples

Toasts come in four visual types — `message`, `info`, `success`, `warning`, and `error` — and accept an optional `description` for secondary context.

<ComponentPreview name="Toast-Examples" />

## Duration

A toast dismisses itself after **4000ms**. Pass `duration` to change it for one
toast, or `duration: Infinity` to keep it until the user acts.

```js
toast.success('Saved')
toast.error('Could not save', { duration: 10000 })
toast.info('Uploading…', { duration: Infinity })
```

`ToastProvider` takes no props: position, styling and the default duration are
fixed, so every app's toasts look and behave the same.

## Types

`ToastOptions` is the options object every `toast.*` call takes, `ToastAction`
is its `action` / `cancel` button, and `ToastId` is what a call returns — pass
it back as `id` to update that toast in place.

```ts
import { toast, type ToastId, type ToastOptions } from 'frappe-ui'

function notifySaved(options?: ToastOptions): ToastId {
  return toast.success('Saved', options)
}
```

## With action

Add an `action` to give the user a way to respond. Combine with `duration: Infinity` for messages that should wait for an explicit decision.

<ComponentPreview name="Toast-Actions" />

## Custom icon

Pass a render function to `icon` to replace the default type icon — handy for branding moments, custom imagery, or domain-specific glyphs. Use the `lucide-*` class form for any Lucide icon; size and color are controlled with regular utilities (`size-4`, `text-ink-red-4`, …).

<ComponentPreview name="Toast-CustomIcon" />

## Asynchronous

Use `toast.promise` to wire a single toast to a promise lifecycle — the same row transitions through loading → success/error in place, no stacking.

`success` and `error` accept either a string or a callback that returns a string or full toast config. Returning an object unlocks `action`, `description`, `duration`, etc. — and lets the callback close over the resolved value (or thrown error) to wire up follow-ups like **Undo** on success or **Retry** on failure.

For multi-step progress without a single promise, pass an `id` to `toast.loading` / `toast.success` to update an existing toast in place.

<ComponentPreview name="Toast-Async" />
