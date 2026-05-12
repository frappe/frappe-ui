# Imperative dialog API resolves on click; caller calls `close()`

**Status**: accepted

## Context

The v1 imperative dialog API exposes Promise-based helpers: `dialog.confirm()`, `dialog.alert()`, `dialog.prompt()`. Most libraries in this space (SweetAlert, Element Plus's `MessageBox`, Naive UI's `dialog.warning`, etc.) auto-close the dialog when the user picks an action and resolve the Promise once it's closed.

We considered three lifecycle contracts:

1. **Auto-close on click, Promise resolves to a boolean** (industry default).
2. **Auto-close after an optional `onConfirm` callback resolves**, with throw-to-keep-open (Naive UI's pattern).
3. **Resolve on click, dialog stays open until the caller calls `close()`** (custom).

## Decision

The imperative helpers resolve **on click**, with a `close()` callback in the resolved object. The dialog stays open until the caller calls `close()` themselves. The confirm/submit button auto-shows a loading state from the moment of click until `close()` is called.

```ts
const { ok, close } = await dialog.confirm({ title: 'Delete?' })
if (ok) {
  await api.deleteFile()
}
close()
```

On cancel, the dialog auto-closes and the Promise resolves with `ok: false` / `values: null`. Calling `close()` after cancel is a no-op.

## Rationale

- The async-confirm pattern is common in real apps (gameplan, insights both have confirm-then-API-call flows). Auto-closing the dialog before async work runs leaves the user looking at the underlying page with no feedback while a network call is in flight — bad UX.
- Promise-with-`onConfirm`-callback works, but reintroduces the callback-context pattern we're explicitly migrating away from in the declarative `actions` API. We want one mental model for both.
- Caller-controlled close gives the caller full lifecycle control without callbacks: any error handling, retries, or follow-up UI happens between the `await` and the `close()`.
- Auto-loading on the action button (provided by the helper, not the caller) covers the one thing the caller can't easily do from outside the dialog. This compromise keeps the caller's code simple while still showing in-flight state.

## Consequences

- This contract is **unusual** — callers coming from other libraries will be surprised that `await dialog.confirm()` returns while the dialog is still on screen. Documentation must lead with the contract, not bury it.
- A forgotten `close()` call leaves the dialog open forever. This is the caller's bug; we accept it as the cost of explicit control.
- Reversing this decision later (switching to auto-close) is a breaking change for every caller. The cost of getting it wrong is high — recorded here so future contributors understand the trade-off.
