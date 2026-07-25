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
- [`selection.md`](./selection.md)
  - [`item-list-row.md`](./item-list-row.md)
  - [`dropdown.md`](./dropdown.md)
  - [`select.md`](./select.md)
  - [`combobox.md`](./combobox.md)
  - [`multiselect.md`](./multiselect.md)

## Freeze work

- [`imperative-api.md`](./imperative-api.md) — library-wide audit of what
  components hand back through a template ref (`defineExpose` — 28 sites, 4
  typed). Proposes five verbs, a policy for when and how a component may hand
  back a DOM element, and a required `*Exposed` type. Excludes `frappe/`,
  `ListView`, and `Calendar`. **Proposed.**

- [`selection-api-finalization.md`](./selection-api-finalization.md) — audit
  and freeze plan for the shipped `Select` / `MultiSelect` / `Combobox`
  surface. Reverses the deprecation policy in `selection.md` §13: nothing
  `@deprecated` ships in `1.0.0`, including `Autocomplete`. The library-wide
  sweep proceeds one component family at a time; this is the first.

## ADRs

See [`adr/README.md`](./adr/README.md).
