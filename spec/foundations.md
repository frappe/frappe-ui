# Foundations Spec

Status: accepted direction for `frappe-ui` v1 (espresso v2 tokens).

This document defines the foundation layer of the design system — typography, focus, radius, color ramps — and the rules by which it stays aligned with Figma. Component specs ([`dialog.md`](./dialog.md), [`inputs.md`](./inputs.md), etc.) build on this.

Architectural calls in this spec are recorded as ADRs:

- [`adr/0007-typography-style-utilities.md`](./adr/0007-typography-style-utilities.md) — why named typography utilities (`text-{size}-{weight}`) exist instead of per-component overrides.
- [`adr/0005-focus-ring-2px.md`](./adr/0005-focus-ring-2px.md) — why focus rings are 2px.
- [`adr/0006-numbered-radius-tokens.md`](./adr/0006-numbered-radius-tokens.md) — why numbered radius tokens (`rounded-1`…`rounded-9`) are canonical and named aliases are deprecated.

## Source of truth

Figma is where token values are **decided**. The current design file is **espresso 2.0**: <https://www.figma.com/design/kMYnZ9ougpSSQBdjZCgtdX/espresso-2.0>

[`tailwind/tokens/`](../tailwind/tokens/) is where they are **recorded**. Four files hold the Figma tokens: `colors.json`, `radius.json`, `typography.json` and `effects.json`. They are the canonical source. [`tailwind/tokens.js`](../tailwind/tokens.js) reads them, and adds `spacing` and `screens`, which Figma does not define.

[`tailwind/tokens/build.js`](../tailwind/tokens/build.js) writes those four files from the Figma export. It also writes [`provenance.json`](../tailwind/tokens/provenance.json): the Figma file id and a sha256 per input file. The raw export is not committed; it is an input, not a record. `provenance.json` answers which export produced the current values.

