# Focus ring is a global 2px outline

**Status**: accepted (amended — see [Amendment](#amendment-global-outline-based-ring))

## Context

Figma espresso v2 specifies the keyboard focus indicator as a 2px outset drop-shadow with no offset and no blur — effectively a 2px solid ring tight against the component edge:

- gray: `0 0 0 2px #C9C9C9E5` (~90% opacity gray)
- red: `0 0 0 2px #FA9C9DE5` (~90% opacity red)

The Figma variables expose these as `focus/light/*` (2px) and `focus/dark/*` (3px), synced into `tailwind/generated/effects.json`.

The historical implementation in `frappe-ui` components used Tailwind's `focus-visible:ring` utility, which defaults to a **3px** ring width. The result was a focus indicator 50% wider than the design intended, with subtly different color (`outline-gray-3` = `#c7c7c7` vs Figma's `#C9C9C9`).

## Decision (original)

All interactive components use `focus-visible:ring-2` (2px width) with theme-appropriate `ring-<color>` for the color stop. The ring is **not** offset and has no blur — matching Figma's `0 0 0 2px <color>` drop-shadow exactly.

This was later superseded by `focus-visible:focus-ring{-<color>}` utilities backed by the `--focus-*` shadow variables, and then by the amendment below.

## Amendment: global outline-based ring

Two problems surfaced with the per-component box-shadow approach:

1. **Opt-in is leaky.** Every interactive element needed `focus-visible:focus-ring` (plus `outline-none` to kill the UA ring); anything missed had no indicator at all.
2. **box-shadow collides.** `.focus-ring` set `box-shadow`, so it fought any `shadow-*` / `focus:shadow-sm` / `ring-*` utility on the same element — whichever lost the cascade silently disappeared (TextInput had exactly this conflict).

### Decision

The default focus ring is applied **globally** in the plugin's base layer, implemented as a CSS **outline**:

```css
:focus-visible {
  outline: var(--focus-outline-default); /* 2px solid #c9c9c9e5 light / 3px solid #464646cc dark */
  outline-offset: 0px;
}
```

- `colorPalette.js#generateEffectVariables` emits `--focus-outline-<name>` (`<spread> solid <color>`, theme-flipped) alongside the legacy `--focus-<name>` shadow strings.
- The `.focus-ring{-<name>}` utilities are outline-based too. They exist for **themed overrides** (`focus-visible:focus-ring-red`) and **non-focus states** (`data-[state=open]:focus-ring`, `focus-within:focus-ring` on wrapper patterns).
- Components do NOT declare a default focus ring; the base rule covers them. Utility classes (specificity ≥ (0,2,0), later layer) always beat the base rule, so:
  - suppress with `focus-visible:outline-none` (e.g. Dialog panel, ghost inputs),
  - retheme with `focus-visible:focus-ring-<color>` (e.g. Button solid/red).

### Rationale

- **outline can't collide** with box-shadow utilities — the conflict class disappears entirely.
- outline follows `border-radius` in all modern browsers, renders outside the box like the Figma outset shadow, and **survives forced-colors mode** (box-shadows are stripped there) — an accessibility win.
- Global default means new interactive elements are keyboard-accessible by construction; the failure mode flips from "missing ring" to "extra ring", which is visible and easy to fix.
- Light/dark width difference (2px/3px) rides the variable flip — no `dark:` variants needed.

### Consequences

- `outline-none` on a focusable element now suppresses the design-system ring, not just the UA one. Use it deliberately.
- Wrapper patterns (`focus-within:focus-ring`) keep `outline-none` on the inner input so only the wrapper shows the ring.
- Programmatically-focused containers (dialog/menu panels) keep `focus:outline-none` / `focus-visible:outline-none` to avoid rings on script focus.
- The `--focus-<name>` box-shadow variables remain emitted for backward compatibility but are no longer used by frappe-ui itself.
- Pre-existing `focus:ring-2` usages (Autocomplete, DatePicker CalendarPanel) are drift; migrate opportunistically by deleting them (the global rule takes over).
