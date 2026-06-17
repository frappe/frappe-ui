# Foundations Spec

Status: accepted direction for `frappe-ui` v1 (espresso v2 tokens).

This document defines the foundation layer of the design system — typography, focus, radius, color ramps — and the rules by which it stays aligned with Figma. Component specs ([`dialog.md`](./dialog.md), [`inputs.md`](./inputs.md), etc.) build on this.

Architectural calls in this spec are recorded as ADRs:

- [`adr/0007-typography-style-utilities.md`](./adr/0007-typography-style-utilities.md) — why named typography utilities (`text-{size}-medium`) exist instead of per-component overrides.
- [`adr/0005-focus-ring-2px.md`](./adr/0005-focus-ring-2px.md) — why focus rings are 2px.
- [`adr/0006-numbered-radius-tokens.md`](./adr/0006-numbered-radius-tokens.md) — why numbered radius tokens (`rounded-1`…`rounded-9`) are canonical and named aliases are deprecated.

## Source of truth

Figma is the source of truth. The current design file is **espresso 2.0**: <https://www.figma.com/design/kMYnZ9ougpSSQBdjZCgtdX/espresso-2.0>

Token export lives in [`espresso-v2-design-tokens/`](../espresso-v2-design-tokens/) and is consumed by [`tailwind/figma-tokens-to-theme.js`](../tailwind/figma-tokens-to-theme.js), which writes the generated theme JSON to [`tailwind/generated/`](../tailwind/generated/).

