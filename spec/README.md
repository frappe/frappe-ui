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
- [`popover.md`](./popover.md)
- [`hover-card.md`](./hover-card.md)
- [`selection.md`](./selection.md) — `Select`, `Combobox`, `MultiSelect`
- [`dropdown.md`](./dropdown.md) — the action menu
- [`item-list-row.md`](./item-list-row.md) — the row shell both families use
- [`charts.md`](./charts.md) — the chart family (`frappe-ui/charts`); gaps vs
  the old charts in [`charts-parity.md`](./charts-parity.md)

## Freeze work

- [`at-bar.md`](./at-bar.md) — what "at bar for `1.0.0`" means. The one checklist
  every sweep ticket on the [road to `1.0.0`](https://github.com/frappe/frappe-ui/issues/864)
  applies, per public export. **Accepted.**
- [`imperative-api.md`](./imperative-api.md) — the contract for what components
  hand back through a template ref (`defineExpose` — 31 sites, 4 typed). Five
  verbs, a policy for when and how a component may hand back a DOM element, and
  a required `*Exposed` type. A member earns its place only when parent script
  needs it and no other surface reaches. Excludes `frappe/`, `ListView`, and
  `Calendar`. **Accepted** — [ADR-0012](./adr/0012-template-ref-surface.md).

## ADRs

See [`adr/README.md`](./adr/README.md).
