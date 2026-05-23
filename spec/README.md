# Specs

Current API contracts and durable design decisions for `frappe-ui`.

## Source of truth order

1. Specs in this directory — current public API contracts.
2. Accepted ADRs in [`adr/`](./adr/) — rationale and decision history.
3. [`CONTEXT.md`](../CONTEXT.md) — short repo map and shared vocabulary.
4. Research and release notes in [`v1-release/`](../v1-release/) — evidence, migration, and execution history.

If these disagree, update the lower-authority document or mark it historical.

## Foundations

- [`foundations.md`](./foundations.md) — typography, focus, radius, color themes; Figma source-of-truth rules.

## Component specs

- [`dialog.md`](./dialog.md)
- [`toast.md`](./toast.md)
- [`editor.md`](./editor.md)
- [`inputs.md`](./inputs.md)
- [`date-picker.md`](./date-picker.md)
- [`selection.md`](./selection.md)
  - [`item-list-row.md`](./item-list-row.md)
  - [`dropdown.md`](./dropdown.md)
  - [`select.md`](./select.md)
  - [`combobox.md`](./combobox.md)
  - [`multiselect.md`](./multiselect.md)

## ADRs

See [`adr/README.md`](./adr/README.md).
