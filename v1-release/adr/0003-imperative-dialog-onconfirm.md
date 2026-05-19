# Imperative dialog API uses `onConfirm` with auto-close

**Status**: accepted. Supersedes [ADR-0002](./0002-imperative-dialog-caller-closes.md).

## Context

[ADR-0002](./0002-imperative-dialog-caller-closes.md) evaluated three lifecycle contracts for the imperative dialog API and chose option #3: "Resolve on click, dialog stays open until the caller calls `close()`". During implementation and codebase rollout, this contract was reversed in favour of option #2: "Auto-close after an optional `onConfirm` callback resolves, with throw-to-keep-open" — the pattern used by Naive UI.

This ADR records the reversal so future contributors understand why the shipping implementation in `src/utils/dialog.ts` diverges from ADR-0002's stated decision.

## Decision

The imperative helpers (`dialog.confirm`, `dialog.danger`, `dialog.prompt`) take an `onConfirm` callback that receives `{ close, setError }` (and `values` for prompt). The lifecycle:

- `onConfirm` **resolves** → dialog **auto-closes**.
- `onConfirm` **throws / rejects** → dialog **stays open**, thrown message rendered inline as an error, buttons re-enabled.
- `onConfirm` calls `ctx.close()` early → dialog closes immediately; the trailing auto-close is an idempotent no-op.

```ts
dialog.confirm({
  title: 'Delete?',
  onConfirm: async () => {
    await api.deleteFile()
    // auto-closes here
  },
})
```

Each helper returns a synchronous `DialogHandle` (`{ close }`) so callers can dismiss the dialog programmatically — e.g., from a socket event — without depending on Promise resolution.

## Rationale for reversing ADR-0002

ADR-0002 rejected option #2 with two concerns. Implementation experience reversed both:

1. **"Callback-context pattern reintroduces what we're moving away from in `actions[]`."**
   The shipping declarative `actions[]` API uses `(ctx: DialogControl) => void | Promise<void>` — the **same shape** as `onConfirm`. So `onConfirm` is consistent with `actions[i].onClick`, not divergent from it. One mental model, not two.

2. **"Caller-controlled close is more explicit and safer."**
   In practice every confirm/delete call site ended up writing the same two-line `await api.x(); close()` boilerplate. Migrating gameplan alone (16 destructive call sites — see `commit acc50047` and the surrounding refactor) removed dozens of lines of plumbing because auto-close became the default. The "explicit `close()`" path optimised for a flexibility that callers didn't actually use.

Additional considerations the implementation surfaced:

- **Throw-to-stay-open routes server-side validation errors cleanly.** Server says "username taken"? Throw `new Error('...')`. The thrown message flows through `extractErrorMessage` (which handles Frappe's `{ messages: [...] }` envelope, plain `Error.message`, and string rejections) and renders inline. The dialog re-enables for retry. ADR-0002 only used inline rendering for the post-cancel path; the new contract makes it the canonical pattern for all in-handler failures.
- **Programmatic close is preserved.** The synchronous `DialogHandle` return covers the "close from outside the callback" case ADR-0002 emphasised — e.g., a socket event that should dismiss an upload dialog. Callers haven't lost lifecycle control; they've lost only the forced ceremony.
- **Forgotten close calls are no longer a class of bug.** ADR-0002 accepted "forgotten `close()` leaves the dialog open forever" as the cost of explicit control. That class of bug doesn't exist under the new contract — `close()` runs whenever `onConfirm` resolves.

## Consequences

- ADR-0002's "this contract is unusual" warning no longer applies. The shipping API matches Naive UI's `dialog.warning` pattern, which most frontend developers already recognise.
- **`setError` is the lone vestige of the ADR-0002 design.** It's still passed to `onConfirm` via the `ctx` arg for niche uses (clearing a stale error from outside the immediate flow), but calling it from inside `onConfirm` without throwing does **not** prevent the auto-close. Throw to stay open. The `src/components/Dialog/stories/Imperative.vue` story documents this matrix explicitly because it surprised early users.
- **The new failure mode**: forgetting to throw on a validation failure. The dialog closes when the developer expected an error to keep it open. The migration guide (Section 7) and the `Imperative.vue` story both call this out.
- **`dialog.alert` was never implemented.** ADR-0002 listed it as a planned helper; the actual `dialog` namespace exports only `confirm`, `danger`, and `prompt`. Use `dialog.confirm({ actions: [{ label: 'OK', variant: 'solid' }] })` for one-button acknowledgements until/unless a dedicated `alert` is added in a future minor.

## Related code

- Implementation: `src/utils/dialog.ts` — `makeClose`, `makeSetError`, the `try { await onConfirm(...); close() } catch { setError(...) }` shape in `confirm()`, `prompt()`, and `makeActionRunner()`.
- Story: `src/components/Dialog/stories/Imperative.vue` — covers auto-close, optimistic close, throw-to-stay-open, custom `actions[]`, `danger` preset, and the close-behaviour matrix in a single comment block.
- User-facing docs: `v1-release/migration.md` Dialog section walkthrough 7, `v1-release/08f-dialog-spec.md` "Imperative API".
