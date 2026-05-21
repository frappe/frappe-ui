# Single `Dialog` component (no separate `AlertDialog`)

**Status**: accepted

## Context

The `frappe-ui` library wraps `reka-ui`, which ships `Dialog` and `AlertDialog` as two distinct components — matching the Radix/ARIA convention where `role="alertdialog"` denotes a dialog that interrupts the user with a message requiring response (e.g. destructive confirms), while `role="dialog"` is the generic modal.

When designing the v1 Dialog API and the imperative `dialog.confirm/alert/prompt` helpers, we had to choose whether to expose this split:

- **Two public components**: `<Dialog>` for generic modals + `<AlertDialog>` for forced-response confirms. Imperative helpers mount `<AlertDialog>`.
- **One public component**: `<Dialog>` handles everything; ARIA semantics are derived from props.

## Decision

Ship **one** public component, `<Dialog>`, with `role="dialog"` always. There is no `<AlertDialog>` component in the public surface. Forced-response semantics are expressed via `dismissable: false` + explicit actions, not via a different ARIA role.

The imperative `dialog.*` helpers internally mount the same `<Dialog>` with `dismissable: false`.

## Rationale

- A separate `<AlertDialog>` would mostly be a thin wrapper of `<Dialog>` with `dismissable: false` + focused cancel button. The duplication adds API surface (a second component to document, story, test, and freeze for v1) for a small semantic gain.
- An attempted heuristic to auto-derive `role="alertdialog"` (e.g. "set role when `dismissable: false`") gives the wrong role for legitimate non-dismissable modals like multi-step wizards or mandatory-completion forms. The signal "must respond" isn't structurally distinguishable from "must complete this step."
- Screen readers in practice surface `dialog` and `alertdialog` very similarly. The accessibility win is marginal.
- "One Dialog" is consistent with the plan's principle of keeping component boundaries narrow and avoiding API breadth before freeze.

## Consequences

- App authors reaching for a destructive-confirm pattern set `dismissable: false` and label their actions clearly. They do not get `role="alertdialog"`.
- Imperative helpers (`dialog.confirm/alert/prompt`) always render `role="dialog"`. This is a deliberate accessibility trade-off.
- If we later need `role="alertdialog"` semantics — e.g. for compliance with a specific audit — we can add a `role` prop additively without breaking callers. Reversal is non-destructive.
