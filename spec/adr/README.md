# ADRs

Architecture decision records for durable `frappe-ui` API/design choices.

Specs describe the current contract. ADRs explain why decisions were made. Superseded ADRs are historical and are not current guidance.

| ADR | Status | Notes |
| --- | --- | --- |
| [0001 — Single `Dialog` component](./0001-single-dialog-component.md) | Accepted | One modal component; no separate `AlertDialog`. |
| [0002 — Imperative dialog resolves on click](./0002-imperative-dialog-caller-closes.md) | Superseded | Replaced by ADR-0003. Historical only. |
| [0003 — Imperative dialog uses `onConfirm`](./0003-imperative-dialog-onconfirm.md) | Accepted | Current imperative dialog lifecycle. |
| [0004 — Editor primitives + ready-mades](./0004-editor-family-primitives-and-readymades.md) | Accepted | Editor family lives at `frappe-ui/editor`. |
