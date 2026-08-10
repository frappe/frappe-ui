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
| [0008 — No deprecated members in `1.0.0`](./0008-no-deprecated-members-in-1-0-0.md) | Accepted | Everything `@deprecated` is deleted before the stable tag. |
| [0009 — Client filtering is opt-out](./0009-client-filtering-is-opt-out.md) | Accepted | `filterable` exists so server-driven options aren't filtered twice. |
| [0010 — Subpath export rule](./0010-subpath-export-rule.md) | Accepted | Root is the default; a subpath is earned by cost isolation, an extensible registry, or a name collision — not part count or organization. |
| [0011 — The at-bar checklist](./0011-at-bar-checklist.md) | Accepted | Defines "at bar for `1.0.0`" — one tier, per public export. Checklist in [`at-bar.md`](../at-bar.md). |
| [0012 — The template-ref surface](./0012-template-ref-surface.md) | Accepted | A member earns its place only when parent script needs it and no other surface reaches; `open`/`close` are for overlays that own their trigger. Contract in [`imperative-api.md`](../imperative-api.md). |
| [0013 — v1 resources implementation freeze](./0013-v1-resources-implementation-freeze.md) | Accepted | The 11 v1 resource exports are permanently exempt from at-bar item 1 (TypeScript); tests, docs, and `1.x` bug fixes stay in, renames/signature changes/additions stay out until `2.0.0`. Grants nothing to any other export. |
| [0014 — Chart props are flat and name the columns](./0014-flat-props-name-columns.md) | Accepted | One tag, plain-data props, no `config` object — a saved chart is spread with `v-bind`. Rejects composition and grammar-of-graphics. |
| [0015 — What enters the chart family](./0015-what-enters-charts.md) | Accepted | How the 2026-08-05 Insights audit was decided, case by case. Conventions and the rule live in [`charts.md`](../charts.md). |
| [0016 — Charts hand back the echarts instance](./0016-charts-expose-echarts-instance.md) | Accepted | `ChartExposed` is the second and last §2.4 exception: `echartOptions` reaches every option key and no instance method, and `getInstanceByDom` reaches the instance anyway. Limits in [`charts.md`](../charts.md). |