`build.js` overrules the export in places, so the export alone does not state what frappe-ui uses. `RADIUS_OVERRIDE` and `FONT_WEIGHT_MAP` change values; both are listed in [§ Code-only extensions](#code-only-extensions) and enforced in `build.js`. `DROPPED_SIZES` and `DROPPED_CUSTOM_ELEVATIONS` drop tokens with no call sites (#940). The hex-to-oklch conversion and the shadow layer reversal change format, not value.

### Re-syncing from Figma

1. Export from Figma into `.figma-export/`. The directory is gitignored.
2. Run `yarn sync-tokens`. It writes the four token files, `provenance.json`, and `tailwind/tokens.d.ts`.
3. Review the diff on `tailwind/tokens/*.js`. A key added or removed also moves `tokens.d.ts`; a value that only changed does not.
4. Commit.

`tokens.d.ts` is generated from `tokens.js`, not from the export, so an edit to `tokens.js` alone re-syncs with `yarn sync-token-types`. A committed file that differs from the generator's output fails `tailwind/tokens/build.test.js`.

Keep a token sync and an edit to `build.js` in separate commits. That separation is the only remaining signal that tells a reviewer whether a value moved because Figma moved or because the rules in `build.js` moved.

Anything in this repo that diverges from Figma is either (a) drift to be fixed, or (b) an intentional code-only extension explicitly listed in [§ Code-only extensions](#code-only-extensions). There is no third category.

## Decisions at a glance

| Decision | Direction |
|---|---|
| Source of truth | Values decided in Figma file `espresso-2.0`, recorded in `tailwind/tokens/*.js` |
| Typography model | Size, line-height and per-weight letter-spacing, generated from the Figma text-styles export. Weight names are mapped in code |
| Named typography utilities | `text-{size}-{weight}` and `text-p-{size}-{weight}`, generated for every exported style. See [ADR-0007](./adr/0007-typography-style-utilities.md) |
| Focus indicator | A global `:focus-visible` outline from `--focus-outline-default`, retheme with `focus-visible:focus-ring-<color>`. No offset, no blur. See [ADR-0005](./adr/0005-focus-ring-2px.md) |
| Radius scale | Numbered tokens `rounded-0`…`rounded-9` are canonical. Named aliases (`rounded`, `rounded-md`, …) are removed. See [ADR-0006](./adr/0006-numbered-radius-tokens.md) |
| Color themes | Figma defines `default` (gray) and `red`. `blue` and `green` are code-only extensions (see below) |
| Component size scale | Figma defines `sm` / `md` / `lg`. `xs`, `xl`, and `2xl` are code-only extensions |

## Typography

### Token model

The type scale is generated from the Figma **text-styles** export
(`text.styles.tokens.json`) by
[`tailwind/tokens/build.js`](../tailwind/tokens/build.js),
which writes [`tailwind/tokens/typography.js`](../tailwind/tokens/typography.js).
The variable export (`Typography.Desktop`) is not used for it: it rounds
line-heights to px and drops per-size letter-spacing.

The generated file holds:

- `fontFamily` — `text: 'Inter Variable'`
- `fontSize` — one entry per size, each carrying the regular style's `lineHeight` as a unitless ratio, its `letterSpacing` in `em`, and `fontWeight`. The scale is `2xs` 11px, `xs` 12, `sm` 13, `base` 14, `md` 15, `lg` 16, `xl` 17, `2xl` 18, `3xl` 20, `4xl` 24, then `5xl`–`12xl` at 26, 28, 32, 40, 44, 48, 52, 56. `tiny` and `13xl`–`16xl` are dropped as unused (#940)
- `paragraph` — the paragraph family's looser `lineHeight` and its own `letterSpacing`, for `2xs` through `4xl`
- `tracking` — letter-spacing per (size, weight), for the text family and the paragraph family separately. This is the only property that varies by weight
- `fontWeight` — `regular: 420`, `medium: 500`, `semibold: 600`, `bold: 700`, `black: 800`

Weights are the one part not read from the export. `FONT_WEIGHT_MAP` in the
generator holds them, because the export's weight column is corrupt: the body
styles use Inter's Thin named instance with a `wght`-axis override, which the
exporter discards. Regular's **420** is the only real customization; the rest are
the standard Inter weights.

### Named style utilities

Figma models typography as named styles (`text/base/regular`, `text/base/medium`,
`paragraph/base/medium`, …), and text of one size is tracked differently per
weight. CSS letter-spacing cannot follow `font-weight`, so
`buildTextStyleUtilities()` in [`tailwind/plugin.js`](../tailwind/plugin.js)
emits a self-contained component class for each one:

| Family | Utilities | Sizes |
|---|---|---|
| Text | `text-{size}` (regular), `text-{size}-{medium,semibold,bold}` | `2xs` … `12xl` |
| Paragraph | `text-p-{size}` (regular), `text-p-{size}-{medium,semibold,bold}` | `2xs` … `4xl` |

Each weighted class sets `font-size`, `line-height`, `font-weight` and that
weight's `letter-spacing`. Regular is the bare utility, which already carries
weight 420 and the regular tracking, so there is no `text-{size}-regular`. No
`black` class is emitted: it was removed in #998 with zero usage, and the exported
weight behind it was corrupt.

Generated values, as an illustration of the shape:

| Utility | font-size | line-height | weight | letter-spacing |
|---|---|---|---|---|
| `text-base` | 14px | 1.15 | 420 | 0.02em |
| `text-base-medium` | 14px | 1.15 | 500 | 0.015em |
| `text-p-base` | 14px | 1.5 | 420 | 0.02em |
| `text-p-base-medium` | 14px | 1.5 | 500 | 0.015em |

**Migration guidance**: use one class, not two. `text-{size} font-{weight}` keeps
the regular tracking and so does not match the named style. The `tokens-v2`
codemod ([`tailwind/migrate-tokens-v2.js`](../tailwind/migrate-tokens-v2.js))
merges a co-located size and weight class in a static class list, and drops
`font-normal` because the bare utility is already regular. Adding a `font-*`
class after a weighted class reintroduces the same mismatch.

See [ADR-0007](./adr/0007-typography-style-utilities.md) for the reasoning and the alternatives considered.

**Historical.** Before `b8c232a6dc`, only `text-base-medium`, `text-md-medium` and
`text-lg-medium` existed, hand-encoded in `plugin.js` from Figma observation, and
letter-spacing was not read from the export at all. Those maps are gone.

## Focus ring

A global `:focus-visible` rule in the plugin's base layer draws the ring, so a
component declares nothing. Retheme with `focus-visible:focus-ring-<color>`,
suppress with `focus-visible:outline-none`.

| Utility | Variable | Figma |
|---|---|---|
| `focus-ring` (default) | `--focus-outline-default` | `focus/light/default` |
| `focus-ring-red` | `--focus-outline-red` | `focus/light/red` |
| `focus-ring-green` | `--focus-outline-green` | `focus/light/green` |
| `focus-ring-amber` | `--focus-outline-amber` | `focus/light/amber` |
| `focus-ring-blue` | `--focus-outline-blue` | `focus/light/blue` |
| `focus-ring-violet` | `--focus-outline-violet` | `focus/light/violet` |

The ring is an `outline`, outset, no offset, no blur: 2px light, 3px dark. The
matching `--focus-<name>` box-shadow variables are not emitted.

See [ADR-0005](./adr/0005-focus-ring-2px.md).

## Radius

Numbered radius tokens are the canonical way to set border-radius. See [ADR-0006](./adr/0006-numbered-radius-tokens.md).

### Canonical (use these)

Generated from Figma `radius.*` tokens into [`tailwind/tokens/radius.js`](../tailwind/tokens/radius.js):

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

### Removed aliases

The named size aliases were removed in `1.0.0` (#998, per ADR-0006/ADR-0008). They emit no CSS anymore — a leftover alias is a silent no-op:

| Removed alias | Replacement | px |
|---|---|---|
| `rounded` / `rounded-DEFAULT` | `rounded-4` | 8 |
| `rounded-sm` | `rounded-1` | 4 |
| `rounded-md` | `rounded-5` | 10 |
| `rounded-lg` | `rounded-6` | 12 |
| `rounded-xl` | `rounded-7` | 16 |
| `rounded-2xl` | `rounded-8` | 20 |

Replacement is purely vocabulary — pixel values are identical. The `tokens-v2` codemod ([`tailwind/migrate-tokens-v2.js`](../tailwind/migrate-tokens-v2.js)) performs these renames, directional forms included.

To find leftovers: `grep -rPn 'rounded(-(sm|md|lg|xl|2xl|DEFAULT))?(?![-\w])' src/`. The lookahead keeps migrated tokens (`rounded-4`) out of the results; a bare `rounded` (not `rounded-N`) is the most common leftover.

## Themes & colors

Figma espresso v2 defines two component color themes:

- **`default`** — the gray ramp (`surface-gray-*`, `ink-gray-*`, `outline-gray-*`)
- **`red`** — the red ramp (`surface-red-*`, `ink-red-*`, `outline-red-*`)

Both are recorded in [`tailwind/tokens/colors.js`](../tailwind/tokens/colors.js) and resolved to CSS variables by `cssVariables` in [`tailwind/tokens.js`](../tailwind/tokens.js). [`tailwind/colorPalette.js`](../tailwind/colorPalette.js) shapes the same values for the Tailwind theme.

Solid/subtle/outline/ghost ramps for these two themes are pixel-accurate to Figma.

### Semantic tokens are the default

Semantic tokens (`surface-*`, `ink-*`, `outline-*`) flip under
`[data-theme="dark"]`, so one class is correct in both modes. Raw shades
(`gray-3`, `dark-gray-3`) are fixed colors and are reserved for values that
must not follow the theme, such as the editor's font-color swatches. The dark
raw ramp is not a mirror of the light one: it runs in reverse and has an extra
`450` step.

### The `alpha` name

`alpha` is a suffix on the group key, which is how Figma names it. Raw families
are `{hue}-alpha-{shade}` (`gray-alpha-100`) and semantic families are
`{category}-alpha-{hue}-{step}` (`surface-alpha-gray-2`). No rename is planned:
the names match Figma and Frappe's own espresso variables, and the position
carries no meaning a rename would recover. The overlay ramps
(`white-overlay-*`, `black-overlay-*`) keep their word, which Figma spells
`alpha`.

Tailwind's `/50` modifier applies to the semantic alpha classes only. The raw
alpha and overlay values already carry an alpha channel.

## Code-only extensions

Extensions to the Figma spec that the library ships **intentionally**, not as drift:

| Extension | Where | Reason |
|---|---|---|
| `xs`, `xl`, `2xl` button sizes | `Button.vue` `sizeClasses` | Sizes outside Figma's `sm`/`md`/`lg` scale. `xs` (24px, `text-xs`, `rounded-3`) covers compact toolbars/badges-as-buttons; `xl`/`2xl` are pre-espresso-v2 sizes preserved for back-compat. No Figma reference — use at own risk; visual treatment may shift if Figma adds these later. |
| `blue`, `green`, (and other) themes | `Button.vue` `buttonClasses`, plus `Badge`, `Alert`, `Toast`, etc. | Semantic theming surface that pre-dates espresso v2. Figma currently only models `default` + `red` for components, but the underlying color ramps (blue, green, yellow, …) are first-class in the token export. |
| Font weights | `tailwind/tokens/build.js` `FONT_WEIGHT_MAP` | The text-styles export's weight column is corrupt, so the five weights are named in code instead. Only regular's 420 differs from a standard Inter weight. |
| `radius/9` = 100px | `tailwind/tokens/build.js` `RADIUS_OVERRIDE` | The token exports as 999px, a second pill radius beside `rounded-full`. Held at 100px until the Figma variable is corrected (ADR-0006). |

If Figma adds any of these later, the extensions become drift and should be reconciled.

Letter-spacing was a code-only extension until `b8c232a6dc`. It now comes from the
text-styles export, per size and per weight, and the hand-encoded maps are gone.

## Verification process

When verifying a component against Figma:

1. Open the component frame in Figma Dev Mode. The Figma MCP server (`mcp__figma__*`) is the canonical way to read design specs — `get_design_context` for code+screenshot, `get_variable_defs` for token mappings.
2. Compare against the rendered component in the dev docs (Vite dev server on `:5173`). Use `getComputedStyle()` to read actual `letter-spacing`, `border-radius`, etc. — pixel comparison beats screenshot comparison for spacing/typography.
3. Drift falls into three buckets:
   - **Token drift** — a token value disagrees with Figma. Fix in the export pipeline or in `tailwind/plugin.js`.
   - **Component drift** — the component uses the wrong token. Fix in the component.
   - **Intentional extension** — must be listed in [§ Code-only extensions](#code-only-extensions). Add it there.

Historical record of full-component verifications. Each row states what was true
on its date, not what is checked today:

| Component | Figma node | Date | Notes |
|---|---|---|---|
| `Button` (sm/md/lg) | [`25393-27651`](https://www.figma.com/design/kMYnZ9ougpSSQBdjZCgtdX/espresso-2.0?node-id=25393-27651) | 2026-05-24 | Pixel-accurate after ADR-0004 and ADR-0005. xs/xl/2xl + blue/green/etc. themes are code-only extensions. |