Anything in this repo that diverges from Figma is either (a) drift to be fixed, or (b) an intentional code-only extension explicitly listed in [§ Code-only extensions](#code-only-extensions). There is no third category.

## Decisions at a glance

| Decision | Direction |
|---|---|
| Source of truth | Figma file `espresso-2.0` |
| Typography model | Atomic size/weight/line-height tokens from Figma export, plus named-style utilities for composite styles |
| Named typography utilities | `text-{size}-medium` for sizes whose medium-variant tracking is confirmed in Figma. See [ADR-0007](./adr/0007-typography-style-utilities.md) |
| Focus indicator | `focus-visible:ring-2` + themed `ring-<color>`. No offset, no blur. See [ADR-0005](./adr/0005-focus-ring-2px.md) |
| Radius scale | Numbered tokens `rounded-0`…`rounded-9` are canonical. Named aliases (`rounded`, `rounded-md`, …) are deprecated. See [ADR-0006](./adr/0006-numbered-radius-tokens.md) |
| Color themes | Figma defines `default` (gray) and `red`. `blue` and `green` are code-only extensions (see below) |
| Component size scale | Figma defines `sm` / `md` / `lg`. `xs`, `xl`, and `2xl` are code-only extensions |

## Typography

### Token model

Atomic tokens are exported from Figma to [`tailwind/generated/typography.json`](../tailwind/generated/typography.json):

- `fontFamily` — `text: 'Inter Variable'`
- `fontSize` — keyed by size name (`tiny`, `2xs`, `xs`, `sm`, `base`, `md`, `lg`, `xl`, `2xl`, `3xl`, …), each paired with a `lineHeight`
- `fontWeight` — named weights: `regular: 400`, `medium: 500`, `semibold: 600`, `bold: 700`, `black: 800`

Letter-spacing is **not** exported from Figma — it is encoded by hand in [`tailwind/plugin.js`](../tailwind/plugin.js) via `FONT_SIZE_AUGMENT` (for the regular-weight variant of each size) and `FONT_SIZE_MEDIUM_TRACKING` (for the medium-weight variant).

### Named style utilities

Figma models typography as named styles (`text/base/regular`, `text/base/medium`, `text/lg/medium`, …) where medium-weight text is tracked tighter than regular at the same size. To preserve this in CSS, `tailwind/plugin.js` emits component utilities:

| Utility | font-size | line-height | weight | letter-spacing | Figma |
|---|---|---|---|---|---|
| `text-base-medium` | 14px | 16px | 500 | 0.015em (1.5%) | `text/base/medium` |
| `text-md-medium`   | 15px | 17px | 500 | 0.015em (1.5%) | `text/md/medium` |
| `text-lg-medium`   | 16px | 18px | 500 | 0.015em (1.5%) | `text/lg/medium` |

Regular-weight tracking is carried by the base `text-{size}` utility — there is no `text-{size}-regular` because it would be a redundant alias.

**Migration guidance**: components using `text-{size} font-medium` should migrate to `text-{size}-medium` where the named utility exists. Bare `text-{size} font-medium` continues to render correctly but drifts ~0.07–0.08px tighter than Figma intends.

See [ADR-0007](./adr/0007-typography-style-utilities.md) for the reasoning and the alternatives considered.

### Verified font-size tokens

Confirmed against Figma typography variables on `2026-05-24`:

| Tailwind size | font-size | line-height | Figma variable |
|---|---|---|---|
| `text-base`         | 14px | 16px | `text/base/regular` (with weight 420, ls 2%) |
| `text-base-medium`  | 14px | 16px | `text/base/medium` (weight 500, ls 1.5%) |
| `text-md`           | 15px | 17px | `text/md/regular` (with weight 420, ls 2%) |
| `text-md-medium`    | 15px | 17px | `text/md/medium` (weight 500, ls 1.5%) |
| `text-lg`           | 16px | 18px | (no Figma usage in component scope yet) |
| `text-lg-medium`    | 16px | 18px | `text/lg/medium` (weight 500, ls 1.5%) |

## Focus ring

All interactive components use `focus-visible:ring-2` paired with a themed `ring-<color>`:

| Theme | Ring color | Figma |
|---|---|---|
| gray (default) | `ring-outline-gray-3` | `focus/light/default` |
| red    | `ring-outline-red-3`   | `focus/light/red` |
| blue   | `ring-blue-400`         | code-only |
| green  | `ring-outline-green-3`  | code-only |

The ring is outset, no offset, no blur — matches Figma's 2px drop-shadow spec exactly.

See [ADR-0005](./adr/0005-focus-ring-2px.md).

## Radius

Numbered radius tokens are the canonical way to set border-radius. See [ADR-0006](./adr/0006-numbered-radius-tokens.md).

### Canonical (use these)

Generated from Figma `radius.*` tokens into [`tailwind/generated/radius.json`](../tailwind/generated/radius.json):

| Tailwind | px | Figma token |
|---|---|---|
| `rounded-0` | 0 | `radius/0` |
| `rounded-1` | 4 | `radius/1` |
| `rounded-2` | 5 | `radius/2` |
| `rounded-3` | 6 | `radius/3` |
| `rounded-4` | 8 | `radius/4` |
| `rounded-5` | 10 | `radius/5` |
| `rounded-6` | 12 | `radius/6` |
| `rounded-7` | 16 | `radius/7` |
| `rounded-8` | 20 | `radius/8` |
| `rounded-9` | 100 | `radius/9` |
| `rounded-none` | 0 | — (semantic alias for `rounded-0`) |
| `rounded-full` | 9999 | — (semantic, not on the scale) |

### Deprecated — flagged for migration

These aliases remain in `tailwind/generated/radius.json` so consumer apps keep working, but they are **not** to be used in new code. Migrate existing usages in `src/` to the numbered equivalent:

| Deprecated alias | Migrate to | px |
|---|---|---|
| `rounded` / `rounded-DEFAULT` | `rounded-4` | 8 |
| `rounded-sm` | `rounded-1` | 4 |
| `rounded-md` | `rounded-5` | 10 |
| `rounded-lg` | `rounded-6` | 12 |
| `rounded-xl` | `rounded-7` | 16 |
| `rounded-2xl` | `rounded-8` | 20 |

Migration is purely vocabulary — pixel values are identical. The aliases will be removed in the next breaking release.

To find usages: `grep -rE "rounded(-md|-lg|-xl|-2xl|-sm|-DEFAULT)?\\b" src/`. A bare `rounded` (not `rounded-N`) is the most common occurrence.

## Themes & colors

Figma espresso v2 defines two component color themes:

- **`default`** — the gray ramp (`surface-gray-*`, `ink-gray-*`, `outline-gray-*`)
- **`red`** — the red ramp (`surface-red-*`, `ink-red-*`, `outline-red-*`)

Both are exported via [`tailwind/colors.json`](../tailwind/colors.json) → [`tailwind/generated/colors.json`](../tailwind/generated/colors.json) and resolved to CSS variables by [`tailwind/colorPalette.js`](../tailwind/colorPalette.js).

Solid/subtle/outline/ghost ramps for these two themes are pixel-accurate to Figma.

## Code-only extensions

Extensions to the Figma spec that the library ships **intentionally**, not as drift:

| Extension | Where | Reason |
|---|---|---|
| `xs`, `xl`, `2xl` button sizes | `Button.vue` `sizeClasses` | Sizes outside Figma's `sm`/`md`/`lg` scale. `xs` (24px, `text-xs`, `rounded-3`) covers compact toolbars/badges-as-buttons; `xl`/`2xl` are pre-espresso-v2 sizes preserved for back-compat. No Figma reference — use at own risk; visual treatment may shift if Figma adds these later. |
| `blue`, `green`, (and other) themes | `Button.vue` `buttonClasses`, plus `Badge`, `Alert`, `Toast`, etc. | Semantic theming surface that pre-dates espresso v2. Figma currently only models `default` + `red` for components, but the underlying color ramps (blue, green, yellow, …) are first-class in the token export. |
| Letter-spacing per size | `tailwind/plugin.js` `FONT_SIZE_AUGMENT` | Figma exports `font.size`, `font.weight`, `font.line-height`, `font.family` — letter-spacing is composed in Figma styles but not in the token JSON. Encoded by hand. |
| Medium-variant tracking | `tailwind/plugin.js` `FONT_SIZE_MEDIUM_TRACKING` | Same — Figma composes it in named styles; we re-derive per size. Only sizes whose medium tracking is confirmed in Figma are listed. |

If Figma adds any of these later, the extensions become drift and should be reconciled.

## Verification process

When verifying a component against Figma:

1. Open the component frame in Figma Dev Mode. The Figma MCP server (`mcp__figma__*`) is the canonical way to read design specs — `get_design_context` for code+screenshot, `get_variable_defs` for token mappings.
2. Compare against the rendered component in the dev docs (Vite dev server on `:5173`). Use `getComputedStyle()` to read actual `letter-spacing`, `border-radius`, etc. — pixel comparison beats screenshot comparison for spacing/typography.
3. Drift falls into three buckets:
   - **Token drift** — a token value disagrees with Figma. Fix in the export pipeline or in `tailwind/plugin.js`.
   - **Component drift** — the component uses the wrong token. Fix in the component.
   - **Intentional extension** — must be listed in [§ Code-only extensions](#code-only-extensions). Add it there.

Latest full-component verifications:

| Component | Figma node | Date | Notes |
|---|---|---|---|
| `Button` (sm/md/lg) | [`25393-27651`](https://www.figma.com/design/kMYnZ9ougpSSQBdjZCgtdX/espresso-2.0?node-id=25393-27651) | 2026-05-24 | Pixel-accurate after ADR-0004 and ADR-0005. xs/xl/2xl + blue/green/etc. themes are code-only extensions. |
