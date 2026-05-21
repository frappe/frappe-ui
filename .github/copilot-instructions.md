---
description: 'frappe-ui library development guidance'
applyTo: 'src/**, docs/**, vite/**, tailwind/**, icons/**, frappe/**, spec/**, v1-release/**'
---

# frappe-ui Copilot instructions

`frappe-ui` is a Vue 3 component library and utilities package for Frappe-based apps. Treat it as a reusable library, not an app codebase.

## Read order

1. [`CONTEXT.md`](../CONTEXT.md) — repo map and shared vocabulary.
2. [`PHILOSOPHY.md`](../PHILOSOPHY.md) — API design rules.
3. [`spec/README.md`](../spec/README.md) — current specs and ADR index.
4. The relevant `spec/*.md` file before changing public component APIs.
5. [`v1-release/README.md`](../v1-release/README.md) for release execution, migration, changelog, and research.

If docs conflict, prefer:

```txt
spec/*.md > accepted ADRs > PHILOSOPHY.md > CONTEXT.md > v1-release research/plan
```

## Working rules

- Preserve backwards compatibility unless a spec explicitly calls for a breaking v1 change or deprecation path.
- Prefer small, focused changes over broad rewrites.
- New or modernized Vue components should use TypeScript and `<script setup lang="ts">`.
- Public component APIs need typed props/emits/slots/exposed surfaces and useful JSDoc.
- Use semantic Tailwind tokens (`surface-*`, `ink-*`, `outline-*`) instead of hardcoded colors.
- Prefer stable styling hooks (`data-slot`, `data-state`, `data-size`, `data-variant`, `data-disabled`) over DOM/class assumptions.
- Accessibility, keyboard behavior, focus management, and ARIA semantics are part of done.
- Update docs, stories, tests, and changelog/migration notes when public behavior changes.

## Component API rules

Follow [`PHILOSOPHY.md`](../PHILOSOPHY.md) and the relevant spec.

## Area-specific pointers

- Selection/menu: [`spec/selection.md`](../spec/selection.md)
- Dialog: [`spec/dialog.md`](../spec/dialog.md)
- Inputs: [`spec/inputs.md`](../spec/inputs.md)
- Date/time pickers: [`spec/date-picker.md`](../spec/date-picker.md)
- Toast: [`spec/toast.md`](../spec/toast.md)
- ADR status: [`spec/adr/README.md`](../spec/adr/README.md)
- v1 release execution: [`v1-release/`](../v1-release/)

## Do not

- Invent new public API vocabulary without checking `PHILOSOPHY.md` and `spec/`.
- Treat `v1-release/research/` as the current contract.
- Expand legacy compatibility APIs casually.
- Make broad repo-wide refactors unless explicitly requested.
- Optimize for app-local convenience at the expense of reusable-library stability.
