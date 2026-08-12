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
- [`shortcuts.md`](./shortcuts.md) — `useKeyboardShortcut`,
  `KeyboardShortcutsDialog`, `KeyboardShortcut`: the combo grammar, precedence,
  and the registry the three share
- [`charts.md`](./charts.md) — the conventions the chart family
  (`frappe-ui/charts`) is built on, the rule that decides what enters it, and
  the plot/chrome split. The API itself is documented on the docs site. The
  shape it takes is [ADR-0014](./adr/0014-flat-props-name-columns.md), and what
  the family admits is [ADR-0015](./adr/0015-what-enters-charts.md)

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
- [`portal-target.md`](./portal-target.md) — where an overlay teleports, and how
  an embedding host redirects every overlay at once. Concerns embedded builds
  only. A test enforces the component-side rule. **Accepted.**

## ADRs

See [`adr/README.md`](./adr/README.md).
