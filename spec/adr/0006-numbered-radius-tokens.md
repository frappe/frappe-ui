# Numbered radius tokens are canonical

**Status**: accepted

## Context

Figma espresso v2 exposes border-radius as a numbered scale: `radius/0`, `radius/1`, … `radius/9`. The numbers are positions on the scale, not abstract sizes — `radius/4` is the 5th step (`8px`), `radius/5` is the 6th step (`10px`), and so on. The scale is dense and ordered: there are five distinct values in the 0–12px range alone.

The pre-Figma Tailwind preset used named radii — `sm`, `DEFAULT`, `md`, `lg`, `xl`, `2xl` — inherited from Tailwind's house scale but with rebound pixel values (`rounded-md` = 10px, not Tailwind's 6px; `rounded-lg` = 12px, not Tailwind's 8px). The current `tailwind/generated/radius.json` ships both: numbered tokens (`0`–`9`, `full`) **and** named aliases (`sm`, `DEFAULT`, `md`, `lg`, `xl`, `2xl`).

This creates two problems:

1. **Ambiguous mapping.** `rounded-md` exists in two design systems with two different values (Tailwind 6px vs frappe-ui 10px). Component authors reading `rounded-md` can't tell which scale they're in.
2. **Sparse coverage.** The named aliases skip steps. `radius/2` (5px), `radius/3` (6px), `radius/8` (20px) have no named equivalent. New components that need those values either reach for arbitrary classes (`rounded-[5px]`) or pick the wrong neighbor.

## Decision

Numbered radius tokens (`rounded-0` … `rounded-9`, plus `rounded-full`) are the **canonical** way to set border-radius in `frappe-ui`. All new code must use them.

Named aliases (`rounded-sm`, `rounded` / `rounded-DEFAULT`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`) remain in [`tailwind/generated/radius.json`](../../tailwind/generated/radius.json) as **deprecated migration aliases**. Existing usages must be migrated. New usages are not permitted.

The canonical mapping:

| Numbered token | px | Deprecated alias |
|---|---|---|
| `rounded-0` | 0 | `rounded-none` (kept; non-numbered but unambiguous) |
| `rounded-1` | 4 | `rounded-sm` |
| `rounded-2` | 5 | — |
| `rounded-3` | 6 | — |
| `rounded-4` | 8 | `rounded` / `rounded-DEFAULT` |
| `rounded-5` | 10 | `rounded-md` |
| `rounded-6` | 12 | `rounded-lg` |
| `rounded-7` | 16 | `rounded-xl` |
| `rounded-8` | 20 | `rounded-2xl` |
| `rounded-9` | 100 | — |
| `rounded-full` | 9999 | — (kept; semantically meaningful, not part of the scale) |

`rounded-none` and `rounded-full` are retained — they're semantic, not size-named, and have no numbered ambiguity.

## Rationale

- Numbered tokens preserve Figma's mental model exactly. A designer specifying `radius/5` and an engineer writing `rounded-5` are speaking the same vocabulary. The lookup table collapses.
- The named scale was a Tailwind-house decision adopted before the design system had its own scale. With espresso v2, the design system owns the scale; aliases keep the lookup table.
- Removing aliases entirely would break every consumer app immediately. Marking them deprecated lets us migrate the library and downstream apps incrementally, then drop the aliases in a later major version.
- Sparse named aliases skip the 5px and 6px steps. New components needing those values force either arbitrary classes or "round up to the nearest alias" drift. Numbered tokens cover every step.

## Consequences

- All component code in `src/` migrates to numbered tokens. `Button.vue` is the first migration; pattern is mechanical (`rounded` → `rounded-4`, `rounded-md` → `rounded-5`, …).
- Component specs and foundation docs use numbered tokens in examples.
- Named aliases (`sm`, `DEFAULT`, `md`, `lg`, `xl`, `2xl`) are kept in [`tailwind/generated/radius.json`](../../tailwind/generated/radius.json) so consumer apps don't break, but they're flagged for migration in [`foundations.md`](../foundations.md#radius) and should be removed in the next breaking release.
- `rounded` (bare, = `rounded-DEFAULT` = 8px) is the most common drift surface in the codebase — components that use it must migrate to `rounded-4`. The two render identically; the migration is purely vocabulary.
- ESLint rule or codemod to flag named aliases in `src/` is not built today; greppable. A future task can automate.
- The Figma export pipeline ([`tailwind/figma-tokens-to-theme.js`](../../tailwind/figma-tokens-to-theme.js)) is unchanged — numbered tokens already come straight from `radius.*` Figma tokens. The deprecated aliases live in `RADIUS_EXTRA` (or equivalent) in the build script; they should be moved to a clearly-marked deprecated section.
