# ADRs

Architecture decision records for durable `frappe-ui` API/design choices.

Specs describe the current contract. ADRs explain why decisions were made. Superseded ADRs are historical and are not current guidance.

| ADR | Status | Notes |
| --- | --- | --- |
| [0001 — Single `Dialog` component](./0001-single-dialog-component.md) | Accepted | One modal component; no separate `AlertDialog`. |
| [0002 — Imperative dialog resolves on click](./0002-imperative-dialog-caller-closes.md) | Superseded | Replaced by ADR-0003. Historical only. |
| [0003 — Imperative dialog uses `onConfirm`](./0003-imperative-dialog-onconfirm.md) | Accepted | Current imperative dialog lifecycle. |
| [0004 — Editor composition model](./0004-editor-family-composition-model.md) | Accepted | One `<TextEditor>` + kits at `frappe-ui/editor`; no ready-mades. |
| [0005 — 2px focus ring](./0005-focus-ring-2px.md) | Accepted | `focus-visible:ring-2` matches Figma's 2px focus shadow. |
| [0006 — Numbered radius tokens](./0006-numbered-radius-tokens.md) | Accepted | `rounded-1`…`rounded-9` are canonical; named aliases deprecated. |
| [0007 — Named typography style utilities](./0007-typography-style-utilities.md) | Accepted | `text-{size}-medium` utilities for Figma's medium-weight tracking. |
