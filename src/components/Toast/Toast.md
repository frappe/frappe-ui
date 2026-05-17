# Toast

A transient notification used to provide feedback for actions, success states, warnings, or errors.

Use the `toast` helper anywhere in your app to trigger a notification — no setup needed beyond mounting `FrappeUIProvider` once at the root.

<ComponentPreview name="Toast-Quickstart" layout="stacked" />

## Examples

Toasts come in four visual types — `message`, `info`, `success`, `warning`, and `error` — and accept an optional `description` for secondary context.

<ComponentPreview name="Toast-Examples" />

## With action

Add an `action` to give the user a way to respond. Combine with `duration: Infinity` for messages that should wait for an explicit decision.

<ComponentPreview name="Toast-Actions" />

## Custom icon

Pass a render function to `icon` to replace the default type icon — handy for branding moments, custom imagery, or domain-specific glyphs. Use the `lucide-*` class form for any Lucide icon; size and color are controlled with regular utilities (`size-4`, `text-ink-red-2`, …).

<ComponentPreview name="Toast-CustomIcon" />

## Asynchronous

Use `toast.promise` to wire a single toast to a promise lifecycle, or pass an `id` to update an existing toast in place — useful for multi-step progress.

<ComponentPreview name="Toast-Async" />
