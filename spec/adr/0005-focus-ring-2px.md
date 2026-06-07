# Focus ring is 2px

**Status**: accepted

## Context

Figma espresso v2 specifies the keyboard focus indicator as a 2px outset drop-shadow with no offset and no blur — effectively a 2px solid ring tight against the component edge:

- gray: `0 0 0 2px #C9C9C9E5` (~90% opacity gray)
- red: `0 0 0 2px #FA9C9DE5` (~90% opacity red)

The Figma typography variables expose these as `focus/light/default` and `focus/light/red`.

The historical implementation in `frappe-ui` components used Tailwind's `focus-visible:ring` utility, which defaults to a **3px** ring width. The result was a focus indicator 50% wider than the design intended, with subtly different color (`outline-gray-3` = `#c7c7c7` vs Figma's `#C9C9C9`).

## Decision

All interactive components use `focus-visible:ring-2` (2px width) with theme-appropriate `ring-<color>` for the color stop. The ring is **not** offset and has no blur — matching Figma's `0 0 0 2px <color>` drop-shadow exactly.

Theme color mapping for the ring stop:

| Theme | Ring color utility |
|---|---|
| gray (default) | `ring-outline-gray-3` |
| red    | `ring-outline-red-3` |
| blue   | `ring-blue-400` |
| green  | `ring-outline-green-3` |

Blue and green theme ring colors are project conventions — Figma does not define focus colors for those themes (see [`foundations.md`](../foundations.md#themes--colors)).

## Rationale

- Tailwind's `ring` defaults to 3px because that's Tailwind's house style, not a design-system decision. Adopting `ring-2` brings the implementation to the Figma spec without re-implementing the box-shadow machinery.
- Using `ring-2` instead of a custom `shadow-[0_0_0_2px_…]` keeps consumer-app dark-mode overrides via `--tw-ring-color` working, and preserves the existing CSS-variable plumbing.
- The 90%-opacity color stop (`E5` alpha in Figma) is approximated by the solid `outline-gray-3` / `outline-red-3` tokens. The visual difference is sub-perceptual against most backgrounds; if exact alpha is needed later, the `ring-<color>` token can be redefined globally.

## Consequences

- Every interactive component (Button, FormControl, Tabs, Checkbox, MenuItem, etc.) should converge on `focus-visible:ring-2 focus-visible:ring-<themed-color>`. Existing usages of bare `focus-visible:ring` are drift and should migrate.
- Button is the first migration; verified against Figma node `25393-27651`.
- `form-input` / `form-textarea` / `form-select` already use `focus-visible:ring-2` in `tailwind/plugin.js` — no change needed there.
- If a future Figma update changes the ring width, this is a single-token change (`ring-2` → `ring-<n>`) per component.
